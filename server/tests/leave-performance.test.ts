import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLeaveDays } from '../src/services/leave.service';
import { calculatePerformanceScore, getPerformanceRating } from '../src/services/performance.service';

test('calculateLeaveDays counts inclusive days across a range', () => {
  assert.equal(calculateLeaveDays('2026-07-01', '2026-07-03'), 3);
  assert.equal(calculateLeaveDays('2026-07-10', '2026-07-10'), 1);
});

test('calculatePerformanceScore uses weighted scoring and clamps to 100', () => {
  const score = calculatePerformanceScore(4, 3, 6, 4, 0.9);
  assert.equal(score, 67.3);
});

test('getPerformanceRating maps scores to the expected band', () => {
  assert.equal(getPerformanceRating(95), 'Exceptional');
  assert.equal(getPerformanceRating(67.3), 'Good');
  assert.equal(getPerformanceRating(35), 'Critical');
});
