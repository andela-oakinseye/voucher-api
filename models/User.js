import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    min: [2, 'Username too short'],
    max: [20, 'Username too long'],
    required: [true, 'Provide a username']
  },
  password: {
    type: String,
    min: [6, 'Password is too short']
  },
  firstname: {
    type: String,
    min: [2, 'firstname too short'],
    required: [true, 'provide firstname']
  },
  lastname: {
    type: String,
    min: [2, 'lastname too short'],
    required: [true, 'provide lastname']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  ip: {
    type: String,
  },
  permission: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date,
    default: Date.now
  }
});

// Validate email because users are stupid :(
User.path('email').validate((value,) => {
  const validEmailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
  return validEmailPattern(value);
}, 'Invalid email address');

// Hash password because I am not stupid
User.pre('save', (next) => {
  const user = this;

  // Continue if user is not modifying password
  if(!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(8, (err, salt) => {
    if(err) 
      return next(err)
    
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if(error)
        next(error)
      user.password = hash;
      next()
    });
  })
});

export default mongoose.model('User', User);
