import axios from "axios";
import { baseUrl } from "../../baseUrl";

export async function PostKomen(token, komennya, hash) {
    const body = { "text": komennya, "parent": { "hash": hash }, "embeds": [] }
    try {
        const data = await axios.post(`${baseUrl}casts`, body, {
            headers: {
                "Authorization": token,
            }
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}