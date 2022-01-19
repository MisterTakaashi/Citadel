import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    ip: { type: String, required: true },
    port: { type: String, required: true, default: '3000' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default model('Instance', schema);
