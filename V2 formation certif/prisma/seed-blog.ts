/**
 * Seed sample blog posts
 * Usage: npx tsx prisma/seed-blog.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding blog posts...');

  // Get admin user
  const admin = await prisma.user.findFirst({ where: { email: 'admin@smartcodai.com' } });
  if (!admin) {
    console.log('No admin user found. Run seed.ts first.');
    return;
  }

  const posts = [
    {
      slug: 'lancement-smartcodai-v2',
      titleFr: 'Lancement de Smartcodai V2 - Une plateforme entierement repensee',
      titleEn: 'Smartcodai V2 Launch - A Completely Redesigned Platform',
      titleAr: 'إطلاق Smartcodai V2 - منصة معاد تصميمها بالكامل',
      contentFr: `Nous sommes fiers d'annoncer le lancement de Smartcodai V2, une complete refonte de notre plateforme de formation.

### Quoi de neuf ?

- Interface moderne et responsive
- Support trilingue (Francais, Anglais, Arabe)
- System de quiz interactifs avec scoring
- Certificats avec QR code verifiable
- Suivi de progression en temps reel
- Blog technologique pour les actualites

### Notre vision

Smartcodai a ete cree avec une mission claire : rendre l'apprentissage de la programmation accessible, pratique et certifiant. Avec cette V2, nous franchissons un cap majeur.

### Prochaines etapes

- Integration de paiements Stripe
- Notifications par email
- Mode hors-ligne pour les cours
- Application mobile

Restez connectes pour plus de mises a jour !`,
      contentEn: `We are proud to announce the launch of Smartcodai V2, a complete redesign of our learning platform.

### What's new?

- Modern and responsive interface
- Trilingual support (French, English, Arabic)
- Interactive quiz system with scoring
- Certificates with verifiable QR code
- Real-time progress tracking
- Tech blog for news

### Our vision

Smartcodai was created with a clear mission: make programming learning accessible, practical and certifying. With V2, we're taking a major step forward.

### Next steps

- Stripe payment integration
- Email notifications
- Offline mode for courses
- Mobile application

Stay tuned for more updates!`,
      contentAr: `نفخر بالإعلان عن إطلاق Smartcodai V2، إعادة تصميم كاملة لمنصة التعلم لدينا.

### ما الجديد؟

- واجهة عصرية ومتجاوبة
- دعم ثلاثي اللغات
- نظام اختبارات تفاعلية مع تسجيل
- شهادات مع رمز QR قابل للتحقق
- تتبع التقدم في الوقت الحقيقي
- مدونة تكنولوجية للأخبار

### رؤيتنا

تم إنشاء Smartcodai بمهمة واضحة: جعل تعلم البرمجة في المتناول وعملي ومعتمد.

### الخطوات القادمة

- تكامل المدفوعات
- إشعارات البريد الإلكتروني
- وضع عدم الاتصال
- تطبيق الهاتف المحمول`,
      excerptFr: 'Decouvrez toutes les nouveautes de la V2 : interface trilingue, quiz, certificats QR code et bien plus.',
      excerptEn: 'Discover all V2 features: trilingual interface, quizzes, QR code certificates and more.',
      excerptAr: 'اكتشف جميع ميزات V2: واجهة ثلاثية اللغات واختبارات وشهادات QR والمزيد.',
      category: 'news',
      isPublished: true,
      authorId: admin.id,
    },
    {
      slug: 'php-8-4-nouveautes',
      titleFr: 'PHP 8.4 : Les nouveautes qui changent tout',
      titleEn: 'PHP 8.4: Game-Changing New Features',
      titleAr: 'PHP 8.4: الميزات الجديدة التي تغير كل شيء',
      contentFr: `PHP 8.4 apporte son lot de nouveautes passionnantes pour les developpeurs web.

### Proprietes asymetriques

La plus grande nouveaute de PHP 8.4 est l'introduction des proprietes asymetriques, permettant de definir des visibilites differentes pour le getter et le setter.

\`\`\`php
class User {
    public private(set) string $email;
}
\`\`\`

### Nouvelles fonctions

- \`array_find()\` - Trouver un element dans un tableau
- \`array_find_key()\` - Trouver la cle d'un element
- \`mb_trim()\` - Supprimer les espaces multibytes

### Pourquoi c'est important

Ces ameliorations rendent PHP plus expressif et plus facile a utiliser, tout en maintenant sa performance legendaire.

### Conclusion

PHP continue d'evoluer et de s'ameliorer. Si vous ne l'avez pas regarde depuis PHP 7, vous serez surpris !`,
      contentEn: `PHP 8.4 brings exciting new features for web developers.

### Asymmetric Properties

The biggest feature in PHP 8.4 is asymmetric properties, allowing different visibility for getter and setter.

### New Functions

- \`array_find()\` - Find an element in an array
- \`array_find_key()\` - Find the key of an element
- \`mb_trim()\` - Trim multibyte spaces

### Why it matters

These improvements make PHP more expressive and easier to use, while maintaining its legendary performance.`,
      contentAr: `PHP 8.4 يجلب ميزات جديدة مثيرة لمطوري الويب.

### الخصائص غير المتماثلة

أكبر ميزة في PHP 8.4 هي الخصائص غير المتماثلة.

### دوال جديدة

- \`array_find()\`
- \`array_find_key()\`
- \`mb_trim()\``,
      excerptFr: 'PHP 8.4 arrive avec des proprietes asymetriques, array_find() et bien d\'autres ameliorations.',
      excerptEn: 'PHP 8.4 arrives with asymmetric properties, array_find() and many more improvements.',
      excerptAr: 'PHP 8.4 يأتي بخصائص غير متماثلة و array_find() والمزيد.',
      category: 'update',
      isPublished: true,
      authorId: admin.id,
    },
    {
      slug: 'guide-automatisation-n8n',
      titleFr: 'Guide : Automatiser votre workflow avec n8n en 2026',
      titleEn: 'Guide: Automate Your Workflow with n8n in 2026',
      titleAr: 'دليل: أتمتة سير العمل الخاص بك مع n8n في 2026',
      contentFr: `n8n est devenu l'outil d'automatisation open-source de reference en 2026.

### Pourquoi n8n ?

- Plus de 400 integrations natives
- Interface visuelle intuitive
- Self-hostable (vos donnees restent chez vous)
- Gratuit pour un usage personnel

### Cas d'usage populaires

1. **Sync CRM** : Synchroniser vos contacts entre outils
2. **Alertes monitoring** : Recevoir des notifications automatiques
3. **Generation de contenu** : Pipeline IA automatique
4. **Facturation** : Generer et envoyer des factures

### Commencer

1. Installez n8n avec Docker
2. Creez votre premier workflow
3. Connectez vos applications
4. Automatisez !

### Notre cours

Nous avons un cours complet sur n8n dans Smartcodai. Inscrivez-vous pour apprendre de A a Z !`,
      contentEn: `n8n has become the go-to open-source automation tool in 2026.

### Why n8n?

- 400+ native integrations
- Intuitive visual interface
- Self-hostable (your data stays with you)
- Free for personal use

### Popular use cases

1. **CRM Sync**: Synchronize contacts between tools
2. **Monitoring alerts**: Receive automatic notifications
3. **Content generation**: Automatic AI pipeline
4. **Billing**: Generate and send invoices

### Getting started

1. Install n8n with Docker
2. Create your first workflow
3. Connect your applications
4. Automate!`,
      contentAr: `أصبح n8n أداة الأتمتة مفتوحة المصدر المرجعية في 2026.

### لماذا n8n؟

- أكثر من 400 تكامل أصلي
- واجهة بصرية بديهية
- قابل للاستضافة الذاتية
- مجاني للاستخدام الشخصي`,
      excerptFr: 'Decouvrez comment n8n peut automatiser vos taches repetitives et gagner des heures chaque semaine.',
      excerptEn: 'Discover how n8n can automate your repetitive tasks and save hours every week.',
      excerptAr: 'اكتشف كيف يمكن لـ n8n أتمتة مهامك المتكررة وتوفير ساعات كل أسبوع.',
      category: 'tutorial',
      isPublished: true,
      authorId: admin.id,
    },
  ];

  for (const postData of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: postData.slug } });
    if (!existing) {
      await prisma.blogPost.create({ data: postData });
      console.log(`  ✓ Created: ${postData.slug}`);
    }
  }

  console.log('Blog seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
