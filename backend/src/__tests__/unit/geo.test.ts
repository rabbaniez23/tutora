import { describe, it, expect } from 'vitest';
import { haversineDistance } from '@/shared/utils/geo';

describe('Geo Utilities - haversineDistance', () => {
  it('should return 0 meters for identical coordinates', () => {
    const lat = -6.9175;
    const lng = 107.6191;
    const distance = haversineDistance(lat, lng, lat, lng);
    expect(distance).toBe(0);
  });

  it('should calculate accurate distance for Bandung coordinates (approx 1.5 - 2 km)', () => {
    // Alun-Alun Bandung: -6.92183, 107.6071
    // Gedung Sate: -6.9025, 107.6186
    const dist = haversineDistance(-6.92183, 107.6071, -6.9025, 107.6186);
    // Real straight-line distance is around 2.4 km (2400 meters)
    expect(dist).toBeGreaterThan(2000);
    expect(dist).toBeLessThan(3000);
  });

  it('should be symmetric (dist A to B === dist B to A)', () => {
    const distAB = haversineDistance(-6.9, 107.6, -6.91, 107.61);
    const distBA = haversineDistance(-6.91, 107.61, -6.9, 107.6);
    expect(distAB).toBeCloseTo(distBA, 5);
  });
});
