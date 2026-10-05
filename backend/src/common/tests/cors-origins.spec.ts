import { describe, expect, it } from 'vitest';
import { getCorsOrigins } from '../config/cors-origins.js';

describe('getCorsOrigins', () => {
  it('uses browser origins even when the configured URL includes /api', () => {
    expect(getCorsOrigins(' https://frontend.example/api, http://localhost:3000/ '))
      .toEqual(['https://frontend.example', 'http://localhost:3000']);
  });

  it('handles an empty configuration', () => {
    expect(getCorsOrigins(undefined)).toEqual([]);
  });
});
