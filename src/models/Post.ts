import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  mainImage: string;
  extraSmallImages: string[];
  tags: string[];
  category: string;
  author: {
    id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
}

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