import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-Save Hook: Automatically hash password before saving to MongoDB
 * In modern Mongoose, async functions return a Promise directly (no next callback).
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: Compare candidate password with stored hash
 */
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance Method: Generate signed JWT Access Token
 */
userSchema.methods.generateAccessToken = function () {
  const secret = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';
  const expiry = process.env.ACCESS_TOKEN_EXPIRY || '7d';

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    secret,
    {
      expiresIn: expiry,
    }
  );
};

// Map _id to id and remove password when sending JSON to client
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.password; // CRITICAL: Never return password hash to client!
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);