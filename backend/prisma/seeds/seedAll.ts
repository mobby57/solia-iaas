import { seedBaseData } from './seedBaseData';
import { seedUsers } from './seedUsers';
import { seedMissions } from './seedMissions';
import { seedDonations } from './seedDonations';
import { seedDocuments } from './seedDocuments';
import { seedTagsAndComments } from './seedTagsAndComments';

async function main() {
  try {
    await seedBaseData();
    await seedUsers();
    await seedMissions();
    await seedDonations();
    await seedDocuments();
    await seedTagsAndComments();
    // Add calls to other seed files as they are created
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
