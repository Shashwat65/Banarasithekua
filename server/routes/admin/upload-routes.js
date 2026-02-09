const express = require("express");
const { uploadProduct, uploadSlider, uploadTeam, uploadVideo, uploadBanner } = require("../../helpers/cloudinary");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Admin only middleware
router.use(authMiddleware, (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admins only' });
  next();
});

// Generic upload handler
const handleUpload = (folder) => async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/${folder}/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        url: fileUrl,
        public_id: req.file.filename,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error occurred while uploading" });
  }
};

// Upload endpoints for different media types
router.post("/product", uploadProduct.single("file"), handleUpload("products"));
router.post("/slider", uploadSlider.single("file"), handleUpload("slider"));
router.post("/team", uploadTeam.single("file"), handleUpload("team"));
router.post("/video", uploadVideo.single("file"), handleUpload("videos"));
router.post("/banner", uploadBanner.single("file"), handleUpload("banners"));

// Multiple file uploads
router.post("/products-multiple", uploadProduct.array("files", 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uploads = req.files.map(file => ({
      url: `${baseUrl}/uploads/products/${file.filename}`,
      public_id: file.filename,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({ success: true, data: uploads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error occurred while uploading" });
  }
});

module.exports = router;
