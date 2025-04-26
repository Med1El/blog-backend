import mongoose, { Schema } from 'mongoose';

import { IPost } from '../interfaces/IPost';


const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  extraSmallImages: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;