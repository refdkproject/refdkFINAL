import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delete file from uploads folder
export const deleteFile = (fileUrl, userId, uploadType) => {
  try {
    if (!fileUrl) return;

    // Extract filename from URL
    const filename = fileUrl.split('/').pop();

    // Using absolute path for production reliability
    const filePath = path.join(
      __dirname, // Current directory (utils)
      '..',
      'uploads',
      'users',
      userId.toString(),
      uploadType,
      filename
    );

    // Check if file exists before deleting
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted successfully: ${filename}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Generate file URL consistently
export const getImageUrl = (req, userId, uploadType, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/users/${userId.toString()}/${uploadType}/${filename}`;
};

export const getMediaUrl = (req, userId, uploadType, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/users/${userId.toString()}/${uploadType}/${filename}`;
};
