import { Schema, Types } from 'mongoose';

const tenantUserSchema = new Schema({
  email: String,
  tenantId: {
    type: Types.ObjectId,
    ref: 'tenants',
  },
  userId: {
    type: Types.ObjectId,
    ref: 'users',
  },
  role: String,
});

export default tenantUserSchema;
