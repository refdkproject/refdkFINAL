import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Institution name is required'],
    },
    type: {
      type: String,
      enum: ['orphanage', 'elderly-care', 'special-needs', 'general-charity'],
      default: 'general-charity',
    },
    contact: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    logo: {
      type: String,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // Assuming there's a separate Event model
      },
    ],
  },
  { timestamps: true }
);

const Institution = mongoose.model('Institution', institutionSchema);
export default Institution;
