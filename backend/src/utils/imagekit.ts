const ImageKit = require("imagekit");
import { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY } from '@/secrets'

export const imagekit = new ImageKit({
    publicKey : IMAGEKIT_PUBLIC_KEY,
    privateKey : IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : "https://ik.imagekit.io/libyzxy0"
});