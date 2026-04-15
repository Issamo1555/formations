import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'student1@smartcodai.com';
  const password = '@smartcodai@';
  
  console.log(`Tentative de création de l'utilisateur : ${email}`);
  
  const passwordHash = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'USER',
    },
    create: {
      email,
      name: 'Étudiant Test',
      passwordHash,
      role: 'USER',
    },
  });
  
  console.log('Utilisateur créé/mis à jour avec succès :', user.email);
}

main()
  .catch((e) => {
    console.error('Erreur lors de la création de l\'utilisateur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
