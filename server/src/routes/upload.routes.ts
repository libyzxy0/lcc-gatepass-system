import { Router, Request, Response } from "express";
import { imagekit } from "@/utils/imagekit";
import { upload } from "@/utils/multer";

const router = Router();

interface UploadRequest extends Request {
  file?: {
    originalname: string;
    buffer: Buffer;
  };
}

router.post(
  "/imagekit",
  upload.single("file"),
  async (req: UploadRequest, res: Response) => {
    console.log('Uploading file:', req.file.originalname);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95
          }
        ],
        checks: `"file.size" < "5mb"`
      });

      return res.json({
        url: result.url,
        fileId: result.fileId
      });
    } catch (error) {
      console.error("Error Imagekit:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Upload failed"
      });
    }
  }
);

export default router;
