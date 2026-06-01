'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
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

  // We'll use a sequential approach: replace patterns with marked spans directly
  // to avoid placeholder collision issues

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

export default function CodeBlock({ code, language = 'code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

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
            {langLabels[lang] || langLabels.code}
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

      {/* Code content */}
      <div className="overflow-x-auto" style={{
        backgroundColor: '#1e1e1e',
        lineHeight: '1.6'
      }}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => {
              const highlightedCode = shouldHighlight
                ? highlightSyntax(line, lang)
                : line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

              return (
                <tr
                  key={index}
                  className="transition-colors duration-150 hover:bg-white/[0.03]"
                >
                  <td
                    className="text-right select-none pl-4 pr-3 py-0.5 text-xs border-r border-white/[0.04]"
                    style={{
                      color: '#858585',
                      minWidth: '3.5rem',
                      backgroundColor: 'rgba(0,0,0,0.15)'
                    }}
                  >
                    {index + 1}
                  </td>
                  <td className="pl-4 pr-4 py-0.5">
                    <code
                      className="font-mono text-sm whitespace-pre"
                      style={{ color: '#d4d4d4' }}
                      dangerouslySetInnerHTML={{ __html: highlightedCode || '&nbsp;' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
