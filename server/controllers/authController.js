const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ClientProfile = require('../models/ClientProfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already exists' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      emailVerificationToken
    });
    
    if (role === 'student') {
      await StudentProfile.create({ user: user._id });
    } else if (role === 'client') {
      await ClientProfile.create({ user: user._id, companyName: name + ' Company', description: 'Default description' });
    }
    
    res.status(201).json({ success: true, data: { message: 'Registered successfully.' } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    if (user.status !== 'active') return res.status(403).json({ success: false, message: 'Account is ' + user.status });
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, data: { accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    
    const tokens = generateTokens(user);
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, data: {} });
};

exports.getMe = async (req, res, next) => {
  try {
    let profile = null;
    if (req.user.role === 'student') {
      profile = await StudentProfile.findOne({ user: req.user._id });
    } else if (req.user.role === 'client') {
      profile = await ClientProfile.findOne({ user: req.user._id });
    }
    
    res.json({ success: true, data: { user: req.user, profile } });
  } catch (error) {
    next(error);
  }
};
