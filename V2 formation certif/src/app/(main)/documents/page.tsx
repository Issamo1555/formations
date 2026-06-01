'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { FileText, Download, Search } from 'lucide-react';

type Document = {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  size: number;
  createdAt: string;
};

export default function StudentDocumentsPage() {
  const { t, locale, dir } = useLocale();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement des documents');
      setDocuments(data.documents);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    (doc.description && doc.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 shadow-lg shadow-primary/20">
              <FileText className="w-6 h-6" />
            </div>
            Mes Documents
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Retrouvez ici toutes les ressources et documents partagés par vos instructeurs.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Rechercher un document..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full pl-9 bg-white/5"
        />
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-6 shadow-xl flex flex-col hover:border-primary/50 transition-colors group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2" title={doc.title}>{doc.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                    <span className="bg-white/10 px-2 py-1 rounded-md">{formatSize(doc.size)}</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {doc.description && (
                <p className="text-sm text-[var(--text-muted)] mb-6 line-clamp-3 flex-grow">
                  {doc.description}
                </p>
              )}
              
              <div className="mt-auto pt-4 border-t border-border">
                <a 
                  href={doc.fileUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-border rounded-2xl">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-white mb-2">Aucun document trouvé</p>
          <p>
            {search ? "Aucun résultat pour votre recherche." : "Aucune ressource n'est disponible pour le moment."}
          </p>
        </div>
      )}
    </div>
  );
}
