import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Actor
  userId: {
    type: String,
    required: true,
  },
  userName: String,
  userRole: String,
  
  // Action Details
  action: {
    type: String,
    enum: [
      'project.created',
      'project.updated',
      'project.deleted',
      'project.status.changed',
      'budget.allocated',
      'budget.updated',
      'budget.approved',
      'complaint.filed',
      'complaint.resolved',
      'rti.requested',
      'rti.approved',
      'user.login',
      'user.logout',
      'report.generated',
      'risk.assessed',
      'feedback.added',
    ],
    required: true,
  },
  
  // Resource
  resourceType: {
    type: String,
    enum: ['project', 'budget', 'complaint', 'rti', 'user', 'report'],
  },
  resourceId: String,
  resourceName: String,
  
  // Changes
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
