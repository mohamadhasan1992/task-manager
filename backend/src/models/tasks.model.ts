import { TaskStatusEnum } from '@/enum/task-status.enum';
import mongoose, { model, Schema, Document, Types, Model } from 'mongoose';
import { IUser } from './users.model';



export interface ITask{
  title: string
  description: string
  status: TaskStatusEnum,
  user: string | IUser
}

export interface ITaskDocument extends ITask, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  toPublicJSON(): Partial<ITaskDocument>;
}

// Static methods interface
export interface ITaskModel extends Model<ITaskDocument> {
  findByEmail(email: string): Promise<ITaskDocument | null>;
}

// Mongoose Schema
const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: TaskStatusEnum,
      required: false,
      default: TaskStatusEnum.Pending
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
taskSchema.index({ createdAt: -1 });

taskSchema.methods.toPublicJSON = function(): Partial<ITaskDocument> {
  const userObject = this.toObject();
  return userObject;
};

// Create and export the model
export const Task = model<ITaskDocument, ITaskModel>('Task', taskSchema);
