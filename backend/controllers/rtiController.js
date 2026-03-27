import RTIRequest from '../models/RTIRequest.js';
import AuditLog from '../models/AuditLog.js';
import { sendResponse } from '../utils/helpers.js';

// Get all RTI requests
export const getRTIRequests = async (req, res) => {
  try {
    const { status, requesterId, projectId, projectIds, search } = req.query;
    const filter = { isPublic: true };

    if (status) filter.status = status;
    if (requesterId) filter.requesterId = requesterId;
    if (projectId) filter.projectId = projectId;
    if (projectIds) {
      const ids = projectIds.split(',').map((id) => id.trim()).filter(Boolean);
      if (ids.length > 0) {
        filter.projectId = { $in: ids };
      }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await RTIRequest.find(filter)
      .sort({ submittedAt: -1 })
      .limit(100);

    return sendResponse(res, 200, true, 'RTI requests fetched successfully', requests);
  } catch (error) {
    console.error('Get RTI requests error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch requests');
  }
};

// Get single RTI request
export const getRTIRequestById = async (req, res) => {
  try {
    const { rtiId } = req.params;
    const request = await RTIRequest.findById(rtiId);

    if (!request) {
      return sendResponse(res, 404, false, 'Request not found');
    }

    request.views = (request.views || 0) + 1;
    await request.save();

    return sendResponse(res, 200, true, 'Request fetched successfully', request);
  } catch (error) {
    console.error('Get RTI request error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch request');
  }
};

// Create RTI request
export const createRTIRequest = async (req, res) => {
  try {
    const { title, description, projectId, requesterId, requesterName, requesterEmail, priority } = req.body;

    if (!title || !description || !requesterId) {
      return sendResponse(res, 400, false, 'Missing required fields');
    }

    const newRequest = new RTIRequest({
      title,
      description,
      projectId,
      requesterId,
      requesterName,
      requesterEmail,
      priority: priority || 'normal',
      status: 'pending',
      submittedAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isPublic: true,
    });

    await newRequest.save();

    // Log audit trail
    await AuditLog.create({
      userId: requesterId,
      userRole: 'media',
      action: 'rti.requested',
      resourceType: 'rti',
      resourceId: newRequest._id,
      resourceName: newRequest.title,
    });

    return sendResponse(res, 201, true, 'RTI request submitted successfully', newRequest);
  } catch (error) {
    console.error('Create RTI request error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to submit request');
  }
};

// Approve RTI request
export const approveRTIRequest = async (req, res) => {
  try {
    const { rtiId } = req.params;
    const { responseDocument, denialReason } = req.body;

    const request = await RTIRequest.findById(rtiId);
    if (!request) {
      return sendResponse(res, 404, false, 'Request not found');
    }

    if (responseDocument) {
      request.status = 'approved';
      request.responseDocument = responseDocument;
      request.responseDate = new Date();
    } else if (denialReason) {
      request.status = 'rejected';
      request.denialReason = denialReason;
      request.responseDate = new Date();
    }

    request.approvedBy = req.user?.userId;
    request.approvedAt = new Date();
    await request.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'rti.approved',
      resourceType: 'rti',
      resourceId: rtiId,
      resourceName: request.title,
      changes: { after: { status: request.status } },
    });

    return sendResponse(res, 200, true, 'RTI request processed successfully', request);
  } catch (error) {
    console.error('Approve RTI request error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to process request');
  }
};

// Get RTI statistics
export const getRTIStats = async (req, res) => {
  try {
    const { requesterId, projectIds } = req.query;
    const filter = {};
    if (requesterId) filter.requesterId = requesterId;
    if (projectIds) {
      const ids = projectIds.split(',').map((id) => id.trim()).filter(Boolean);
      if (ids.length > 0) {
        filter.projectId = { $in: ids };
      }
    }

    const totalRequests = await RTIRequest.countDocuments(filter);
    const pendingRequests = await RTIRequest.countDocuments({ ...filter, status: { $in: ['pending', 'in-review'] } });
    const approvedRequests = await RTIRequest.countDocuments({ ...filter, status: 'approved' });
    const rejectedRequests = await RTIRequest.countDocuments({ ...filter, status: 'rejected' });

    const totalViews = await RTIRequest.aggregate([
      { $match: filter },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    const stats = {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      resolvedRequests: approvedRequests + rejectedRequests,
      appealRequests: rejectedRequests,
      averageResponseTime: '15 days',
      totalViews: totalViews[0]?.totalViews || 0,
    };

    return sendResponse(res, 200, true, 'Stats fetched successfully', stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch stats');
  }
};

// Delete RTI request
export const deleteRTIRequest = async (req, res) => {
  try {
    const { rtiId } = req.params;
    const request = await RTIRequest.findByIdAndDelete(rtiId);

    if (!request) {
      return sendResponse(res, 404, false, 'Request not found');
    }

    return sendResponse(res, 200, true, 'Request deleted successfully');
  } catch (error) {
    console.error('Delete RTI request error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to delete request');
  }
};
