import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (language === 'php') {
      // Write code to temp file and execute with PHP
      const tmpFile = `/tmp/smartcodai_${Date.now()}.php`;
      const { writeFile, unlink } = await import('fs/promises');

      try {
        await writeFile(tmpFile, code);
        const { stdout, stderr } = await execAsync(`php ${tmpFile}`, {
          timeout: 10000, // 10s timeout
          maxBuffer: 1024 * 1024, // 1MB buffer
        });

        return NextResponse.json({
          output: stdout || stderr || '(aucun affichage)',
          language: 'php',
        });
      } finally {
        // Clean up temp file
        try {
          await unlink(tmpFile);
        } catch {}
      }
    }

    return NextResponse.json({ error: 'Language not supported' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      output: `❌ Erreur:\n${error.message || 'Erreur d\'exécution'}`,
    });
  }
}
