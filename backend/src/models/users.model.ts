import { Schema, model, Document, Types, Model } from 'mongoose';

// Base interface for User data (without Mongoose-specific fields)
export interface IUser {
  email: string;
  password: string;
}

// Document interface that extends both IUser and Mongoose Document
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  toPublicJSON(): Partial<IUserDocument>;
}

// Static methods interface
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

// Mongoose Schema
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't include password in queries by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

userSchema.methods.toPublicJSON = function(): Partial<IUserDocument> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static methods
userSchema.statics.findByEmail = function(email: string): Promise<IUserDocument | null> {
  return this.findOne({ email }).select('+password');
};

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcrypt');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// Create and export the model
export const User = model<IUserDocument, IUserModel>('User', userSchema);
