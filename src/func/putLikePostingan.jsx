import axios from "axios"
import { baseUrl } from "../../baseUrl"

export const LikePostingan = async (token, castHash, LinkConfersession) => {
    const bodynya = { "castHash": castHash }
    console.log(`LinkConfersession`, LinkConfersession);
    try {
        const data = await axios.put(`${baseUrl}cast-likes`, bodynya, {
            headers: {
                "Authorization": token,

            }
        })
        // console.log(data.data.result)
        await AutoRecash(token, castHash,LinkConfersession)
        return data.data.result
    } catch (error) {
        console.log(error.response.data.errors)
    }
}


export const AutoRecash = async (token, castHash, datacastSlice) => {
    const sebeLumRecash = { "text": "", "embeds": [`${datacastSlice}`] }
    const bodynya = { "castHash": castHash }
    try {
        const sebelumRecast = await axios.put(`${baseUrl}cast-attachments`, sebeLumRecash, {
            headers: {
                "Authorization": token,

            }
        })
        const data = await axios.put(`${baseUrl}recasts`, bodynya, {
            headers: {
                "Authorization": token,

            }
        })

    } catch (error) {
        console.log(error.response.data.errors)
    }
}