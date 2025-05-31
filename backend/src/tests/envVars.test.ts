import { describe, it, expect } from 'vitest';
import { env } from '../env';

describe('Environment Variables', () => {
  it('should have static outbound IP addresses defined', () => {
    expect(env.STATIC_OUTBOUND_IP_1).toBeDefined();
    expect(env.STATIC_OUTBOUND_IP_1).not.toBe('');
    expect(env.STATIC_OUTBOUND_IP_2).toBeDefined();
    expect(env.STATIC_OUTBOUND_IP_2).not.toBe('');
    expect(env.STATIC_OUTBOUND_IP_3).toBeDefined();
    expect(env.STATIC_OUTBOUND_IP_3).not.toBe('');
  });
});
