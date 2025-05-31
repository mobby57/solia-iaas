import { describe, it, expect, beforeEach } from 'vitest';
import * as tagService from './tag.service';

const tenantId = 'default-tenant';

describe('Tag Service - Corrected Tests', () => {
  let createdTagId: string;

  beforeEach(async () => {
    // Create a tag before each test to ensure it exists
    const created = await tagService.createTag(
      {
        label: 'Initial Tag',
        color: '#FFFFFF',
        targetId: tenantId,
        targetType: 'type',
      },
      tenantId
    );
    createdTagId = created.id;
  });

  it('should update a tag', async () => {
    const updatedTag = await tagService.updateTag(createdTagId, {
      label: 'Updated Tag',
      color: '#000000',
    });
    expect(updatedTag).toBeDefined();
    expect(updatedTag.label).toBe('Updated Tag');
    expect(updatedTag.color).toBe('#000000');
  });
});
