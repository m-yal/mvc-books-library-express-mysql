import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, image, cb) => cb(null, './public/images/'),
    filename: (req, image, cb) => cb(null, Date.now() + path.extname(image.originalname))
})
export default multer({storage: storage});