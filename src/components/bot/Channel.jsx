import React, { useState } from 'react'
import { FeedItems } from '../../func/FeedItem';

function Channel({ profileStates, bearer }) {
    const tokens = bearer.split('\n').filter(token => token.trim() !== '');
    const [PilihProfile, setPilihProfile] = useState(null)
    const [AlamatChhanel, setAlamatChhanel] = useState("")
    const [indexKeberapa, setindexKeberapa] = useState("")
    const TokenIndex = tokens[indexKeberapa - 1]
    const [SeluruhDatanya, setSeluruhDatanya] = useState(null)

    function extractAirdropfid(url) {
        const pattern = /\/channel\/([^\/]+)/;
        const match = AlamatChhanel.match(pattern);
        return match ? match[1] : null;
    }
    const airdropfid = extractAirdropfid(AlamatChhanel);

    async function FeeditemButton() {
        const Datanya = await FeedItems(TokenIndex, airdropfid)
        const Hash = Datanya && Datanya?.items?.map((item) => ({
            hash: item?.cast?.hash,
            fid: item?.cast?.author?.fid,
            excludeItemIdPrefixes: item?.cast?.hash.slice(2, 10),
        }))

        console.log(`Hash`, Hash)
        const excludeItemIdPrefixes = SeluruhDatanya && SeluruhDatanya?.items?.map(item => item?.cast?.hash.slice(2, 10),)
        const data2 = await FeedItems(TokenIndex, airdropfid, Datanya.latestMainCastTimestamp, excludeItemIdPrefixes)
        const Hash2 = data2 && data2?.items?.map((item) => ({
            hash: item?.cast?.hash,
            fid: item?.cast?.author?.fid,
            excludeItemIdPrefixes: item?.cast?.hash.slice(2, 10),
        }))
        setSeluruhDatanya([...Hash, ...Hash2]);
        console.log(`SeluruhDatanya`, SeluruhDatanya);

    }
    return (
        <div className=' '>
            <div className='mt-2 text-center '>
                <label className='font-bold text-teal-400'>Pilih Akun Dahulu</label>
            </div>
            <select onChange={(e) => { setindexKeberapa(e.target.selectedIndex); setPilihProfile(e.target.value) }} className='w-[15rem] border border-gray-300 rounded-md text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none'>
                <option >Pilih Akun</option>
                {profileStates && profileStates.map((item, index) => (
                    <option key={item.user.fid} value={item.user.fid}>{index + 1}. {item.user.username}</option>

                ))}
            </select>
            {PilihProfile != null && (
                <>
                    <div className='mt-2 text-center'>
                        <label className='font-bold text-teal-400'>Masukkan Link Channel</label>
                    </div>
                    <input onChange={(e) => setAlamatChhanel(e.target.value)} placeholder='https://warpcast.com/~/channel/airdropfind' className='text-sm w-[15rem] border border-gray-300 rounded-md text-gray-600 h-10 pl-2 pr-2 bg-white hover:border-gray-400 focus:outline-none appearance-none' type='text' />
                    <button onClick={FeeditemButton} className='ml-3 bg-teal-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:text-white'>Search</button>
                </>
            )}
            {PilihProfile != null && SeluruhDatanya != null && (
                <div className='flex items-center '>
                    <div className='mt-2 '>
                        <textarea placeholder='Tuliskan komen untuk masing-masing postingan (1 komen untuk semua postingan)' className='text-sm w-[15rem] h-[4rem] border border-gray-300 rounded-md text-gray-600  pl-2 pr-2 bg-white hover:border-gray-400 focus:outline-none appearance-none' />
                    </div>
                    <button onClick={null} className='ml-3 h-[2.2rem]  bg-red-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:text-white'>Gas!</button>
                </div>
            )}
        </div>
    )
}

export default Channel