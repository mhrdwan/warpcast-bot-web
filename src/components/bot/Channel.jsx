import React, { useEffect, useState } from 'react'
import { FeedItems } from '../../func/FeedItem';
import { PostKomen } from '../../func/PostKomen';
import katanyaData from "../../WorldList/Kata-Kata Follow Indonesia.json"
import { Follows } from '../../func/putFollow';


function Channel({ profileStates, bearer }) {
    const tokens = bearer.split('\n').filter(token => token.trim() !== '');
    const [PilihProfile, setPilihProfile] = useState(null)
    const [AlamatChhanel, setAlamatChhanel] = useState("")
    const [indexKeberapa, setindexKeberapa] = useState("")
    const TokenIndex = tokens[indexKeberapa - 1]
    const [SeluruhDatanya, setSeluruhDatanya] = useState(null)
    const [IsiKomen, setIsiKomen] = useState("")
    // console.log(`katanyaData`, katanyaData)
    function extractAirdropfid(url) {
        const pattern = /\/channel\/([^\/]+)/;
        const match = AlamatChhanel.match(pattern);
        return match ? match[1] : null;
    }
    const airdropfid = extractAirdropfid(AlamatChhanel);
    const [LoadingButton, setLoadingButton] = useState(false)
    async function FeeditemButton() {
        let SatuanSeluruhnya = []
        setLoadingButton(true)
        const Datanya = await FeedItems(TokenIndex, airdropfid)
        const Hash = Datanya && Datanya?.items?.map((item) => ({
            hash: item?.cast?.hash,
            fid: item?.cast?.author?.fid,
            excludeItemIdPrefixes: item?.cast?.hash.slice(2, 10),
        }))

        const excludeItemIdPrefixes = SeluruhDatanya && SeluruhDatanya?.items?.map(item => item?.cast?.hash.slice(2, 10),)
        const data2 = await FeedItems(TokenIndex, airdropfid, Datanya.latestMainCastTimestamp, excludeItemIdPrefixes)
        const Hash2 = data2 && data2?.items?.map((item) => ({
            hash: item?.cast?.hash,
            fid: item?.cast?.author?.fid,
            excludeItemIdPrefixes: item?.cast?.hash.slice(2, 10),
        }))
        SatuanSeluruhnya = [...Hash, ...Hash2]
        setSeluruhDatanya([SatuanSeluruhnya]);
        setLoadingButton(false)

    }
    console.log(`SeluruhDatanya 2`, SeluruhDatanya)

    async function komen() {
        // Assuming SeluruhDatanya[0] is an array of objects where each object has a 'hash' and 'fid' property
        const items = SeluruhDatanya?.[0] || [];

        try {
            for (let i = 0; i < items.length; i++) {
                const { hash, fid } = items[i];
                // Select a comment text from katanyaData array, cycling through if there are more items than comments
                const komenText = katanyaData[i % katanyaData.length];

                console.log(`Following fid: ${fid} and posting comment "${komenText}" for hash: ${hash}`);
                // Update the state for IsiKomen if necessary, or you can remove this if not needed

                // Perform the follow action
                try {
                    const followResponse = await Follows(TokenIndex, fid);
                    console.log('Follow response:', followResponse);
                } catch (followError) {
                    console.error(`Failed to follow fid: ${fid}`, followError);
                }

                // Post the comment
                try {
                    const commentResponse = await PostKomen(TokenIndex, komenText, hash);
                    console.log('Comment response:', commentResponse);
                } catch (commentError) {
                    console.error(`Failed to post comment for hash: ${hash}`, commentError);
                }
                setIsiKomen(`Posting follow dan komen "${komenText}"`);

                // Wait for 5 seconds before the next iteration
                // await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } catch (error) {
            console.error("Failed to process items:", error);
        }
    }




    return (
        <div className=' '>
            <div className='mt-2 text-center '>
                <label className='font-bold text-teal-400'>Pilih Akun Dahulu</label>
            </div>
            <div className='flex justify-center'>
                <select onChange={(e) => { setindexKeberapa(e.target.selectedIndex); setPilihProfile(e.target.value) }} className='w-[15rem]   border border-gray-300 rounded-md text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none'>
                    <option >Pilih Akun</option>
                    {profileStates && profileStates.map((item, index) => (
                        <option key={item.user.fid} value={item.user.fid}>{index + 1}. {item.user.username}</option>

                    ))}
                </select>
            </div>
            {PilihProfile != null && (
                <>
                    <div className='mt-2 text-center'>
                        <label className='font-bold text-teal-400'>Masukkan Link Channel</label>
                    </div>
                    <div className='flex justify-center'>
                        <input onChange={(e) => setAlamatChhanel(e.target.value)} placeholder='https://warpcast.com/~/channel/airdropfind' className='text-sm w-[15rem] border border-gray-300 rounded-md text-gray-600 h-10 pl-2 pr-2 bg-white hover:border-gray-400 focus:outline-none appearance-none' type='text' />
                        <button disabled={LoadingButton == true} onClick={FeeditemButton} className='  ml-3 bg-teal-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:text-white'>{LoadingButton == false ? "Search" : "Loading..."}</button>
                    </div>
                </>
            )}
            {PilihProfile != null && SeluruhDatanya != null && (
                <>
                    <div className='flex flex-col text-center items-center justify-center '>
                        <div className='mt-2 '>
                            {/* <textarea onChange={(e) => setIsiKomen(e.target.value)} placeholder='Tuliskan komen untuk masing-masing postingan (1 komen untuk semua postingan)' className='text-sm w-[15rem] h-[4rem] border border-gray-300 rounded-md text-gray-600  pl-2 pr-2 bg-white hover:border-gray-400 focus:outline-none appearance-none' /> */}
                            <button onClick={komen} className='w-[15rem]  h-[2.2rem]  mt-2  bg-red-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:text-white'>Gas Bang</button>
                        </div>
                        <div className='mt-4 text-green-400'>
                            {IsiKomen}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Channel