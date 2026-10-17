const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const {
  isCloudinaryConfigured,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} = require('../config/cloudinary');

const router = express.Router();

// Define and ensure local fallback upload directories exist
const uploadsBaseDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadsBaseDir, 'images');
const videosDir = path.join(uploadsBaseDir, 'videos');

[imagesDir, videosDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Use Memory Storage so we can stream to Cloudinary or save locally
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

const allowedVideoTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-matroska',
  'video/x-msvideo',
];

// Multer Upload Limits from Environment
const MAX_IMAGE_SIZE_MB = parseInt(process.env.MAX_IMAGE_SIZE_MB, 10) || 15;
const MAX_VIDEO_SIZE_MB = parseInt(process.env.MAX_VIDEO_SIZE_MB, 10) || 100;

const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed.'));
    }
  },
});

const uploadVideo = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, WebM, OGG, MOV, and MKV video formats are allowed.'));
    }
  },
});

/**
 * Helper to upload a single image buffer to Cloudinary or Local disk
 */
const saveImageBuffer = async (buffer, originalname, mimetype, size) => {
  let fileUrl = '';
  let publicId = null;
  let storageProvider = 'local';

  if (isCloudinaryConfigured()) {
    const result = await uploadImageToCloudinary(
      buffer,
      'portfolio/projects',
      originalname
    );
    fileUrl = result.secure_url;
    publicId = result.public_id;
    storageProvider = 'cloudinary';
  } else {
    const ext = path.extname(originalname).toLowerCase() || '.jpg';
    const safeName = path
      .basename(originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFilename = `img-${safeName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const localPath = path.join(imagesDir, uniqueFilename);
    fs.writeFileSync(localPath, buffer);
    fileUrl = `/uploads/images/${uniqueFilename}`;
  }

  return {
    url: fileUrl,
    publicId,
    storage: storageProvider,
    originalName: originalname,
    size,
    mimetype,
  };
};

/**
 * @desc    Upload Single Image (Cloudinary with Local Fallback)
 * @route   POST /api/upload/image
 * @access  Private / Admin
 */
router.post(
  '/image',
  verifyAccessToken,
  requireAdmin,
  (req, res, next) => {
    uploadImage.single('image')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `Image file size exceeds maximum limit of ${MAX_IMAGE_SIZE_MB}MB.`,
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided in request (field: image).',
        });
      }

      try {
        const fileData = await saveImageBuffer(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          req.file.size
        );

        res.status(200).json({
          success: true,
          message: `Image uploaded successfully (${fileData.storage})`,
          data: fileData,
        });
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: uploadErr.message || 'Failed to process image upload.',
        });
      }
    });
  }
);

/**
 * @desc    Upload Multiple Images in Batch (Cloudinary with Local Fallback)
 * @route   POST /api/upload/images
 * @access  Private / Admin
 */
router.post(
  '/images',
  verifyAccessToken,
  requireAdmin,
  (req, res, next) => {
    uploadImage.fields([
      { name: 'images', maxCount: 15 },
      { name: 'image', maxCount: 15 },
    ])(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `One or more files exceed the maximum image limit of ${MAX_IMAGE_SIZE_MB}MB.`,
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const files = [
        ...(req.files?.images || []),
        ...(req.files?.image || []),
      ];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided in request (field: images).',
        });
      }

      try {
        const uploadPromises = files.map((file) =>
          saveImageBuffer(file.buffer, file.originalname, file.mimetype, file.size)
        );
        const uploadedItems = await Promise.all(uploadPromises);

        res.status(200).json({
          success: true,
          count: uploadedItems.length,
          message: `${uploadedItems.length} images uploaded successfully.`,
          data: uploadedItems,
        });
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: uploadErr.message || 'Failed to process batch image upload.',
        });
      }
    });
  }
);

/**
 * @desc    Upload Video (Cloudinary with Local Fallback)
 * @route   POST /api/upload/video
 * @access  Private / Admin
 */
router.post(
  '/video',
  verifyAccessToken,
  requireAdmin,
  (req, res, next) => {
    uploadVideo.single('video')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `Video file size exceeds maximum limit of ${MAX_VIDEO_SIZE_MB}MB.`,
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No video file provided in request (field: video).',
        });
      }

      try {
        let fileUrl = '';
        let publicId = null;
        let storageProvider = 'local';

        if (isCloudinaryConfigured()) {
          // Upload to Cloudinary
          const result = await uploadVideoToCloudinary(
            req.file.buffer,
            'portfolio/videos',
            req.file.originalname
          );
          fileUrl = result.secure_url;
          publicId = result.public_id;
          storageProvider = 'cloudinary';
        } else {
          // Local fallback
          const ext = path.extname(req.file.originalname).toLowerCase() || '.mp4';
          const safeName = path
            .basename(req.file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .slice(0, 30);
          const uniqueFilename = `video-${safeName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          const localPath = path.join(videosDir, uniqueFilename);
          fs.writeFileSync(localPath, req.file.buffer);
          fileUrl = `/uploads/videos/${uniqueFilename}`;
        }

        res.status(200).json({
          success: true,
          message: `Video uploaded successfully (${storageProvider})`,
          data: {
            url: fileUrl,
            publicId,
            storage: storageProvider,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          },
        });
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: uploadErr.message || 'Failed to process video upload.',
        });
      }
    });
  }
);

module.exports = router;
