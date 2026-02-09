const multer = require("multer");
const path = require("path");
const fs = require("fs");

const baseUploadDir = path.join(__dirname, "..", "uploads");

// Create all upload directories
const uploadDirs = {
  products: path.join(baseUploadDir, "products"),
  slider: path.join(baseUploadDir, "slider"),
  team: path.join(baseUploadDir, "team"),
  videos: path.join(baseUploadDir, "videos"),
  banners: path.join(baseUploadDir, "banners"),
};

// Ensure all directories exist
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Legacy upload (root uploads folder)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, baseUploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeName = file.originalname
      ? file.originalname.replace(/[^a-z0-9\.\-]/gi, "-")
      : "image";
    cb(null, `${Date.now()}-${safeName}${ext && !safeName.endsWith(ext) ? ext : ""}`);
  },
});

// Create storage for specific upload types
const createStorage = (uploadType) => {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDirs[uploadType] || baseUploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "");
      const safeName = file.originalname
        ? file.originalname.replace(/[^a-z0-9\.\-]/gi, "-")
        : "file";
      cb(null, `${Date.now()}-${safeName}${ext && !safeName.endsWith(ext) ? ext : ""}`);
    },
  });
};

const upload = multer({ storage });
const uploadProduct = multer({ storage: createStorage('products') });
const uploadSlider = multer({ storage: createStorage('slider') });
const uploadTeam = multer({ storage: createStorage('team') });
const uploadVideo = multer({ 
  storage: createStorage('videos'),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
});
const uploadBanner = multer({ storage: createStorage('banners') });

module.exports = { 
  upload, 
  uploadProduct, 
  uploadSlider, 
  uploadTeam, 
  uploadVideo, 
  uploadBanner 
};
