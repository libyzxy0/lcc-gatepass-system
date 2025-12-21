import { Router, Request, Response } from "express";
import { generateQRCode } from '@/utils/qrcode'
import { ParsedQs } from 'qs';

const router = Router();

router.get('/generate', (req: Request, res: Response) => {

  const rawText = req.query.text;
  const text = Array.isArray(rawText) ? rawText[0] : rawText;

  if (typeof text !== 'string') {
    return res.status(400).send('Invalid text parameter');
  }

  const svgString = generateQRCode(text);

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Content-Length': Buffer.byteLength(svgString)
  });

  res.end(svgString);
});

export default router;