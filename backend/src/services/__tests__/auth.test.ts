import bcrypt from 'bcrypt';
import { describe, it, expect } from 'vitest';

describe('bcrypt hashing', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'mysecretpassword';
    const hash = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });
});
