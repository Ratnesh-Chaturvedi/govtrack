import User from '../models/User.js';
import { generateToken, generateIdentificationId, sendResponse } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      role,
      id,
      identificationId,
      identificationType,
      citizenship,
      official,
      contractor,
      media,
    } = req.body;

    // Validate password match
    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Passwords do not match');
    }

    // Check if user already exists
    const userIdValue = id || identificationId;
    const userNameValue = name || fullName;
    
    const existingUser = await User.findOne({
      $or: [{ email }, { identificationId: userIdValue }],
    });

    if (existingUser) {
      return sendResponse(
        res,
        409,
        false,
        existingUser.email === email
          ? 'Email already registered'
          : 'Identification ID already registered'
      );
    }

    // Determine identificationType based on role if not provided
    let idType = identificationType;
    if (!idType) {
      const typeMap = {
        citizen: 'aadhaar',
        official: 'employee_id',
        contractor: 'license_id',
        media: 'audit_license',
      };
      idType = typeMap[role] || 'aadhaar';
    }

    // Create user object
    const userData = {
      fullName: userNameValue,
      email,
      password,
      phone: phone || '',
      role,
      identificationId: userIdValue || generateIdentificationId(role),
      identificationType: idType,
      isVerified: true, // Auto-verify for demo purposes
    };

    // Add role-specific data
    if (role === 'citizen' && citizenship) {
      userData.citizenship = citizenship;
    } else if (role === 'official' && official) {
      userData.official = official;
    } else if (role === 'contractor' && contractor) {
      userData.contractor = contractor;
    } else if (role === 'media' && media) {
      userData.media = media;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return success response
    return sendResponse(
      res,
      201,
      true,
      'User registered successfully',
      {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          identificationId: user.identificationId,
        },
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    return sendResponse(
      res,
      500,
      false,
      error.message || 'Registration failed'
    );
  }
};

export const login = async (req, res) => {
  try {
    const { password, role, identificationId, id } = req.body;
    const loginId = identificationId || id;

    // Validate input
    if (!loginId || !password) {
      return sendResponse(
        res,
        400,
        false,
        'Please provide identification ID and password'
      );
    }

    // Find user with password field (normally hidden)
    const user = await User.findOne({ identificationId: loginId }).select('+password');

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid identification ID or password');
    }

    // Check if user's role matches
    if (role && user.role !== role) {
      return sendResponse(
        res,
        401,
        false,
        `This account is registered as ${user.role}, not ${role}`
      );
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        await user.save();
        return sendResponse(
          res,
          401,
          false,
          'Account locked due to multiple failed login attempts. Try again after 30 minutes.'
        );
      }

      await user.save();
      return sendResponse(res, 401, false, 'Invalid identification ID or password');
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      return sendResponse(
        res,
        401,
        false,
        'Account is locked. Please try again later.'
      );
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    return sendResponse(res, 200, true, 'Login successful', {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        identificationId: user.identificationId,
        profileImage: user.profileImage,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendResponse(res, 500, false, error.message || 'Login failed');
  }
};

export const verifyToken = async (req, res) => {
  try {
    // User is already verified by the protect middleware
    const user = await User.findById(req.user.userId);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    return sendResponse(res, 200, true, 'Token verified', {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        identificationId: user.identificationId,
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return sendResponse(res, 500, false, 'Token verification failed');
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    return sendResponse(res, 200, true, 'User fetched successfully', {
      user: user.getProfile(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return sendResponse(res, 500, false, 'Failed to fetch user');
  }
};
