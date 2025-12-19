import qrcode from '@intosoft/qrcode';
import { config } from '@/utils/qrconfig'

export const generateQRCode = (value: string): string => {
  const result = qrcode.generateSVGString({ ...config, value });

  if (typeof result === 'string') return result;
  return result.svgString;
}
