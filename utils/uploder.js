const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('file====', file);

    cb(null, path.resolve(__dirname, '../public/images/covers'));
  },
  filename: (req, file, cb) => {
    const filename =
      `${file.originalname}-${Date.now()}` + path.extname(file.originalname);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'cover' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for coverImage!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
