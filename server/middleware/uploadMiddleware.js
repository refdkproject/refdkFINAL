import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload types and their paths
export const UPLOAD_TYPES = {
  PROFILE_PIC: 'profilePic',
  VOLUNTEER_PIC: 'volunteerPic',
  INSTITUTION_LOGO: 'institutionLogo',
  EVENT_PIC: 'eventPic',
  VIDEO: 'video',
  DOCUMENT: 'document',
  POST_PIC: 'postPic',
};

// Configure storage
const storage = (uploadType) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        // Create base path for user
        const basePath = path.join(__dirname, '..', 'uploads', 'users', req.user._id.toString());

        // Create nested directories based on upload type
        const uploadPath = path.join(basePath, uploadType);

        // Create directories if they don't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
      } catch (err) {
        cb(err, null); // Pass the error to multer
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

// Validate file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`), false);
  }
};

// Create upload middleware for different types
const createUploader = (uploadType) =>
  multer({
    storage: storage(uploadType),
    fileFilter: fileFilter,
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
    },
  });

// Export different upload middlewares here
export const uploadProfilePic = createUploader(UPLOAD_TYPES.PROFILE_PIC).single(UPLOAD_TYPES.PROFILE_PIC);
export const uploadVolunteerPic = createUploader(UPLOAD_TYPES.VOLUNTEER_PIC).single(UPLOAD_TYPES.VOLUNTEER_PIC);
export const uploadEventPic = createUploader(UPLOAD_TYPES.EVENT_PIC).single(UPLOAD_TYPES.EVENT_PIC);
export const uploadVideo = createUploader(UPLOAD_TYPES.VIDEO).single(UPLOAD_TYPES.VIDEO);
export const uploadDocument = createUploader(UPLOAD_TYPES.DOCUMENT).single(UPLOAD_TYPES.DOCUMENT);
export const uploadPostPic = createUploader(UPLOAD_TYPES.POST_PIC).single(UPLOAD_TYPES.POST_PIC);
export const uploadInstitutionLogo = createUploader(UPLOAD_TYPES.INSTITUTION_LOGO).single(
  UPLOAD_TYPES.INSTITUTION_LOGO
);
