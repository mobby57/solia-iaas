import { seedBaseData } from './seedBaseData';
import { seedUsers } from './seedUsers';
import { seedMissions } from './seedMissions';
import { seedDonations } from './seedDonations';
import { seedDocuments } from './seedDocuments';
import { seedTagsAndComments } from './seedTagsAndComments';

export async function seedComplete() {
  try {
    // Seed base data first (roles, organizations)
    await seedBaseData();

    // Seed users with roles and organizations
    await seedUsers();

    // Seed missions linked to organizations
    await seedMissions();

    // Seed donations linked to users and organizations
    await seedDonations();

    // Seed documents linked to donations or users
    await seedDocuments();

    // Seed tags and comments polymorphically linked
    await seedTagsAndComments();

    // Add calls to other seed files as needed
  } catch (error) {
    console.error('Error during complete seeding:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedComplete();
}
