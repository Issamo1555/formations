'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, CheckCircle, Terminal, Trophy, ChevronRight, Lock, Code } from 'lucide-react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import * as Fr from 'blockly/msg/fr';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';
import { phpGenerator } from 'blockly/php';
import DarkTheme from '@blockly/theme-dark';
import confetti from 'canvas-confetti';

// Set locale to French
Blockly.setLocale(Fr as any);

type Language = 'javascript' | 'python' | 'php';

const TOOLBOX_CONFIG = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logique',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    {
      kind: 'category',
      name: 'Boucles',
      colour: '#5CA65C',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#5C68A6',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
    {
      kind: 'category',
      name: 'Texte',
      colour: '#5CA68D',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_print' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#A65C81',
      custom: 'VARIABLE',
    },
  ],
};

const EXAMPLES = [
  {
    id: 'ex1',
    title: 'Modèle : Boucle Simple',
    instruction: 'Cet exemple montre comment utiliser une boucle pour répéter une action plusieurs fois.',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" x="20" y="20"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="text_print"><value name="TEXT"><block type="text"><field name="TEXT">Tour de boucle !</field></block></value></block></statement></block></xml>'
  },
  {
    id: 'ex2',
    title: 'Modèle : Condition (Si/Alors)',
    instruction: 'Cet exemple compare deux nombres. Si 10 est plus grand que 5, il affiche un message de succès.',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_if" x="20" y="20"><value name="IF0"><block type="logic_compare"><field name="OP">GT</field><value name="A"><block type="math_number"><field name="NUM">10</field></block></value><value name="B"><block type="math_number"><field name="NUM">5</field></block></value></block></value><statement name="DO0"><block type="text_print"><value name="TEXT"><block type="text"><field name="TEXT">10 est bien plus grand que 5 !</field></block></value></block></statement></block></xml>'
  }
];

const LEVELS = [
  {
    id: 1,
    title: 'Le premier mot',
    instruction: "Créez un algorithme qui affiche exactement le texte 'Bonjour le monde !'",
    initialXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="text_print" x="20" y="20"></block></xml>',
    verify: (logs: string[]) => logs.some(l => l.trim() === 'Bonjour le monde !')
  },
  {
    id: 2,
    title: 'Les mathématiques',
    instruction: "Affichez le résultat de 5 + 7 en utilisant le bloc d'addition.",
    initialXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="text_print" x="20" y="20"></block></xml>',
    verify: (logs: string[]) => logs.some(l => l.trim() === '12')
  },
  {
    id: 3,
    title: 'Le pouvoir de la boucle',
    instruction: 'Utilisez une boucle pour afficher le mot "Bravo" exactement 3 fois.',
    initialXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" x="20" y="20"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block></xml>',
    verify: (logs: string[]) => {
      const bravos = logs.filter(l => l.trim().toLowerCase() === 'bravo');
      return bravos.length === 3;
    }
  }
];

