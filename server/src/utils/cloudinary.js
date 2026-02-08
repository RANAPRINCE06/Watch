const cloudinary = require('cloudinary').v2;
const stream = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder = 'watches') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    readStream.pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary, cloudinary };
