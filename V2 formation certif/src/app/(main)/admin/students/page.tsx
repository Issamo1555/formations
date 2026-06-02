'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Users, Search, Filter, BookOpen, GraduationCap, Clock, Activity, Building, Book, ChevronLeft, ChevronRight, UserCheck, Shield } from 'lucide-react';
import Link from 'next/link';

type Student = {
  id: string;
  name: string;
  email: string;
  institution: string | null;
  subject: string | null;
  isActive: boolean;
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
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const toggleActiveStatus = async (studentId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setStudents(students.map(s => 
        s.id === studentId ? { ...s, isActive: !currentStatus } : s
      ));

      const res = await fetch(`/api/admin/students/${studentId}/toggle-active`, {
        method: 'PATCH',
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Revert on error
        setStudents(students.map(s => 
          s.id === studentId ? { ...s, isActive: currentStatus } : s
        ));
        console.error('Failed to toggle status:', data.error);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      // Revert on error
      setStudents(students.map(s => 
        s.id === studentId ? { ...s, isActive: currentStatus } : s
      ));
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          student.email.toLowerCase().includes(search.toLowerCase());
    const matchesInstitution = institutionFilter ? student.institution === institutionFilter : true;
    const matchesSubject = subjectFilter ? student.subject === subjectFilter : true;
    
    return matchesSearch && matchesInstitution && matchesSubject;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, institutionFilter, subjectFilter]);

  // Metrics computation
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.isActive).length;
  const totalTimeSpent = students.reduce((acc, curr) => acc + curr.totalTimeSpent, 0);
  
  const institutionCounts = students.reduce((acc, curr) => {
    if (curr.institution) {
      acc[curr.institution] = (acc[curr.institution] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const topInstitution = Object.entries(institutionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

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
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="inline-flex items-center text-sm text-[var(--text-muted)] hover:text-primary transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg w-fit">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour
          </Link>
        </div>
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
                <th className="px-6 py-4 font-semibold text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary border border-primary/20 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-shadow">
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
                          <span className="font-semibold w-16">Inscrit:</span>
                          <span className="text-[var(--foreground)]">{new Date(student.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <span className="font-semibold w-16">Dernier:</span>
                          <span className="text-[var(--foreground)]">{new Date(student.lastActivity).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {student.institution ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20 w-fit">
                            <Building className="w-3.5 h-3.5" />
                            {student.institution}
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] italic">Non renseigné</span>
                        )}
                        {student.subject && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 w-fit">
                            <Book className="w-3.5 h-3.5" />
                            {student.subject}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.unlockedCourses.length > 0 ? (
                        <div className="space-y-3">
                          {student.unlockedCourses.map((uc, i) => (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="truncate max-w-[150px] font-medium" title={uc.course.titleFr}>
                                  {uc.course.titleFr}
                                </span>
                                <span className="font-bold text-primary">{Math.round(uc.progressPct)}%</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all relative overflow-hidden" 
                                  style={{ width: `${uc.progressPct}%` }}
                                >
                                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
                                </div>
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
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActiveStatus(student.id, student.isActive)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)] ${
                          student.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        }`}
                        title={student.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            student.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <div className={`text-xs mt-1 font-medium ${student.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {student.isActive ? 'Actif' : 'Désactivé'}
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-white/[0.01]">
            <p className="text-sm text-[var(--text-muted)]">
              Affichage de <span className="font-semibold text-[var(--foreground)]">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-semibold text-[var(--foreground)]">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> sur <span className="font-semibold text-[var(--foreground)]">{filteredStudents.length}</span> étudiants
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm px-2 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'hover:bg-white/5 text-[var(--text-muted)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-ghost btn-sm px-2 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
