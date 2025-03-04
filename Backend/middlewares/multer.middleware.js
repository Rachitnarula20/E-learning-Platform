import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads"); // Ensure this folder exists
    },
    filename(req, file, cb) {
        const id = uuid();
        const extName = path.extname(file.originalname);
        const fileName = `${id}${extName}`;
        cb(null, fileName);
    }
});

export const uploadFiles = multer({ storage }).fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
]);