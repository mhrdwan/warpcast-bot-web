import React, { useState } from 'react'
import { FeedItems } from '../../func/FeedItem';

function Channel({ profileStates, bearer }) {
    const tokens = bearer.split('\n').filter(token => token.trim() !== '');
    const [PilihProfile, setPilihProfile] = useState(null)
    const [AlamatChhanel, setAlamatChhanel] = useState("")
    const [indexKeberapa, setindexKeberapa] = useState("")
    const TokenIndex = tokens[indexKeberapa - 1]
    const [SeluruhDatanya, setSeluruhDatanya] = useState([])

    function extractAirdropfid(url) {
        const pattern = /\/channel\/([^\/]+)/;
        const match = AlamatChhanel.match(pattern);
        return match ? match[1] : null;
    }
    const url = 'https://warpcast.com/~/channel/airdropfind';
    const airdropfid = extractAirdropfid(AlamatChhanel);

    async function FeeditemButton() {
        const Datanya = await FeedItems(TokenIndex, airdropfid)
        console.log(Datanya)
        setSeluruhDatanya(Datanya)
        const Hash = SeluruhDatanya && SeluruhDatanya?.items?.map((item) => ({
            hash: item?.cast?.hash,
            fid: item?.cast?.author?.fid,
            excludeItemIdPrefixes: item?.cast?.hash.slice(2, 10),
        }))
        const excludeItemIdPrefixes = SeluruhDatanya && SeluruhDatanya?.items?.map(item => item?.cast?.hash.slice(2, 10),)
        await FeedItems(TokenIndex, airdropfid, Datanya.latestMainCastTimestamp, excludeItemIdPrefixes)
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
            {SeluruhDatanya && (
                <div className='flex items-center '>
                    <div className='mt-2 '>
                        <textarea placeholder='Tuliskan komen untuk masing-masing postingan (1 komen untuk semua postingan)' className='text-sm w-[15rem] h-[4rem] border border-gray-300 rounded-md text-gray-600  pl-2 pr-2 bg-white hover:border-gray-400 focus:outline-none appearance-none' />
                    </div>
                    <button onClick={null} className='ml-3 h-[2.2rem]  bg-teal-400 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:text-white'>Gass</button>
                </div>
            )}
        </div>
    )
}

export default Channel