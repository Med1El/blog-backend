import multer from "multer";
import { v4 } from "uuid";
import { Request } from "express";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, v4().toString() + path.extname(file.originalname).toLowerCase());
    },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb('filetype is not valid', false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

export default upload;