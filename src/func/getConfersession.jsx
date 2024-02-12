import axios from "axios";
import { baseUrl } from "../../baseUrl";

export async function getConfersession(token, part) {
    const data = await axios.get(`${baseUrl}user-thread-casts?castHashPrefix=${part.part2}&username=${part.part1}&limit=1`, {
        headers: {
            "Authorization": token,
        }
    });
    console.log(data.data.result.casts)
    return data.data.result.casts
}