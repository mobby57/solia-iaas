import { describe, it, expect } from 'vitest';
import { updateUser } from './user.service';

describe('User Service', () => {
  it('should update a user', async () => {
    const userId = 'some-user-id';
    const updatedUser = await updateUser(userId, { name: 'Updated User' }); // Changed fullName to name
    expect(updatedUser.name).toBe('Updated User'); // Changed fullName to name
  });
});
