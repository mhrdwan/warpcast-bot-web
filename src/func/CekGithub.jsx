import axios from "axios";

export async function cekValidasi(NamaUser) {
    try {
        const config = {
            headers: { 'Authorization': ` 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` }
        };

        const followers = await axios.get(`https://api.github.com/users/mhrdwan/followers`, config);
        const followersUsernames = followers.data.map(item => item.login);
        const isStargazer = followersUsernames.includes(NamaUser);
        // console.log(isStargazer)
        return isStargazer
    } catch (error) {
        console.error(error.response ? error.response.data.message : error.message);
        throw error;
    }
}