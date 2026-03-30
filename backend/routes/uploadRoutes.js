import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    // 🔥 TEMP (simulate Cloudinary)
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 👉 For now just return dummy URL
    const fakeUrl = `https://dummyfile.com/${file.originalname}`;

    res.json({
      fileUrl: fakeUrl,
      filePublicId: "demo123",
      originalName: file.originalname,
      bytes: file.size,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;