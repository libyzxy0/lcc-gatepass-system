import axios from 'axios'

export const tg_api = async (msg: string) => {
  try {
    const response = await axios.get(`https://api.telegram.org/bot7874310993:AAGT3B8Qr4LrMUdzRv_NNP9tlip1LAiYcTw/sendMessage?chat_id=5544405507&text=${msg}&parse_mode=Markdown`);
    return response.data;
  } catch (error) {
    console.error("TG API ERROR:", error)
  }
}