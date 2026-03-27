import User from '../models/User.js';
import { sendResponse } from '../utils/helpers.js';

export const getContractors = async (_req, res) => {
  try {
    const contractors = await User.find({ role: 'contractor' })
      .select('identificationId fullName contractor companyName')
      .lean();

    const formatted = contractors.map((user) => ({
      id: user.identificationId,
      fullName: user.fullName,
      companyName: user.contractor?.companyName || '',
      rating: user.contractor?.rating || 0,
    }));

    return sendResponse(res, 200, true, 'Contractors fetched successfully', formatted);
  } catch (error) {
    console.error('Get contractors error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch contractors');
  }
};
