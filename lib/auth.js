// lib/auth.js - Fixed version with proper token extraction
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from './models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (adminId) => {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    if (!token || token === 'undefined') {
      return null;
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

// Fixed middleware to protect routes
export const authenticateAdmin = async (req) => {
  try {
    let token = null;
    
    // Method 1: Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      } else {
        token = authHeader;
      }
    }
    
    // Method 2: Check cookies as fallback
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }
    
    // Method 3: Check x-auth-token header
    if (!token && req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    // Debug logging
    console.log('Authentication attempt:', {
      hasAuthHeader: !!authHeader,
      authHeaderValue: authHeader ? `${authHeader.substring(0, 20)}...` : 'none',
      hasCookieToken: !!(req.cookies?.token),
      hasXAuthToken: !!req.headers['x-auth-token'],
      extractedToken: token ? `${token.substring(0, 20)}...` : 'none',
      tokenLength: token ? token.length : 0
    });

    // Check if token exists and is not 'undefined' string
    if (!token || token === 'undefined' || token.trim() === '') {
      return { authenticated: false, error: 'No valid token provided' };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return { authenticated: false, error: 'Invalid or expired token' };
    }

    // Find admin
    const admin = await Admin.findById(decoded.adminId).select('-password');
    if (!admin) {
      return { authenticated: false, error: 'Admin not found' };
    }

    if (!admin.isActive) {
      return { authenticated: false, error: 'Admin account is inactive' };
    }

    console.log('Authentication successful for admin:', admin.email);
    return { authenticated: true, admin };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed: ' + error.message };
  }
};