const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { institution: { not: null } }
  });
  
  let updatedUsers = 0;
  for (const user of users) {
    if (user.institution) {
      const normalized = user.institution.trim().toUpperCase();
      if (normalized !== user.institution) {
        await prisma.user.update({
          where: { id: user.id },
          data: { institution: normalized }
        });
        updatedUsers++;
      }
    }
  }
  
  const documents = await prisma.document.findMany({
    where: { institution: { not: null } }
  });
  
  let updatedDocs = 0;
  for (const doc of documents) {
    if (doc.institution) {
      const normalized = doc.institution.trim().toUpperCase();
      if (normalized !== doc.institution) {
        await prisma.document.update({
          where: { id: doc.id },
          data: { institution: normalized }
        });
        updatedDocs++;
      }
    }
  }

  console.log(`Normalized ${updatedUsers} users and ${updatedDocs} documents.`);
}

main().finally(() => prisma.$disconnect());
