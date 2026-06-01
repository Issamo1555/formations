import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return html
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<ul>([\s\S]*?)<\/ul>/gi, '$1')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n\s*\n/g, '\n\n') // Normalize newlines
    .trim();
}

function extractArray(text: string, marker: string): string | null {
  const startIdx = text.indexOf(marker);
  if (startIdx === -1) return null;
  const arrayStartIdx = startIdx + marker.indexOf('[');
  let bracketCount = 0;
  let inString: string | null = null;
  let escape = false;

  for (let i = arrayStartIdx; i < text.length; i++) {
    const char = text[i];
    if (escape) { escape = false; continue; }
    if (char === '\\\\') { escape = true; continue; }
    if (inString) { if (char === inString) inString = null; continue; }
    if (char === "'" || char === '"' || char === '`') { inString = char; continue; }
    if (char === '[') bracketCount++;
    if (char === ']') {
      bracketCount--;
      if (bracketCount === 0) return text.substring(arrayStartIdx, i + 1);
    }
  }
  return null;
}

async function main() {
  const htmlPath = path.join(__dirname, '../../apprendre-php-app.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  const course = await prisma.course.findUnique({ where: { slug: 'php' } });
  if (!course) {
    console.error('Course PHP not found');
    return;
  }

  // 1. Extract regular lessons (1-12)
  console.log('Extracting regular lessons (1-12) and converting HTML to Markdown...');
  const cleanDataStr = extractArray(html, 'const lessons = [');
  
  if (cleanDataStr) {
    try {
      const sanitizedData = cleanDataStr.replace(/<span class="[^"]+">/g, '').replace(/<\/span>/g, '');
      const lessonsData = new Function(`return ${sanitizedData};`)();
      
      for (let i = 0; i < lessonsData.length; i++) {
        const l = lessonsData[i];
        const order = i + 1;
        console.log(`Syncing Lesson ${order}: ${l.title}`);
        
        const example = l.code ? l.code.replace(/<span class="[^"]+">/g, '').replace(/<\/span>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : '';
        const exercise = l.sandbox ? l.sandbox.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : '';
        const markdownContent = htmlToMarkdown(l.content);

        // @ts-ignore
        await prisma.lesson.updateMany({
          where: { courseId: course.id, order: order },
          data: {
            titleFr: l.title,
            contentFr: markdownContent,
            exampleFr: example,
            exerciseFr: exercise,
            slug: l.id || `lesson-${order}`
          }
        });
      }
    } catch (e: any) {
      console.error('Failed to parse lessons array:', e.message);
    }
  }

  // 2. Specialized Projects (13-15)
  console.log('Syncing Project Lessons (13-15)...');
  const projects = [
    { order: 13, slug: 'td-site', title: 'TD : Création d\'un site complet' },
    { order: 14, slug: 'td-panier', title: 'TD : Gestion d\'un Panier' },
    { order: 15, slug: 'mysql', title: 'Bases de données MySQL' }
  ];

  for (const p of projects) {
    // @ts-ignore
    await prisma.lesson.upsert({
      where: { courseId_order: { courseId: course.id, order: p.order } },
      update: { titleFr: p.title, slug: p.slug },
      create: {
        courseId: course.id,
        order: p.order,
        slug: p.slug,
        titleFr: p.title,
        titleEn: p.title,
        titleAr: p.title,
        contentFr: `Projet: ${p.title}`,
        contentEn: `Project: ${p.title}`,
        contentAr: `مشروع: ${p.title}`,
        category: 'Projet Pratique',
        hasQuiz: false
      }
    });
  }

  console.log('Migration and Markdown conversion complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
