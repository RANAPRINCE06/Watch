const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/i.test(path.extname(file.originalname));
  if (allowed) cb(null, true);
  else cb(new Error('Only images (jpeg, jpg, png, webp) allowed'), false);
};

exports.upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
