import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  // Common fields for all users
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
    sparse: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  phone: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
  
  // Role-specific identification
  role: {
    type: String,
    enum: ['citizen', 'official', 'contractor', 'media'],
    required: true,
  },
  
  // Unique identifiers based on role
  identificationId: {
    type: String,
    required: true,
    unique: true,
  },
  identificationType: {
    type: String,
    enum: ['aadhaar', 'voter_id', 'employee_id', 'license_id', 'audit_license'],
    required: true,
  },
  
  // Citizen-specific fields
  citizenship: {
    district: String,
    state: String,
    country: {
      type: String,
      default: 'India',
    },
  },
  
  // Government Official-specific fields
  official: {
    departmentName: String,
    designation: String,
    departmentCode: String,
    officeLocation: String,
    officePhone: String,
  },
  
  // Contractor-specific fields
  contractor: {
    companyName: String,
    registrationNumber: String,
    businessCategory: String,
    gstNumber: String,
    bankAccount: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    previousProjects: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  
  // Media/Audit-specific fields
  media: {
    organizationName: String,
    licenseNumber: String,
    licenseExpiry: Date,
    specialization: [String],
  },
  
  // Account status
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Security
  lastLogin: Date,
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockoutUntil: Date,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user profile (exclude sensitive data)
userSchema.methods.getProfile = function () {
  const { password, verificationToken, verificationTokenExpiry, lockoutUntil, failedLoginAttempts, ...profile } = this.toObject();
  return profile;
};

export default mongoose.model('User', userSchema);
