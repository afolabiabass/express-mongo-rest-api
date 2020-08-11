const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config')

const roles = [
  'customer', 'agent', 'admin'
]

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
    select: false
  },
  role: {
    type: String,
    default: 'customer',
    enum: roles
  }
}, {
  timestamps: true
})

/**
 * Hook to hash the user password before saving
 * it to the database.
 */
UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.hash(user.password, 10).then((hashedPassword) => {
    user.password = hashedPassword;
    next();
  })
}, function (error) {
  next(error)
})

/**
 * Function to verify user password payload
 */
UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

/**
 * Generate token for user
 */
UserSchema.statics.generateToken = function (id) {
  return jwt.sign(id, config.app.key, { expiresIn: '1800s' });
}

const User = mongoose.model('User', UserSchema)

module.exports = User;
