import multer from "multer";
import path from "path";
import { MulterCBFunc, Request } from "../types";

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req: Request, image: Express.Multer.File, cb: MulterCBFunc) => cb(null, './public/images/'),
    filename: (req: Request, image: Express.Multer.File, cb: MulterCBFunc) => cb(null, Date.now() + path.extname(image.originalname))
})
export default multer({storage: storage});