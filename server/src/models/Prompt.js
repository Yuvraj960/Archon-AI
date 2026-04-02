const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    projectId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false, index: true },
    designId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Design' },
    rawInput:     { type: String, required: true },
    refinedInput: { type: Object, default: null },  // structured JSON from wizard
    aiResponse:   { type: String, default: '' },
    tokensUsed:   { type: Number, default: 0 },
    type: {
      type:     String,
      enum:     ['questions', 'refine', 'generate', 'update'],
      required: true,
    },
  },
  { timestamps: true }
);

promptSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Prompt', promptSchema);
