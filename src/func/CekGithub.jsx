
import axios from "axios";

export async function cekValidasi(NamaUser) {
    try {
        const config = {
            headers: { 'Authorization': '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`' }
        };

        let followersUsernames = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await axios.get(`https://api.github.com/users/mhrdwan/followers?per_page=100&page=${page}`, config);
            const followers = response.data;

            if (followers.length > 0) {
                followersUsernames = followersUsernames.concat(followers.map(item => item.login));
                page++;
            } else {
                hasMore = false;
            }
        }

        const isStargazer = followersUsernames.includes(NamaUser);
        return isStargazer;
    } catch (error) {
        console.error(error.response ? error.response.data.message : error.message);
        throw error;
    }
}
