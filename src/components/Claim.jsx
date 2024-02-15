import React, { useEffect, useState } from 'react'
import { FetchProfile } from '../func/getProfile'
import { getConfersession } from '../func/getConfersession'
import { postButtonConfersession } from '../func/postButtonConfersession'
import { LikePostingan } from '../func/putLikePostingan'
import { Follows } from '../func/putFollow'
import { useNavigate } from 'react-router-dom'
import Fardegods from './bot/fardegods'
import Channel from './bot/Channel'

function ClaimErdrop() {
    const [Nama, setNama] = useState(localStorage.getItem('user'))
    const [bearer, setBearer] = useState(localStorage.getItem('tokenLoginWarpcast'))
    const [profileStates, setProfileStates] = useState([])
    const [valueSelectMenu, setvalueSelectMenu] = useState("")
    const [LinkConfersession, setLinkConfersession] = useState(null)
    const [dataConfersession, setDataConfersession] = useState([]);
    const [dataNextButtonConfersession, setdataNextButtonConfersession] = useState([])
    const [tokenIndex, setTokenIndex] = useState('');
    const [ValidasiLoginya, setValidasiLoginya] = useState(null)
    const [updatedDataConfersession, setUpdatedDataConfersession] = useState([]);
    const Akunku = [
        259493, 302887, 330578, 338077
    ]
    const [loadingLogin, setloadingLogin] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (!Nama) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        const fetchAndUpdateData = async () => {
            const tokens = bearer.split('\n').filter(token => token.trim() !== '');
            const dataTokennya = tokens[tokenIndex];
            if (dataTokennya) {
                try {
                    const likePostingan = await Promise.all(tokens.map(token => LikePostingan(token, dataNextButtonConfersession.hash, LinkConfersession)))
                    const profilePromises = await postButtonConfersession(dataTokennya, dataNextButtonConfersession);
                    setUpdatedDataConfersession(prev => {
                        // Cari index dari data yang akan diperbarui berdasarkan tokenIndex
                        const dataIndex = prev.findIndex(item => item.tokenIndex.toString() === tokenIndex.toString());
                        if (dataIndex >= 0) {
                            // Jika ditemukan, buat salinan dari array sebelumnya
                            const updatedList = [...prev];
                            // Perbarui data pada index yang ditemukan dengan data baru
                            updatedList[dataIndex] = { tokenIndex, data: profilePromises };
                            return updatedList; // Kembalikan array yang telah diperbarui
                        } else {
                            // Jika tidak ditemukan, tambahkan data baru ke array
                            return [...prev, { tokenIndex, data: profilePromises }];
                        }
                    });
                } catch (error) {
                    console.error("Error dalam postButtonConfersession:", error);
                }
            }
        };

        fetchAndUpdateData();
    }, [tokenIndex, dataNextButtonConfersession, bearer]);




    useEffect(() => {
        // console.log(`updatedDataConfersession`, updatedDataConfersession);
    }, [updatedDataConfersession]);

    // console.log(`dataNextButtonConfersession`, dataNextButtonConfersession)

    // useEffect(() => {
    //     if (bearer) {
    //         validateToken();
    //     }
    // }, [bearer]);


    function extractParts(url) {
        const regex = /\/([^/]+)\/([^/]+)$/;
        const matches = url.match(regex);

        if (matches) {
            const part1 = matches[1];
            const part2 = matches[2];
            return { part1, part2 };
        } else {
            return null;
        }
    }


    const handleLogin = async (validasi, text) => {
        const tokens = bearer.split('\n').filter(token => token.trim() !== '')
        if (!bearer.startsWith("Bearer")) {
            alert('token salah')
            return
        }
        localStorage.setItem('tokenLoginWarpcast', bearer)

        if (validasi === "claim") {

            const parts = extractParts(text);
            const confersessionResults = await Promise.all(tokens.map(token => getConfersession(token, parts)));
            setDataConfersession(confersessionResults);

        } if (validasi == 'nextButton') {
            // const profilePromises = tokens.map(token => postButtonConfersession(token, dataNextButtonConfersession))
            // const profiles = await Promise.all(profilePromises)
            // console.log(profiles)
        }
        else {
            setloadingLogin(true)

            try {
                setloadingLogin(true)
                await FollowDong(tokens)
                const profilePromises = tokens.map(token => FetchProfile(token))
                const profiles = await Promise.all(profilePromises)
                // console.log(`profiles`, profiles?.[0]?.response?.status)
                setProfileStates(profiles)
                if (profiles?.[0]?.response?.status == 400) {
                    console.log('login error')
                    setValidasiLoginya(true)
                } else {
                    setValidasiLoginya(false)
                }
            } catch (error) {

                console.error("Error fetching profiles:", error)

            }
            setloadingLogin(false)
        }

    }
    async function FollowDong(tokens) {
        // console.log(`ini`, tokens)
        for (const datanya of tokens.entries()) {
            for (const akunku of Akunku.entries()) {
                // console.log(datanya[1]);
                // console.log(akunku[1])
                await Follows(datanya[1], akunku[1])
            }
        }
    }
    useEffect(() => {

    }, [localStorage.getItem('tokenLoginWarpcast')])
    return (
        <div className='bg-gray-600 min-h-screen'>
            <div className='flex justify-center items-center  bg-gray-600 '>
                <div className='w-full max-w-xs'>
                    <p className='text-lg font-semibold text-teal-500 mb-2 text-center'>Masukkan Token</p>
                    <textarea
                        className='w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50'
                        onChange={(e) => setBearer(e.target.value)}
                        placeholder='Masukkan token Bearer di sini, pisahkan dengan ENTER'
                        rows="4"
                    />
                    <button
                        className={`w-full mt-4 py-2 rounded-lg ${loadingLogin ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-semibold shadow-lg transition duration-150 ease-in-out`}
                        onClick={handleLogin}
                        disabled={loadingLogin}
                    >
                        {loadingLogin ? "Loading..." : "Login"}
                    </button>
                </div>
            </div>



            {ValidasiLoginya == false || ValidasiLoginya == null ? (
                <>
                    <div className='flex justify-center overflow-x-auto whitespace-nowrap py-2 mx-2 '>
                        {profileStates.map((profile, index) => (
                            <div key={index} className='inline-block bg-white border-black shadow-lg border rounded-lg mx-2' style={{ minWidth: '250px' }}>
                                <div className='flex items-center space-x-3 p-2'>
                                    <img className='w-12 h-12 rounded-full' src={profile?.user?.pfp?.url} alt='Profile' />
                                    <div className='text-xs md:text-sm'>
                                        <div>username: {profile?.user?.username}</div>
                                        <div>fid: {profile?.user?.fid}</div>
                                        <div>followers: {profile?.user?.followerCount}</div>
                                        <div>following: {profile?.user?.followingCount}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div></>
            ) : <>
                <div className='flex justify-center text-red-600 font-bold mt-3'>Gagal Login / Belum Login</div>
            </>}




            <div className='flex justify-center flex-col items-center mt-8 '>
                {bearer && localStorage.getItem('tokenLoginWarpcast') && (
                    <>
                        <h3 className='text-lg font-semibold mb-2 text-teal-400'>Pilih Menu</h3>
                        <select onChange={(e) => setvalueSelectMenu(e.target.value)} className='w-11/12 md:w-[30rem]   mx-auto border border-gray-300 rounded-md text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none'>
                            <option key={1} value="menu">Pilih Menu</option>
                            <option key={2} value="claim">1. Claim Airdrop (auto follow + recast)</option>
                            <option disabled key={3} value="menu2">2. Minta Follback Grup (❌)</option>
                            <option key={4} value="fardegods">3. Bot Fardegods Submit Address</option>
                            <option className='text-wrap' key={5} value="channel">4. (Channel) Like + Recast + Comment minta Follback </option>
                        </select>
                    </>
                )}


                {valueSelectMenu.toLocaleLowerCase() === "claim" && (
                    <>


                        <div className='mt-5 flex justify-center space-x-4 items-center '>
                            <input onChange={(e) => setLinkConfersession(e.target.value)} className='border border-black rounded-sm h-9 pl-2 text-sm md:text-base' type='text' placeholder='Masukkan linknya' />
                            <button disabled={LinkConfersession == null} onClick={() => handleLogin('claim', LinkConfersession)} className='h-9 border border-black rounded-md bg-teal-200 p-2 hover:bg-teal-300 focus:outline-none text-sm md:text-base'>Search</button>
                            <button onClick={() => { setDataConfersession([]); setUpdatedDataConfersession([]) }} className='h-9 border border-red-500 rounded-md bg-red-500 p-2 focus:outline-none text-[0.7rem]  md:text-base'>Hapus Thread</button>
                        </div>

                        {/* {dataConfersession != null && (
                                <>
                                    <div className=' mt-4 text-red-500 font-extrabold'>Pilih Threadnya</div>
                                </>
                            )} */}
                        <div className='flex justify-center flex-wrap gap-4 mt-3'>
                            {dataConfersession.map((data, index) => (

                                <div key={index} className='border w-[20rem] border-gray-300 rounded-lg shadow-lg p-4 bg-white hover:bg-gray-100 flex flex-col items-center'>
                                    <div>Akun ke {index + 1}</div>

                                    {data.map((item, itemIndex) => {
                                        const updatedData = updatedDataConfersession.find(updated => parseInt(updated.tokenIndex) === index);
                                        let currentItems = item.embeds?.urls || [];

                                        // Jika updatedData ada dan data-nya bukan undefined atau null, gunakan data tersebut
                                        if (updatedData && updatedData.data) {
                                            // Jika updatedData.data adalah array, gunakan sebagai currentItems
                                            if (Array.isArray(updatedData.data)) {
                                                currentItems = updatedData.data;
                                            } else if (typeof updatedData.data === 'object') { // Jika bukan array tapi merupakan objek, masukkan ke dalam array
                                                currentItems = [updatedData.data];
                                            }
                                        }

                                        return (
                                            <div key={itemIndex} className='text-center'>

                                                <div style={{ maxWidth: '200px' }} className='text-gray-800 text-sm overflow-hidden text-nowrap mb-4'>
                                                    {item.text}
                                                </div>
                                                {currentItems.map((currentItem, currentItemIndex) => (
                                                    <div key={currentItemIndex} className='flex flex-col items-center'>
                                                        <img src={currentItem.imageUrl || currentItem.openGraph?.frame?.imageUrl} alt="" className='w-[15rem]' />
                                                        <div className='flex space-x-3 justify-center mt-2'>
                                                            {(currentItem.buttons || currentItem.openGraph?.frame?.buttons || []).map((button, buttonIndex) => {

                                                                return (
                                                                    <button
                                                                        onClick={() => {
                                                                            const newData = {
                                                                                hash: item.hash,
                                                                                postUrl: currentItem.postUrl || currentItem.openGraph?.frame?.postUrl,
                                                                                index: button.index,
                                                                                tokenIndex: itemIndex
                                                                            };
                                                                            setdataNextButtonConfersession(newData);
                                                                            setTokenIndex(index.toString());
                                                                            handleLogin('nextButton');
                                                                        }}
                                                                        key={buttonIndex}
                                                                        className='bg-teal-500 mt-4 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition duration-200 ease-in-out'
                                                                    >
                                                                        {button.title}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}

                                </div>
                            ))}

                        </div>
                    </>
                )}
                {valueSelectMenu == 'fardegods' && (
                    <Fardegods />
                )}
                {valueSelectMenu == 'channel' && (
                    <Channel profileStates={profileStates} bearer={bearer} />
                )}




            </div>

        </div>
    )
}

export default ClaimErdrop
