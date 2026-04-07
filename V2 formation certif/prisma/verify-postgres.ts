import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Switching to PostgreSQL ===');
  
  // Check connection
  const result = await prisma.$queryRaw`SELECT version()`;
  console.log('Database connected:', result);
  
  // Count records
  const users = await prisma.user.count();
  const courses = await prisma.course.count();
  const lessons = await prisma.lesson.count();
  const blogPosts = await prisma.blogPost.count();
  
  console.log(`✅ Users: ${users}`);
  console.log(`✅ Courses: ${courses}`);
  console.log(`✅ Lessons: ${lessons}`);
  console.log(`✅ Blog Posts: ${blogPosts}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
