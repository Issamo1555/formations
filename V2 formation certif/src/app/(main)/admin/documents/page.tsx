'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { FileText, Upload, Trash2, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Document = {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  size: number;
  institution: string | null;
  createdAt: string;
};

export default function AdminDocumentsPage() {
  const { t, locale, dir } = useLocale();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState('GLOBAL');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/documents');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement des documents');
      setDocuments(data.documents);
      if (data.institutions) {
        setInstitutions(data.institutions);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (description) formData.append('description', description);
      formData.append('institution', institution);

      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");

      // Reset form
      setTitle('');
      setDescription('');
      setInstitution('GLOBAL');
      setFile(null);
      // Refresh list
      fetchDocuments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression');

      fetchDocuments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 shadow-lg shadow-primary/20">
              <FileText className="w-6 h-6" />
            </div>
            Ressources & Documents
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Gérez les documents partagés avec tous les étudiants.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-6 shadow-xl sticky top-24">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Ajouter un document
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Titre du document *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="Ex: Architecture Globale"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Établissement cible (Visibilité)
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="input cursor-pointer"
                >
                  <option value="GLOBAL">🌐 Tous les établissements (Public)</option>
                  {institutions.map((inst, idx) => (
                    <option key={idx} value={inst}>
                      🏢 {inst}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Seuls les étudiants de cet établissement verront ce document.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Description (Optionnel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[80px]"
                  placeholder="Courte description du document..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Fichier *
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  required
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading || !file || !title}
                className="btn btn-primary w-full mt-4 flex justify-center"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Partager le document'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Documents Partagés
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 flex-shrink-0 mt-1">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{doc.title}</h3>
                          {doc.institution ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                              {doc.institution}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30">
                              GLOBAL
                            </span>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-sm text-[var(--text-muted)] mt-1">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                          <span>{doc.fileName}</span>
                          <span>&bull;</span>
                          <span>{formatSize(doc.size)}</span>
                          <span>&bull;</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={doc.fileUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="btn btn-ghost btn-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aucun document n'a été partagé pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
