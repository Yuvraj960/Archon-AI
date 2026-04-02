const mongoose = require('mongoose');

const apiEndpointSchema = new mongoose.Schema(
  {
    method:      String,
    path:        String,
    description: String,
    requestBody: Object,
    response:    Object,
  },
  { _id: false }
);

const dbFieldSchema = new mongoose.Schema(
  {
    name:     String,
    type:     String,
    required: Boolean,
    notes:    String,
  },
  { _id: false }
);

const dbCollectionSchema = new mongoose.Schema(
  {
    name:   String,
    fields: [dbFieldSchema],
  },
  { _id: false }
);

const designSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    version:   { type: Number, required: true },
    requirements: {
      functional:    [String],
      nonFunctional: [String],
    },
    architecture: {
      pattern:    String,   // e.g. "Monolith", "Microservices"
      rationale:  String,
      components: [String],
      techStack:  Object,   // { frontend, backend, database, other }
    },
    apis:     [apiEndpointSchema],
    dbSchema: [dbCollectionSchema],
    diagram:  { type: String, default: '' }, // Mermaid.js code string
  },
  { timestamps: true }
);

designSchema.index({ projectId: 1, version: -1 });

module.exports = mongoose.model('Design', designSchema);
