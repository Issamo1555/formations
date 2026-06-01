import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const courseSlug = formData.get('courseSlug') as string | null;
    const language = (formData.get('language') as string | null) || 'fr';
    const category = (formData.get('category') as string | null) || 'Général';
    const splittingStrategy = (formData.get('splittingStrategy') as string | null) || 'single';
    const customMarker = formData.get('marker') as string | null;

    if (!file || !courseSlug) {
      return NextResponse.json(
        { error: 'Le fichier et le cursus cible sont requis.' },
        { status: 400 }
      );
    }

    // 1. Check if the course exists
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (!course) {
      return NextResponse.json(
        { error: `Le cursus avec le slug "${courseSlug}" n'existe pas.` },
        { status: 404 }
      );
    }

    const filename = file.name;
    const extension = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let rawText = '';
    let rawHtml = '';

    // 2. Parse file content based on extension
    if (extension === '.docx') {
      const result = await mammoth.convertToHtml({ buffer: fileBuffer });
      rawHtml = result.value;
      const textResult = await mammoth.extractRawText({ buffer: fileBuffer });
      rawText = textResult.value;
    } else if (extension === '.pdf') {
      const { PDFParse } = await import('pdf-parse');
      // @ts-ignore
      const parser = new PDFParse();
      const data = await parser.parse(fileBuffer);
      rawText = data.text;
    } else if (extension === '.html' || extension === '.htm') {
      rawHtml = fileBuffer.toString('utf-8');
      // Strip tags simple helper for rawText fallback
      rawText = rawHtml
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (extension === '.txt' || extension === '.md') {
      rawText = fileBuffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: `Format de fichier non supporté (${extension}). Les formats admis sont : .html, .pdf, .docx, .txt, .md` },
        { status: 400 }
      );
    }

    // Determine working content (prefer HTML if available for format preservation)
    const activeContent = rawHtml || rawText;

    // 3. Splitting logic
    interface LessonCandidate {
      title: string;
      content: string;
    }
    let candidates: LessonCandidate[] = [];

    const defaultTitle = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    if (splittingStrategy === 'single') {
      candidates.push({
        title: defaultTitle,
        content: activeContent,
      });
    } else if (splittingStrategy === 'marker' && customMarker) {
      const parts = activeContent.split(customMarker);
      parts.forEach((part, index) => {
        const trimmed = part.trim();
        if (trimmed.length > 0) {
          // Attempt to extract title from the first line
          const lines = trimmed.split('\n');
          const titleCandidate = lines[0].replace(/^[\s#*>-]+|[\s#*>-]+$/g, '').trim();
          const title = titleCandidate || `Leçon ${index + 1}`;
          const content = lines.slice(1).join('\n').trim();
          candidates.push({ title, content: content || trimmed });
        }
      });
    } else if (splittingStrategy === 'heading') {
      if (rawHtml) {
        // Parse HTML headings: split at <h1>, <h2>, or <h3> tags
        const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
        const matches = [...activeContent.matchAll(headingRegex)];
        
        if (matches.length === 0) {
          // Fallback to single lesson if no headings found
          candidates.push({ title: defaultTitle, content: activeContent });
        } else {
          const parts = activeContent.split(/<h[1-3][^>]*>.*?<\/h[1-3]>/gi);
          // The first part before any heading can be discarded or treated as intro
          const intro = parts[0].trim();
          if (intro.length > 30) {
            candidates.push({ title: 'Introduction', content: intro });
          }
          
          matches.forEach((match, index) => {
            const title = match[1].replace(/<[^>]*>/g, '').trim();
            const content = (parts[index + 1] || '').trim();
            if (title) {
              candidates.push({ title, content });
            }
          });
        }
      } else {
        // Parse Markdown/Plain text headings: split at lines starting with #, ##, or ###
        const lines = rawText.split('\n');
        let currentTitle = '';
        let currentBody: string[] = [];

        lines.forEach((line) => {
          const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
          if (headingMatch) {
            // Push previous lesson if it exists
            if (currentTitle || currentBody.length > 0) {
              candidates.push({
                title: currentTitle || defaultTitle,
                content: currentBody.join('\n').trim(),
              });
            }
            currentTitle = headingMatch[1].trim();
            currentBody = [];
          } else {
            currentBody.push(line);
          }
        });

        // Push last lesson
        if (currentTitle || currentBody.length > 0) {
          candidates.push({
            title: currentTitle || defaultTitle,
            content: currentBody.join('\n').trim(),
          });
        }
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "Impossible de diviser le document. Vérifiez que la stratégie de découpage correspond au format du document." },
        { status: 400 }
      );
    }

    // 4. Save to Database
    // Get highest current lesson order in this course
    const aggregate = await prisma.lesson.aggregate({
      where: { courseId: course.id },
      _max: { order: true },
    });
    const maxOrder = aggregate._max.order || 0;

    const createdLessons = [];
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const order = maxOrder + i + 1;

      // Generate slugs or unique fields if needed
      // Map multilingual fields (fallback to copies of the uploaded language)
      const title = candidate.title;
      const content = candidate.content;

      const newLesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          order,
          category,
          titleFr: language === 'fr' ? title : title,
          titleEn: language === 'en' ? title : title,
          titleAr: language === 'ar' ? title : title,
          contentFr: language === 'fr' ? content : content,
          contentEn: language === 'en' ? content : content,
          contentAr: language === 'ar' ? content : content,
          hasQuiz: false,
        },
      });

      createdLessons.push({
        id: newLesson.id,
        title: title,
        order: newLesson.order,
      });
    }

    // Update course modulesCount in Course
    await prisma.course.update({
      where: { id: course.id },
      data: {
        modulesCount: {
          increment: createdLessons.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${createdLessons.length} leçons ont été importées avec succès dans le cursus "${course.titleFr}".`,
      lessons: createdLessons,
    });
  } catch (error: any) {
    console.error('Error during course file upload & parsing:', error);
    return NextResponse.json(
      { error: `Une erreur est survenue lors de l'importation : ${error.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}
