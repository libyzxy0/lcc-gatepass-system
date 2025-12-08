import axios from 'axios'

export const verifyTurnstile = async (token: string) => {
  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
      response: token,
    })
    if (!response.data) return null;
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}