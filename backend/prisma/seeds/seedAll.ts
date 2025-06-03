import { seedBaseData } from './seedBaseData';
import { seedUsers } from './seedUsers';
import { seedMissions } from './seedMissions';
import { seedDonations } from './seedDonations';
import { seedDocuments } from './seedDocuments';
import { seedTagsAndComments } from './seedTagsAndComments';

export async function seedAll() {
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
    throw error;
  }
}
