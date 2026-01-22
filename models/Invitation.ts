import mongoose, { Schema, model, models } from 'mongoose';

const InvitationSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending',
    },

    expiresAt: {
  type: Date,
  required: true,
  default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
},

  },
  {
    timestamps: true, // creates createdAt & updatedAt automatically
  }
);

export default models.Invitation ||
  model('Invitation', InvitationSchema);
