const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { institution: true }, distinct: ['institution'] });
  console.log(users);
}
main().finally(()=>prisma.$disconnect());
