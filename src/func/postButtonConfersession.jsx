import axios from "axios";
import { baseUrl } from "../../baseUrl";

export async function postButtonConfersession(token, dataSemua) {
    const bodynya = {
        "castHash": dataSemua.hash, "framePostUrl": dataSemua.postUrl, "frameActionIndex": dataSemua.index
    };
    try {
        const data = await axios.post(`${baseUrl}cast-frame-action`, bodynya, {
            headers: {
                "Authorization": token
            }
        })
        // console.log(`ini dari api`,data.data.result.frame)
        return data.data.result.frame
    } catch (error) {

    }
}