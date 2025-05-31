const { seedBaseData } = require('./seedBaseData.ts');
const { seedUsers } = require('./seedUsers.ts');
const { seedMissions } = require('./seedMissions.ts');
const { seedDonations } = require('./seedDonations.ts');
const { seedDocuments } = require('./seedDocuments.ts');
const { seedTagsAndComments } = require('./seedTagsAndComments.ts');

async function main() {
  try {
    await seedBaseData();
    await seedUsers();
    await seedMissions();
    await seedDonations();
    await seedDocuments();
    await seedTagsAndComments();
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
