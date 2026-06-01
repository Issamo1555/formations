import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function main() {
  console.log('Seeding database...');

  // Create courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { slug: 'php' },
      update: {},
      create: {
        slug: 'php',
        titleFr: 'Developpement Web Backend avec PHP',
        titleEn: 'Backend Web Development with PHP',
        titleAr: 'تطوير الويب الخلفي بـ PHP',
        descFr: 'Maitrisez les bases du web dynamique, les variables, la POO et la securite.',
        descEn: 'Master dynamic web basics, variables, OOP and security.',
        descAr: 'أتقن أساسيات الويب الديناميكي والمتغيرات وOOP والأمان.',
        icon: 'code',
        modulesCount: 12,
      },
    }),
    prisma.course.upsert({
      where: { slug: 'python' },
      update: {},
      create: {
        slug: 'python',
        titleFr: 'Programmation en Python',
        titleEn: 'Programming in Python',
        titleAr: 'البرمجة بـ Python',
        descFr: 'Des bases algorithmiques jusqu\'a l\'analyse de donnees.',
        descEn: 'From algorithmic basics to data analysis.',
        descAr: 'من أساسيات الخوارزميات إلى تحليل البيانات.',
        icon: 'terminal',
        modulesCount: 10,
      },
    }),
    prisma.course.upsert({
      where: { slug: 'n8n' },
      update: {},
      create: {
        slug: 'n8n',
        titleFr: 'Automatisation avec n8n',
        titleEn: 'Automation with n8n',
        titleAr: 'الأتمتة بـ n8n',
        descFr: 'Le parcours "Zero to Hero" pour connecter vos applications via Webhooks, API et Javascript.',
        descEn: 'The "Zero to Hero" path to connect your apps via Webhooks, API and Javascript.',
        descAr: 'مسار "من الصفر إلى الاحتراف" لربط تطبيقاتك عبر Webhooks وAPI وJavascript.',
        icon: 'zap',
        modulesCount: 10,
      },
    }),
    prisma.course.upsert({
      where: { slug: 'openclaw' },
      update: {},
      create: {
        slug: 'openclaw',
        titleFr: 'Maitrise de l\'IA OpenClaw',
        titleEn: 'Mastering OpenClaw AI',
        titleAr: 'إتقان الذكاء الاصطناعي OpenClaw',
        descFr: 'Apprenez a controler et scripter des Agents IA personnels avec un acces systeme complet.',
        descEn: 'Learn to control and script personal AI Agents with full system access.',
        descAr: 'تعلم التحكم وبرمجة وكلاء الذكاء الاصطناعي الشخصيين مع وصول كامل للنظام.',
        icon: 'bot',
        modulesCount: 10,
      },
    }),
  ]);

  console.log(`Created ${courses.length} courses`);

  // Create admin user if not exists
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@smartcodai.com' },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Admin Smartcodai',
        email: 'admin@smartcodai.com',
        passwordHash: await bcrypt.hash('admin123', 12),
        role: 'ADMIN',
      },
    });
    console.log('Created admin user (admin@smartcodai.com / admin123)');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
