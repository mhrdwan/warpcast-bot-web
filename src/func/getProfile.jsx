import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const FetchProfile = async (bearer) => {
    const data = await axios.get(`${baseUrl}onboarding-state`, {
        headers: {
            Authorization: bearer
        }
    });
    // console.log(data.data.result.state)
    return data.data.result.state
}
