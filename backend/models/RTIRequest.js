import mongoose from 'mongoose';

const rtiRequestSchema = new mongoose.Schema({
  // Request Information
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  
  // Requester
  requesterId: {
    type: String,
    required: true,
  },
  requesterName: String,
  requesterEmail: String,
  
  // Project/Document Reference
  projectId: {
    type: String,
  },
  relatedDocuments: [String],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in-review', 'approved', 'partially-approved', 'rejected'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal',
  },
  
  // Response
  responseDocument: String, // URL to PDF/document
  responseDate: Date,
  denialReason: String,
  
  // Approval
  approvedBy: {
    type: String,
  },
  approvedAt: Date,
  
  // Deadlines
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: Date,
  
  // Public Impact
  isPublic: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

rtiRequestSchema.index({ requesterId: 1 });
rtiRequestSchema.index({ projectId: 1 });
rtiRequestSchema.index({ status: 1 });

export default mongoose.model('RTIRequest', rtiRequestSchema);
