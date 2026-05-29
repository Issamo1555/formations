'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
}

// Simple syntax highlighting for PHP/JS/Python
const highlightSyntax = (code: string, lang: string): string => {
  if (!code) return '';

  // Escape HTML entities first
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const results: { start: number; end: number; color: string; text: string }[] = [];

  const addMatches = (regex: RegExp, color: string) => {
    let match: RegExpExecArray | null;
    const localRegex = new RegExp(regex.source, regex.flags);
    while ((match = localRegex.exec(highlighted)) !== null) {
      const currentMatch = match;
      // Check if this range overlaps with any existing result
      const overlaps = results.some(r => 
        !(currentMatch.index >= r.end || currentMatch.index + currentMatch[0].length <= r.start)
      );

      if (!overlaps) {
        results.push({
          start: currentMatch.index,
          end: currentMatch.index + currentMatch[0].length,
          color,
          text: currentMatch[0],
        });
      }
    }
  };

  // Order matters: comments and strings first (higher priority)
  addMatches(/(\/\*[\s\S]*?\*\/)/g, '#6a9955');
  addMatches(/('''[\s\S]*?'''|"""[\s\S]*?""")/g, '#ce9178');
  addMatches(/(\/\/.*|#.*)/g, '#6a9955');
  addMatches(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '#ce9178');
  addMatches(/(\$[a-zA-Z_]\w*)\b/g, '#9cdcfe');
  addMatches(/\b(function|return|if|else|elseif|for|foreach|while|do|switch|case|break|continue|class|extends|implements|interface|abstract|private|protected|public|static|const|var|let|new|this|self|parent|try|catch|finally|throw|async|await|import|export|from|default|def|print|echo|print_r|var_dump|require|include|use|namespace|as|in|of|yield|typeof|instanceof|void|null|true|false|None|True|False)\b/g, '#569cd6');
  addMatches(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '#dcdcaa');
  addMatches(/\b(\d+\.?\d*)\b/g, '#b5cea8');

  // Sort by start position (reverse to build from end)
  results.sort((a, b) => b.start - a.start);

  // Replace in reverse order to preserve indices
  for (const r of results) {
    highlighted = highlighted.slice(0, r.start) +
      `<span style="color: ${r.color}">${r.text}</span>` +
      highlighted.slice(r.end);
  }

  return highlighted;
};

export default function CodeEditor({ code, onChange, language = 'code' }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  // Sync scroll between textarea and overlay
  const handleScroll = useCallback(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle tab key for indentation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newValue);
      // Set cursor position after the tab
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  }, [code, onChange]);

  const lines = code.split('\n');
  const lang = language.toLowerCase();
  const supportedLangs = ['php', 'javascript', 'js', 'python', 'py', 'html', 'css', 'bash', 'sql', 'json', 'typescript', 'ts'];
  const shouldHighlight = supportedLangs.includes(lang);

  const langLabels: Record<string, string> = {
    php: 'PHP',
    javascript: 'JavaScript',
    js: 'JavaScript',
    python: 'Python',
    py: 'Python',
    html: 'HTML',
    css: 'CSS',
    bash: 'Bash',
    sql: 'SQL',
    json: 'JSON',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    code: 'Code',
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-border/50 shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{
        background: 'linear-gradient(to bottom, #2d2d30, #252526)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div className="flex items-center gap-3">
          {/* macOS-style dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27c93f' }} />
          </div>
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#858585' }}>
            {langLabels[lang] || langLabels.code} — Éditable
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 hover:bg-white/10"
          style={{ color: '#858585' }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" style={{ color: '#27c93f' }} />
              <span style={{ color: '#27c93f' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code editor area */}
      <div className="relative overflow-hidden" style={{
        backgroundColor: '#1e1e1e',
        lineHeight: '1.6',
        minHeight: '256px',
        maxHeight: '512px'
      }}>
        {/* Line numbers column */}
        <div
          className="absolute left-0 top-0 bottom-0 select-none overflow-hidden"
          style={{
            width: '3.5rem',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRight: '1px solid rgba(255,255,255,0.04)'
          }}
        >
          <div className="py-0.5">
            {lines.map((_, index) => (
              <div
                key={index}
                className="text-right pr-3 text-xs"
                style={{ color: '#858585', height: '1.6em' }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Syntax highlighted overlay */}
        <pre
          ref={overlayRef}
          className="absolute top-0 left-[3.5rem] right-0 bottom-0 p-4 font-mono text-sm overflow-hidden pointer-events-none"
          style={{ color: '#d4d4d4' }}
          aria-hidden="true"
        >
          <code
            dangerouslySetInnerHTML={{
              __html: lines.map((line, i) => {
                const highlighted = shouldHighlight
                  ? highlightSyntax(line, lang)
                  : line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return highlighted || '&nbsp;';
              }).join('\n')
            }}
          />
        </pre>

        {/* Transparent textarea for editing */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="absolute top-0 left-[3.5rem] right-0 bottom-0 w-[calc(100%-3.5rem)] h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
          style={{
            color: 'transparent',
            caretColor: '#d4d4d4',
            WebkitTextFillColor: 'transparent',
            overflow: 'auto'
          }}
          spellCheck={false}
          placeholder="// Écrivez votre code ici..."
        />
      </div>
    </div>
  );
}
