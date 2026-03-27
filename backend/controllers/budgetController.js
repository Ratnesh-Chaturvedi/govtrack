import Budget from '../models/Budget.js';
import AuditLog from '../models/AuditLog.js';
import { sendResponse } from '../utils/helpers.js';

// Get all budgets
export const getBudgets = async (req, res) => {
  try {
    const { category, sector, year, officialId, projectId, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (sector) filter.sector = sector;
    if (year) filter.$or = [{ fiscalYear: year }, { year }];
    if (officialId) filter.officialId = officialId;
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const budgets = await Budget.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    return sendResponse(res, 200, true, 'Budgets fetched successfully', budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch budgets');
  }
};

// Get single budget
export const getBudgetById = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return sendResponse(res, 404, false, 'Budget not found');
    }

    return sendResponse(res, 200, true, 'Budget fetched successfully', budget);
  } catch (error) {
    console.error('Get budget error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch budget');
  }
};

// Create new budget allocation
export const createBudget = async (req, res) => {
  try {
    const { title, allocatedAmount, category, sector, totalAmount, departmentId, officialId, projectId, fiscalYear, year, quarter } = req.body;

    if (!allocatedAmount) {
      return sendResponse(res, 400, false, 'Missing required fields');
    }

    const newBudget = new Budget({
      title: title || sector || category || 'Budget Allocation',
      allocatedAmount,
      category: category || sector,
      sector: sector || category || title,
      totalAmount: totalAmount || allocatedAmount,
      departmentId,
      officialId,
      projectId,
      fiscalYear: fiscalYear || year,
      year: year || fiscalYear,
      quarter,
      status: 'approved',
      utilizationPercentage: 0,
    });

    await newBudget.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId || officialId,
      userRole: 'official',
      action: 'budget.allocated',
      resourceType: 'budget',
      resourceId: newBudget._id,
      resourceName: newBudget.title,
    });

    return sendResponse(res, 201, true, 'Budget allocated successfully', newBudget);
  } catch (error) {
    console.error('Create budget error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to create budget');
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { utilizedAmount, allocatedAmount, totalAmount, status, sector, year, fiscalYear } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return sendResponse(res, 404, false, 'Budget not found');
    }

    if (typeof utilizedAmount === 'number') {
      budget.utilizedAmount = utilizedAmount;
      budget.utilizationPercentage = (utilizedAmount / budget.allocatedAmount) * 100;
      
      if (budget.utilizationPercentage === 100) {
        budget.status = 'partially-utilized';
      }
    }

    if (typeof allocatedAmount === 'number') {
      budget.allocatedAmount = allocatedAmount;
      budget.utilizationPercentage = (budget.utilizedAmount / (allocatedAmount || 1)) * 100;
    }

    if (typeof totalAmount === 'number') {
      budget.totalAmount = totalAmount;
    }

    if (sector) budget.sector = sector;
    if (year || fiscalYear) {
      budget.year = year || fiscalYear;
      budget.fiscalYear = fiscalYear || year;
    }

    if (status) budget.status = status;
    budget.updatedAt = new Date();

    await budget.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'budget.updated',
      resourceType: 'budget',
      resourceId: budgetId,
      resourceName: budget.title,
      changes: { after: { utilizedAmount, allocatedAmount, totalAmount, status } },
    });

    return sendResponse(res, 200, true, 'Budget updated successfully', budget);
  } catch (error) {
    console.error('Update budget error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to update budget');
  }
};

// Approve budget
export const approveBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return sendResponse(res, 404, false, 'Budget not found');
    }

    budget.status = 'approved';
    budget.approvedBy = req.user?.userId;
    budget.approvedAt = new Date();
    await budget.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'budget.approved',
      resourceType: 'budget',
      resourceId: budgetId,
      resourceName: budget.title,
    });

    return sendResponse(res, 200, true, 'Budget approved successfully', budget);
  } catch (error) {
    console.error('Approve budget error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to approve budget');
  }
};

// Get budget statistics
export const getBudgetStats = async (req, res) => {
  try {
    const { officialId } = req.query;
    const filter = officialId ? { officialId } : {};

    const totalAllocated = await Budget.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$allocatedAmount' } } },
    ]);

    const totalUtilized = await Budget.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$utilizedAmount' } } },
    ]);

    const approvedBudgets = await Budget.countDocuments({ ...filter, status: 'approved' });

    const stats = {
      totalAllocated: totalAllocated[0]?.total || 0,
      totalUtilized: totalUtilized[0]?.total || 0,
      approvedBudgets,
      utilizationPercentage: (totalUtilized[0]?.total || 0) / (totalAllocated[0]?.total || 1) * 100,
    };

    return sendResponse(res, 200, true, 'Stats fetched successfully', stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch stats');
  }
};

// Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByIdAndDelete(budgetId);

    if (!budget) {
      return sendResponse(res, 404, false, 'Budget not found');
    }

    return sendResponse(res, 200, true, 'Budget deleted successfully');
  } catch (error) {
    console.error('Delete budget error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to delete budget');
  }
};
