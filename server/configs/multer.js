import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = join(__dirname, '../../uploads');
await mkdir(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .pdf files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export { upload };