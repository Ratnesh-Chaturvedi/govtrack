import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateIdentificationId = (role) => {
  const prefix = {
    citizen: 'CIT',
    official: 'GOV',
    contractor: 'CON',
    media: 'AUD',
  };

  const prefixStr = prefix[role] || 'USR';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();

  return `${prefixStr}-${timestamp}-${random}`;
};

export const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
};

export const maskaAdharNumber = (aadhar) => {
  return aadhar.slice(-4).padStart(aadhar.length, '*');
};

export const getIdentificationTypeByRole = (role) => {
  const typeMap = {
    citizen: ['aadhaar', 'voter_id'],
    official: ['employee_id'],
    contractor: ['license_id'],
    media: ['audit_license'],
  };

  return typeMap[role] || [];
};

export const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};
