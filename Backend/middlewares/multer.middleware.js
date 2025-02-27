import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads");  // ✅ Ensure "uploads" folder exists
    },
    filename(req, file, cb) {
        const id = uuid();
        const extName = path.extname(file.originalname);
        const fileName = `${id}${extName}`;
        cb(null, fileName);
    }
});

// ✅ Ensure the correct field name is used in the request (image)
export const uploadFiles = multer({ storage }).single("image");
