import { it, expect, describe } from 'vitest';

import { buildTrendParams, buildScorecardParams } from './params';

// ----------------------------------------------------------------------

const filters = { period: 'monthly', countryId: 3, type: 1 } as const;

describe('buildScorecardParams', () => {
  it('sends the filters as snake_case params, one full page, and no dates', () => {
    expect(buildScorecardParams(filters)).toEqual({
      period: 'monthly',
      country_id: 3,
      type: 1,
      per_page: 100,
    });
  });

  it('adds the drill-down parent and the sort when they are set', () => {
    expect(buildScorecardParams(filters, { parentId: 12, sort: 'gmv' })).toEqual({
      period: 'monthly',
      country_id: 3,
      type: 1,
      per_page: 100,
      parent_id: 12,
      sort: 'gmv',
    });
  });

  it('leaves out an empty parent and sort, so no blank key reaches the server', () => {
    expect(buildScorecardParams(filters, { parentId: null, sort: undefined })).not.toHaveProperty(
      'parent_id'
    );
    expect(buildScorecardParams(filters, { parentId: null })).not.toHaveProperty('sort');
  });
});

describe('buildTrendParams', () => {
  it('sends the tag, metric and bucket with the page country and type, and no dates', () => {
    expect(
      buildTrendParams(filters, { tagId: 12, metric: 'mrkoonRevenue', bucket: 'weekly' })
    ).toEqual({
      tag_id: 12,
      metric: 'mrkoonRevenue',
      period: 'weekly',
      country_id: 3,
      type: 1,
    });
  });
});
