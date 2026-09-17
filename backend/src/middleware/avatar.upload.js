import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // We will name it avatar_[userId].ext
    // To ensure old avatars are overwritten, we can keep the extension constant (e.g. .jpg) 
    // or we might end up with multiple extensions. But let's just use .jpg or original ext.
    // Actually, if we use original ext, they might have avatar_123.jpg and avatar_123.png
    // To avoid this, we can force .jpg, but some PNGs might not work if just renamed.
    // Let's keep original extension, the frontend will try .jpg by default, if it doesn't work it's fine.
    // Wait, the plan was to just use `avatar_[userId].jpg`. Let's just hardcode .jpg and rely on the browser to figure it out, or better yet, the frontend can query it or we can just send the new URL back.
    // Let's send the new URL back in the response.
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const avatarUpload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for avatars
  }
});
