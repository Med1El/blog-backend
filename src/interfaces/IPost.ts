import { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    mainImage: string;
    extraSmallImages: string[];
    tags: string[];
    category: string;
    author: {
        id: Types.ObjectId;
        name: string;
    };
}
