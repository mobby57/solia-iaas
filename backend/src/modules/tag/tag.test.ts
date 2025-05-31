import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import prisma from '../../lib/prisma';
import { createTag, updateTag, deleteTag } from './tag.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

describe('Tag Service', () => {
  beforeEach(async () => {
    await cleanDatabase();
  }, 30000);

  afterEach(async () => {
    await disconnectDatabase();
  }, 30000);

  it('should create a tag', async () => {
    const tagData = {
      label: 'Test Tag',
      color: '#ff0000',
      targetId: 'target1',
      targetType: 'type1',
    };
    const tag = await createTag(tagData, 'default-tenant');
    expect(tag).toHaveProperty('id');
    expect(tag.label).toBe(tagData.label);
  }, 30000);

  it('should update a tag', async () => {
    const tag = await createTag({ label: 'Initial Tag', color: '#00ff00', targetId: 'target2', targetType: 'type2' }, 'default-tenant');
    const updatedTag = await updateTag(tag.id, { label: 'Updated Tag', color: '#0000ff' });
    expect(updatedTag.label).toBe('Updated Tag');
    expect(updatedTag.color).toBe('#0000ff');
  }, 30000);

  it('should delete a tag', async () => {
    const tag = await createTag({ label: 'Tag to Delete', color: '#123456', targetId: 'target3', targetType: 'type3' }, 'default-tenant');
    const deletedTag = await deleteTag(tag.id);
    expect(deletedTag.id).toBe(tag.id);
    const foundTag = await prisma.tag.findUnique({ where: { id: tag.id } });
    expect(foundTag).toBeNull();
  }, 30000);

  it('should reject creating a tag without tenantId', async () => {
    await expect(createTag({ label: 'No Tenant Tag', color: '#000000', targetId: 'target4', targetType: 'type4' }, '')).rejects.toThrow();
  });
});
