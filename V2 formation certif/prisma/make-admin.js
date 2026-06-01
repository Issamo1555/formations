const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'issamo1555@gmail.com';
  console.log(`Setting ${email} as ADMIN in database...`);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: {
      email,
      name: 'Issam',
      role: 'ADMIN',
    },
  });
  
  console.log('Success! User details:', user);
}

main()
  .catch((e) => {
    console.error('Error setting user to admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
