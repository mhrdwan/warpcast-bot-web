import React, { useEffect, useState } from 'react'
import { FetchProfile } from '../func/getProfile'
import { getConfersession } from '../func/getConfersession'
import { postButtonConfersession } from '../func/postButtonConfersession'
import { LikePostingan } from '../func/putLikePostingan'

function ClaimErdrop() {
    const [bearer, setBearer] = useState(localStorage.getItem('tokenLoginWarpcast'))
    const [profileStates, setProfileStates] = useState([])
    const [valueSelectMenu, setvalueSelectMenu] = useState("")
    const [LinkConfersession, setLinkConfersession] = useState(null)
    const [dataConfersession, setDataConfersession] = useState([]);
    const [dataNextButtonConfersession, setdataNextButtonConfersession] = useState([])
    const [tokenIndex, setTokenIndex] = useState('');
    const [updatedDataConfersession, setUpdatedDataConfersession] = useState([]);

    useEffect(() => {
        const fetchAndUpdateData = async () => {
            const tokens = bearer.split('\n').filter(token => token.trim() !== '');
            const dataTokennya = tokens[tokenIndex];
            if (dataTokennya) {
                try {
                    const likePostingan = await Promise.all(tokens.map(token => LikePostingan(token, dataNextButtonConfersession.hash,LinkConfersession)))
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
        localStorage.setItem('tokenLoginWarpcast', bearer)
        if (validasi === "claim") {
            const parts = extractParts(text);
            const confersessionResults = await Promise.all(tokens.map(token => getConfersession(token, parts)));
            setDataConfersession(confersessionResults);
            // console.log(confersessionResults)

        } if (validasi == 'nextButton') {
            // const profilePromises = tokens.map(token => postButtonConfersession(token, dataNextButtonConfersession))
            // const profiles = await Promise.all(profilePromises)
            // console.log(profiles)
        }
        else {
            try {
                const profilePromises = tokens.map(token => FetchProfile(token))
                const profiles = await Promise.all(profilePromises)
                setProfileStates(profiles)
            } catch (error) {
                console.error("Error fetching profiles:", error)
            }
        }

    }


    return (
        <>
            <div className='justify-center grid '>
                <p>Masukkan Token</p>
                <textarea
                    className='border border-black mb-3'
                    onChange={(e) => setBearer(e.target.value)}
                    placeholder='Masukkan token di sini, pisahkan dengan baris baru untuk multiple tokens'
                />
                <button className='rounded-xl mt-2 border border-black border-solid' onClick={handleLogin}>Login</button>


            </div>

            <div className='flex flex-grow justify-center space-x-5 mx-10 md:mx-auto'>
                {profileStates.map((profile, index) => (
                    <>
                        <div key={index} className='mt-5 border-black border rounded-sm w-[12rem] p-2'>
                            <img className='w-[5rem] h-[5rem] rounded-full mx-auto' src={profile.user.pfp.url} alt='Profile' />
                            <div>username : {profile.user.username}</div>
                            <div>fid : {profile.user.fid}</div>
                            <div>followers : {profile.user.followerCount}</div>
                            <div>following : {profile.user.followingCount}</div>
                        </div>
                    </>
                ))}
            </div>
            <div className='flex justify-center flex-col items-center mt-8'>
                <h3 className='text-lg font-semibold mb-2'>Pilih Menu</h3>
                <select onChange={(e) => setvalueSelectMenu(e.target.value)} className='border border-gray-300 rounded-md text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none'>
                    <option key={1} value="menu">Pilih Menu</option>
                    <option key={2} value="claim">1. Claim Airdrop</option>
                    <option key={3} value="menu2">2. Minta Follback Grup</option>
                </select>


                <div className='mt-5 flex justify-center space-x-4 items-center'>
                    {valueSelectMenu.toLocaleLowerCase() === "claim" && (
                        <>
                            <input onChange={(e) => setLinkConfersession(e.target.value)} className='border border-black rounded-sm h-9 pl-2' type='text' placeholder='Masukkan linknya' />
                            <button disabled={LinkConfersession == null} onClick={() => handleLogin('claim', LinkConfersession)} className='h-9  border border-black rounded-md bg-teal-200 p-2 hover:bg-teal-300 focus:outline-none'>Search</button>
                            <button onClick={() => { setDataConfersession([]); setUpdatedDataConfersession([]) }} className='h-9  border border-red-500 rounded-md bg-red-500 p-2  focus:outline-none'>Hapus Thread</button>
                        </>
                    )}
                </div>
                {dataConfersession != null && (
                    <>
                        <div className=' mt-4 text-red-500 font-extrabold'>Pilih Threadnya</div>
                    </>
                )}
                <div className='flex justify-center flex-wrap gap-4 mt-3'>
                    {dataConfersession.map((data, index) => (

                        <div key={index} className='border border-gray-300 rounded-lg shadow-lg p-4 bg-white hover:bg-gray-100 flex flex-col items-center'>
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
                                                    {(currentItem.buttons || currentItem.openGraph?.frame?.buttons || []).map((button, buttonIndex) => (
                                                        <button
                                                            onClick={() => {
                                                                const newData = {
                                                                    hash: item.hash,
                                                                    postUrl: currentItem.postUrl || currentItem.openGraph?.frame?.postUrl,
                                                                    index: button.index,
                                                                    tokenIndex : itemIndex
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
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}

                        </div>
                    ))}

                </div>






            </div>


        </>
    )
}

export default ClaimErdrop
