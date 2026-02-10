const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.eventEquipment.deleteMany();
  await prisma.eventChecklistItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.calendarEntry.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('adminpass', 10);
  const memberPassword = await bcrypt.hash('memberpass', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });

  const member = await prisma.user.create({
    data: {
      username: 'member',
      passwordHash: memberPassword,
      role: 'member',
    },
  });

  console.log('Seed users created: admin/adminpass, member/memberpass');

  // Create some events
  const event1 = await prisma.event.create({
    data: {
      name: 'Sommer Open Air',
      start: new Date('2026-07-15T10:00:00'),
      end: new Date('2026-07-17T23:00:00'),
      venue: 'Stadtpark Mainz',
      contact: 'Max Mustermann (0123456789)',
      status: 'geplant',
      checklist: {
        create: [
          { area: 'Ton', text: 'Line Array hängen', done: false },
          { area: 'Licht', text: 'Moving Heads programmieren', done: false },
        ]
      },
      equipment: {
        create: [
          { itemName: 'd&b KSL', quantity: 12, condition: 'Gut', storageLocation: 'Lager A', reserved: true },
          { itemName: 'GrandMA3', quantity: 1, condition: 'Neu', storageLocation: 'Lager B', reserved: true },
        ]
      }
    }
  });

  // Create some booking requests
  await prisma.bookingRequest.create({
    data: {
      requesterName: 'Lisa Müller',
      email: 'lisa@beispiel.de',
      eventTitle: 'Hochzeit Lisa & Tom',
      start: new Date('2026-08-20T14:00:00'),
      end: new Date('2026-08-20T23:59:00'),
      location: 'Schloss Biebrich',
      audienceSize: 100,
      techNeedsCategories: JSON.stringify(['Ton', 'Licht']),
      techNeedsText: 'Kleine Anlage für Sprache und Hintergrundmusik, etwas Ambiente-Beleuchtung.',
      status: 'neu',
    }
  });

  // Create some calendar entries
  await prisma.calendarEntry.create({
    data: {
      title: 'Lager-Inventur',
      start: new Date('2026-02-15T09:00:00'),
      end: new Date('2026-02-15T17:00:00'),
      location: 'Hauptlager',
      category: 'Aufbau',
      assignedUsers: {
        connect: [{ id: member.id }]
      }
    }
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
