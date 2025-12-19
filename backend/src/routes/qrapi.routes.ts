import { Router, Request, Response } from "express";
import { generateQRCode } from '@/utils/qrcode'

const router = Router();

router.get('/generate', (req: Request, res: Response) => {
  const { text } = req.query;
  
  if(!text) {
    return res.status(400).json({ error: 'Missing text in params.' })
  }
  
  const svgString = generateQRCode(text);

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Content-Length': Buffer.byteLength(svgString)
  });

  res.end(svgString);
});

export default router;