export default function BlocklyEditor() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentExampleId, setCurrentExampleId] = useState<string | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [output, setOutput] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('javascript');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId)!;
  const currentExample = EXAMPLES.find(e => e.id === currentExampleId);

  // Initialisation de Blockly
  useEffect(() => {
    if (blocklyDiv.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: TOOLBOX_CONFIG,
        theme: DarkTheme,
        grid: {
          spacing: 20,
          length: 3,
          colour: 'rgba(255,255,255,0.1)',
          snap: true,
        },
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
      });

      loadLevelBlocks(currentLevel.initialXml);

      workspaceRef.current.addChangeListener(() => {
        updateGeneratedCode();
        setSuccess(false);
      });
    }

    return () => {
      // Cleanup omitted for Next.js strict mode compatibility
    };
  }, []);

  // Changement de niveau
  useEffect(() => {
    if (workspaceRef.current && currentExampleId === null) {
      loadLevelBlocks(currentLevel.initialXml);
      setOutput([]);
      setSuccess(false);
    }
  }, [currentLevelId, currentExampleId]);

  // Changement d'exemple
  useEffect(() => {
    if (workspaceRef.current && currentExample) {
      loadLevelBlocks(currentExample.xml);
      setOutput([]);
      setSuccess(false);
    }
  }, [currentExampleId]);

  // Changement de langue
  useEffect(() => {
    updateGeneratedCode();
  }, [language]);

  const updateGeneratedCode = () => {
    if (!workspaceRef.current) return;
    let code = '';
    if (language === 'javascript') {
      code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    } else if (language === 'python') {
      code = pythonGenerator.workspaceToCode(workspaceRef.current);
    } else if (language === 'php') {
      code = phpGenerator.workspaceToCode(workspaceRef.current);
      if (code) code = "<?php\n\n" + code;
    }
    setGeneratedCode(code);
  };

  const loadLevelBlocks = (xmlString: string) => {
    if (!workspaceRef.current) return;
    workspaceRef.current.clear();
    Blockly.Xml.domToWorkspace(
      Blockly.utils.xml.textToDom(xmlString),
      workspaceRef.current
    );
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  // Chargement asynchrone de Pyodide pour Python
  const loadPyodide = async () => {
    const globalObj = window as any;
    if (globalObj.pyodide) return globalObj.pyodide;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.onload = async () => {
        try {
          globalObj.pyodide = await globalObj.loadPyodide();
          resolve(globalObj.pyodide);
        } catch (e) {
          reject(e);
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const executeJavascript = async (code: string, logs: string[]) => {
    const originalAlert = window.alert;
    window.alert = (msg: any) => logs.push(String(msg));
    try {
      // eslint-disable-next-line no-eval
      eval(code);
    } finally {
      window.alert = originalAlert;
    }
  };

  const executePython = async (code: string, logs: string[]) => {
    logs.push("⏳ Chargement de l'environnement Python WebAssembly...");
    setOutput([...logs]);
    
    try {
      const pyodide = await loadPyodide() as any;
      
      // Override console.log temporarily to capture Python print()
      // Pyodide forwards sys.stdout to console.log by default
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        // Only capture strings that look like our print output to avoid noise,
        // or just capture everything during execution.
        const msg = args.join(' ');
        if (!msg.startsWith('Python initialization') && !msg.includes('Pyodide')) {
           logs.push(msg);
        }
      };

      try {
        await pyodide.runPythonAsync(code);
      } finally {
        console.log = originalConsoleLog;
      }
      
      // Supprimer le log de chargement
      logs.shift(); 
    } catch (e: any) {
      logs.shift(); // Remove loading log
      throw e;
    }
  };

  const handleRun = async () => {
    if (isExecuting || !workspaceRef.current) return;
    setIsExecuting(true);
    setOutput([]);
    setSuccess(false);
    const logs: string[] = [];
    
    let codeToExecute = '';
    if (language === 'javascript') {
      codeToExecute = javascriptGenerator.workspaceToCode(workspaceRef.current);
    } else if (language === 'python') {
      codeToExecute = pythonGenerator.workspaceToCode(workspaceRef.current);
    }

    try {
      if (!codeToExecute.trim() && language !== 'php') {
        logs.push("⚠️ L'espace de travail est vide.");
      } else {
        if (language === 'javascript') {
          await executeJavascript(codeToExecute, logs);
        } else if (language === 'python') {
          await executePython(codeToExecute, logs);
        } else if (language === 'php') {
          logs.push("L'exécution PHP via WebAssembly arrive bientôt !");
          logs.push("Pour l'instant, vous pouvez visualiser le code généré à droite.");
        }
      }
    } catch (e: any) {
      logs.push("❌ Erreur : " + e.message);
    } finally {
      // Vérification du défi (uniquement si ce n'est pas PHP et pas un exemple)
      if (language !== 'php' && !currentExampleId) {
        const isSuccess = currentLevel.verify(logs);
        if (isSuccess) {
          logs.push('✅ Défi réussi ! Bravo !');
          setSuccess(true);
          triggerConfetti();
          if (!unlockedLevels.includes(currentLevelId + 1) && currentLevelId < LEVELS.length) {
            setUnlockedLevels([...unlockedLevels, currentLevelId + 1]);
          }
        } else if (codeToExecute.trim()) {
          logs.push('❌ Résultat incorrect. Réessayez !');
        }
      }
      
      setOutput([...logs]);
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    if (currentExample) {
      loadLevelBlocks(currentExample.xml);
    } else {
      loadLevelBlocks(currentLevel.initialXml);
    }
    setOutput([]);
    setSuccess(false);
  };

  const getLanguageExt = () => {
    if (language === 'javascript') return '.js';
    if (language === 'python') return '.py';
    if (language === 'php') return '.php';
    return '';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px] animate-fade-in">
      <style dangerouslySetInnerHTML={{__html: ".blocklyHtmlInput { color: #000 !important; background-color: #fff !important; }"}} />
      
      {/* Panneau Latéral : Niveaux */}
      <div className="w-full lg:w-64 flex flex-col gap-4">
        {/* Sélecteur de langage */}
        <div className="card border-0 backdrop-blur-xl bg-white/5 shadow-xl ring-1 ring-white/10 p-2 flex gap-1 rounded-2xl">
          {(['javascript', 'python', 'php'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={"flex-1 text-xs font-semibold py-2 rounded-xl transition-all capitalize " + (
                language === lang ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {lang === 'javascript' ? 'JS' : lang}
            </button>
          ))}
        </div>

        <div className="card border-0 backdrop-blur-xl bg-white/5 shadow-xl ring-1 ring-white/10 text-white p-5 flex flex-col gap-4" style={{ backgroundColor: 'var(--bg-panel)' }}>
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Les Défis
          </h3>
          <div className="space-y-2">
            {LEVELS.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isCurrent = currentLevelId === level.id;
              return (
                <button
                  key={level.id}
                  disabled={!isUnlocked}
                  onClick={() => { setCurrentLevelId(level.id); setCurrentExampleId(null); }}
                  className={"w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all " + (
                    isCurrent && !currentExampleId
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : isUnlocked 
                        ? 'bg-white/5 hover:bg-white/10 text-[var(--text-main)]' 
                        : 'bg-white/5 text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={"flex items-center justify-center w-6 h-6 rounded-full text-xs " + ((isCurrent && !currentExampleId) ? 'bg-white/20' : 'bg-black/20')}>
                      {level.id}
                    </span>
                    <span className="truncate max-w-[120px] text-left">{level.title}</span>
                  </div>
                  {!isUnlocked ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card border-0 backdrop-blur-xl bg-white/5 shadow-xl ring-1 ring-white/10 text-white p-5 flex flex-col gap-4" style={{ backgroundColor: 'var(--bg-panel)' }}>
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <span className="text-xl">💡</span>
            Modèles d'Exemples
          </h3>
          <div className="space-y-2">
            {EXAMPLES.map((example) => {
              const isCurrent = currentExampleId === example.id;
              return (
                <button
                  key={example.id}
                  onClick={() => setCurrentExampleId(example.id)}
                  className={"w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all " + (
                    isCurrent 
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/30' 
                      : 'bg-white/5 hover:bg-white/10 text-[var(--text-main)]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[150px] text-left">{example.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions du niveau/exemple courant */}
        <div className="flex-1 card border-0 backdrop-blur-xl shadow-xl ring-1 ring-primary/20 p-5 bg-primary/5">
          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <span>{currentExampleId ? '📖' : '🎯'}</span> {currentExampleId ? 'Explication' : 'Objectif'}
          </h4>
          <p className="text-sm text-[var(--text-main)] leading-relaxed">
            {currentExample ? currentExample.instruction : currentLevel.instruction}
          </p>
        </div>
      </div>

      {/* Editeur Blockly */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
        <div className="p-3 border-b flex items-center justify-between backdrop-blur-md bg-[#1e1e1e]/90 z-10 border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-xs font-mono text-gray-400">Algorithmique{getLanguageExt()}</div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="btn btn-ghost btn-sm text-gray-300 hover:text-white hover:bg-white/10 h-8"
              disabled={isExecuting}
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
            <button
              onClick={handleRun}
              disabled={isExecuting}
              className={"btn btn-sm h-8 " + (success ? 'bg-green-500 hover:bg-green-600 text-white border-transparent' : 'btn-primary')}
            >
              {isExecuting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {isExecuting ? 'Exécution...' : success ? 'Réussi !' : 'Exécuter'}
            </button>
          </div>
        </div>
        <div className="flex-1 relative bg-[#1e1e1e]">
          <div ref={blocklyDiv} className="absolute inset-0" />
        </div>
      </div>

      {/* Console et Code */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* Output Console */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#0d0d12]">
          <div className="p-3 border-b flex items-center gap-2 text-white/80 bg-white/5 border-white/10">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="font-mono text-xs tracking-wider uppercase font-semibold">Terminal ({language})</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-gray-300">
            {output.length === 0 ? (
              <div className="text-gray-600 italic flex flex-col items-center justify-center h-full gap-3">
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
                <span className="text-xs text-center px-4">
                  En attente d'exécution...
                  {language === 'python' && <br/>}
                  {language === 'python' && "(Le premier lancement télécharge le moteur Pyodide)"}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {output.map((line, i) => (
                  <div key={i} className={"flex gap-2 " + (
                    line.startsWith('❌') ? 'text-red-400' : 
                    line.startsWith('✅') ? 'text-green-400' : 
                    line.startsWith('⏳') ? 'text-blue-400 animate-pulse' : 'text-gray-300'
                  )}>
                    <span className="opacity-50 select-none">❯</span>
                    <span className="break-words">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code View (Readonly) */}
        <div className="h-48 flex flex-col rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#0d0d12]">
          <div className="p-3 border-b flex items-center gap-2 text-white/80 bg-white/5 border-white/10">
            <Code className="w-4 h-4 text-primary" />
            <h3 className="font-mono text-xs tracking-wider uppercase font-semibold">Code Généré</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-[#0d0d12]">
            <pre className="font-mono text-[11px] text-gray-400 whitespace-pre-wrap leading-relaxed">
              {generatedCode || '// Le code apparaîtra ici'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
