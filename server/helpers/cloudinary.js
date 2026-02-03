const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeName = file.originalname
      ? file.originalname.replace(/[^a-z0-9\.\-]/gi, "-")
      : "image";
    cb(null, `${Date.now()}-${safeName}${ext && !safeName.endsWith(ext) ? ext : ""}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
