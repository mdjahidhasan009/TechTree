import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) { //cd=>callback
    cb(null, "uploads/") //null=>error
  },
  //path.extname will bring file ext name of file.originalname
  //file.fieldname fieldname in the form in this case is "image"(adding time if anyone add same image twice or more)
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

function checkFileTypes(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images Only!', false);
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileTypes(file, cb)
  }
})

//api/upload
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
})

export default router;
