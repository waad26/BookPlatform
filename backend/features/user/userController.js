const User = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const isAdmin = (req) => req.user && req.user.role === 'admin';

// Sign up
const SECRET_KEY = 'your_jwt_secret_key';

exports.signup = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { name, username, password } = req.body;

    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, username, email, password});

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.warn(`Failed login attempt for email: ${email} at ${new Date().toISOString()}`);
      return res.status(401).json({ message: 'Invalid email ' });
    }
    console.log('Password to check:', password);
    console.log('Stored password (hashed):', user.password);

     const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      console.warn(`Failed login attempt for email: ${email} at ${new Date().toISOString()}`);
      return res.status(401).json({ message: 'Invalid  password' });
    }
    console.log('SECRET FROM ENV:', process.env.JWT_SECRET);
    const jwtSecret = process.env.JWT_SECRET || 'Waad_Jana_Lujain_Layal_1234';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};



// View profile
exports.viewInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Logout
exports.logoutUser = (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update account
exports.updateAC = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, username, email, password } = req.body;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();

    return res.status(200).json({ message: 'Info was updated successfully', user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    return res.status(200).json({ message: 'Your account has been deleted' });
  } catch {
    return res.status(500).json({ message: 'Something went wrong while deleting your account' });
  }
};

// Change password
exports.changePass = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: 'Changed password successfully' });
  } catch {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Forget password
exports.forgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = crypto.createHash('sha256').update(code).digest('hex');
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log(`Reset code for your password: ${code}`);
    return res.status(200).json({ message: 'Reset code sent to email' });
  } catch {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Reset password
exports.resetPass = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    if (user.resetToken !== hashedCode || Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};


// Block / Unblock
exports.blockUser = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ message: 'Access denied.' });
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot block yourself.' });

    user.isBlocked = true;
    await user.save();
    return res.status(200).json({ message: `User ${user.name} has been blocked.` });
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unblock = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ message: 'Access denied.' });
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.isBlocked = false;
    await user.save();
    return res.status(200).json({ message: `User ${user.name} has been unblocked.` });
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
