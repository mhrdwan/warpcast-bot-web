import axios from "axios"
import { baseUrl } from "../../baseUrl"

export async function Follows(token, id) {
    try {
        const body = {
            targetFid: id
        }

        const data = await axios.put(`${baseUrl}follows`, body, {
            headers: {
                "Authorization": token,

            }
        })
        console.log(data.data.result)
        console.log('sukses follow')
    } catch (error) {
        console.log(error.response?.data)

    }

}