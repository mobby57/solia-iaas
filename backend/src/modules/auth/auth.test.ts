import { describe, it, expect } from 'vitest';
import * as authService from './auth.service';

describe('Auth Service', () => {
  it('should login a user', async () => {
    // TODO: Implement login test
    const result = await authService.login({ email: 'test@example.com', password: 'password' });
    expect(result).toBeNull();
  });

  it('should register a user', async () => {
    // TODO: Implement register test
    const result = await authService.register({ email: 'test@example.com', password: 'password' });
    expect(result).toBeNull();
  });
});
