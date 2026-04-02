const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:          { type: String, required: true, trim: true, maxlength: 100 },
    description:    { type: String, trim: true, maxlength: 500, default: '' },
    status:         { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
    latestDesignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Design', default: null },
  },
  { timestamps: true }
);

// Compound index for dashboard queries — user's projects sorted by recently-updated
projectSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
