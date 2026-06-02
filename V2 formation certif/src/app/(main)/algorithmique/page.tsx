'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from '@/context/LocaleContext';

// Dynamic import with ssr: false to prevent Next.js from rendering Blockly on the server
const BlocklyEditor = dynamic(() => import('@/components/BlocklyEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] border rounded-2xl bg-[var(--bg-panel)]" style={{ borderColor: 'var(--border-light)' }}>
      <div className="flex flex-col items-center gap-4 text-[var(--text-muted)]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p>Chargement de l'environnement visuel...</p>
      </div>
    </div>
  ),
});

export default function AlgorithmiquePage() {
  const { dir } = useLocale();

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12" dir={dir}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 shadow-lg shadow-primary/20 text-2xl">
              🧩
            </div>
            Algorithmique Visuelle
          </h1>
          <p className="text-[var(--text-muted)] mt-2 max-w-2xl">
            Apprenez les bases de la programmation sans taper une seule ligne de code. 
            Glissez, déposez et assemblez les blocs pour créer votre algorithme !
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border p-4 bg-primary/5 text-sm flex gap-3 items-start" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
        <span className="text-xl">💡</span>
        <div>
          <p className="font-semibold text-[var(--text-main)] mb-1">Comment ça marche ?</p>
          <p className="text-[var(--text-muted)]">
            Utilisez les catégories à gauche pour trouver des blocs. Glissez-les dans l'espace central et emboîtez-les.
            Le code JavaScript correspondant sera généré en temps réel en bas à droite. Cliquez sur "Exécuter" pour voir le résultat !
          </p>
        </div>
      </div>

      {/* Editor Space */}
      <BlocklyEditor />
    </div>
  );
}
