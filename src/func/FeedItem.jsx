import axios from "axios";
import { baseUrl } from "../../baseUrl";

export async function FeedItems(token, url, olderThan, excludeItemIdPrefixes) {
    // Periksa apakah excludeItemIdPrefixes tidak ada isinya atau undefined
    const excludePrefixes = excludeItemIdPrefixes && excludeItemIdPrefixes.length ? excludeItemIdPrefixes : undefined;

    // Buat objek bodynya
    const bodynya = {
        "feedKey": url,
        "olderThan": olderThan,
        ...(excludePrefixes && { "excludeItemIdPrefixes": excludePrefixes }),
        "viewedCastHashes": "",
        "updateState": true
    };
    try {
        const data = await axios.post(`${baseUrl}feed-items`, bodynya, {
            headers: {
                "Authorization": token,
            }
        });
        return data.data.result;
    } catch (error) {
        // Tangani error di sini
    }
}
