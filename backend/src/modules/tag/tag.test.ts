import { describe, it, expect } from 'vitest';
import * as tagService from './tag.service';

const validTenantId = '64b7f8f8f8f8f8f8f8f8f8f8'; // example valid ObjectId string
const validTagId = '64b7f8f8f8f8f8f8f8f8f8f9'; // example valid ObjectId string

describe('Tag Service', () => {
  it('should get tags by tenantId', async () => {
    const tags = await tagService.getTags(validTenantId);
    expect(tags).toBeDefined();
  });

  it('should get tag by id', async () => {
    const tag = await tagService.getTagById(validTagId);
    expect(tag).toBeDefined();
  });

  it('should create a tag', async () => {
    const tag = await tagService.createTag(
      {
        label: 'Test Tag',
        color: '#FFFFFF',
        targetId: validTagId,
        targetType: 'type',
      },
      validTenantId
    );
    expect(tag).toBeDefined();
  });

  it('should update a tag', async () => {
    const tag = await tagService.updateTag(validTagId, {
      label: 'Updated Tag',
      color: '#000000',
    });
    expect(tag).toBeDefined();
  });

  it('should delete a tag', async () => {
    await tagService.deleteTag(validTagId);
  });
});
