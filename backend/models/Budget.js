import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  // Budget Information
  title: {
    type: String,
    required: true,
  },
  description: String,
  sector: String,
  
  // Amount
  allocatedAmount: {
    type: Number,
    required: true,
  },
  utilizedAmount: {
    type: Number,
    default: 0,
  },
  
  // Category (kept flexible to align with frontend)
  category: String,
  totalAmount: {
    type: Number,
    default: 0,
  },
  
  // Department/Official
  departmentId: String,
  officialId: {
    type: String,
  },
  
  // Project Reference
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  
  // Period
  fiscalYear: String,
  year: String,
  quarter: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  
  // Status
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected', 'partially-utilized'],
    default: 'approved',
  },
  utilizationPercentage: {
    type: Number,
    default: 0,
  },
  
  // Approval
  approvedBy: {
    type: String,
  },
  approvedAt: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

budgetSchema.index({ officialId: 1 });
budgetSchema.index({ projectId: 1 });
budgetSchema.index({ category: 1 });

export default mongoose.model('Budget', budgetSchema);
