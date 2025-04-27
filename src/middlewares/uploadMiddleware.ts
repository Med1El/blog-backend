// middleware/uploadMiddleware.ts
import multer from "multer";
import { v4 } from "uuid";
import { Request } from "express";
import path from "path";
import fs from "fs/promises";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        fs.mkdir('uploads', { recursive: true }).then(() => {
            cb(null, 'uploads');
        });
    },
    filename(req, file, cb) {
        cb(null, v4().toString() + path.extname(file.originalname).toLowerCase());
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb('filetype is not valid', false);
    }
};

const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
}).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'extraSmallImages', maxCount: 4 },
]);

export default uploadMiddleware;