import { it, expect, describe } from 'vitest';

import { delta } from './delta';

// ----------------------------------------------------------------------

describe('delta', () => {
  it('shows a rise in a count as an up arrow with a percent', () => {
    expect(delta({ current: 412, previous: 379, changePct: 8.7 })).toEqual({
      kind: 'up',
      text: '▲ 8.7%',
    });
  });

  it('shows a fall as a down arrow with the size of the fall', () => {
    expect(delta({ current: 6.4, previous: 6.9, changePct: -7.2 })).toEqual({
      kind: 'down',
      text: '▼ 7.2%',
    });
  });

  it('shows no change as a flat zero with no arrow', () => {
    expect(delta({ current: 5, previous: 5, changePct: 0 })).toEqual({ kind: 'flat', text: '0%' });
  });

  it('shows a change in a rate in percentage points', () => {
    expect(delta({ current: 72.2, previous: 70.1, changePp: 2.1 })).toEqual({
      kind: 'up',
      text: '▲ 2.1 pp',
    });
    expect(delta({ current: 94.3, previous: 95, changePp: -0.7 })).toEqual({
      kind: 'down',
      text: '▼ 0.7 pp',
    });
  });

  it('marks a count that grew from zero as new', () => {
    expect(delta({ current: 14, previous: 0, changePct: null })).toEqual({ kind: 'new' });
  });

  it('shows no change when it cannot be measured', () => {
    // Value missing now, or both periods zero.
    expect(delta({ current: null, previous: 3, changePct: null })).toEqual({ kind: 'none' });
    expect(delta({ current: 0, previous: 0, changePct: null })).toEqual({ kind: 'none' });
    // A rate with no previous value has no change; it is never "new".
    expect(delta({ current: 81, previous: null, changePp: null })).toEqual({ kind: 'none' });
  });
});
