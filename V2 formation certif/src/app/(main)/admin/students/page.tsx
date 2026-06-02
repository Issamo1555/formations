'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Users, Search, Filter, BookOpen, GraduationCap, Clock, Activity, Building, Book } from 'lucide-react';
import Link from 'next/link';

type Student = {
  id: string;
  name: string;
  email: string;
  institution: string | null;
  subject: string | null;
  createdAt: string;
  totalTimeSpent: number;
  loginCount: number;
  lastActivity: string;
  unlockedCourses: {
    progressPct: number;
    course: { titleFr: string; slug: string };
  }[];
};

export default function AdminStudentsPage() {
  const { t, locale, dir } = useLocale();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch students');
      
      setStudents(data.students || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique institutions and subjects for filters
  const institutions = Array.from(new Set(students.map(s => s.institution).filter(Boolean))) as string[];
  const subjects = Array.from(new Set(students.map(s => s.subject).filter(Boolean))) as string[];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          student.email.toLowerCase().includes(search.toLowerCase());
    const matchesInstitution = institutionFilter ? student.institution === institutionFilter : true;
    const matchesSubject = subjectFilter ? student.subject === subjectFilter : true;
    
    return matchesSearch && matchesInstitution && matchesSubject;
  });

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return `${hours}h${remMins > 0 ? ` ${remMins}m` : ''}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">Erreur d'accès</h2>
        <p className="text-[var(--text-muted)]">{error}</p>
        <Link href="/dashboard" className="btn btn-primary mt-6">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 shadow-lg shadow-primary/20">
              <Users className="w-6 h-6" />
            </div>
            Suivi des Étudiants
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Gérez et suivez l'avancement des étudiants inscrits sur la plateforme.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Rechercher un étudiant par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-9 bg-white/5"
          />
        </div>
        
        <div className="flex gap-4">
          <select 
            value={institutionFilter}
            onChange={(e) => setInstitutionFilter(e.target.value)}
            className="input bg-white/5 border-border min-w-[180px]"
          >
            <option value="">Tous les établissements</option>
            {institutions.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
          
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="input bg-white/5 border-border min-w-[150px]"
          >
            <option value="">Toutes les matières</option>
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[var(--text-muted)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Étudiant</th>
                <th className="px-6 py-4 font-semibold">Inscription & Accès</th>
                <th className="px-6 py-4 font-semibold">Établissement / Matière</th>
                <th className="px-6 py-4 font-semibold">Avancement Cursus</th>
                <th className="px-6 py-4 font-semibold">Statistiques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <span className="font-semibold w-16">Inscrit le:</span>
                          <span className="text-[var(--foreground)]">{new Date(student.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <span className="font-semibold w-16">Dernier:</span>
                          <span className="text-[var(--foreground)]">{new Date(student.lastActivity).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {student.institution ? (
                          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Building className="w-3 h-3 text-secondary" />
                            {student.institution}
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] italic">Non renseigné</span>
                        )}
                        {student.subject && (
                          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Book className="w-3 h-3 text-primary" />
                            {student.subject}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.unlockedCourses.length > 0 ? (
                        <div className="space-y-3">
                          {student.unlockedCourses.map((uc, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="truncate max-w-[150px]" title={uc.course.titleFr}>
                                  {uc.course.titleFr}
                                </span>
                                <span className="font-medium">{Math.round(uc.progressPct)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all" 
                                  style={{ width: `${uc.progressPct}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] italic">Aucun cursus</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2 text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          Temps: <span className="font-medium text-[var(--foreground)]">{formatTime(student.totalTimeSpent)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-blue-500" />
                          Connexions: <span className="font-medium text-[var(--foreground)]">{student.loginCount}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 mb-3 opacity-20" />
                      <p>Aucun étudiant trouvé.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
