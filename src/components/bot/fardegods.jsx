import axios from 'axios';
import React, { useState } from 'react';

function Fardegods() {
    const [address, setAddress] = useState("");
    const [hasil, setHasil] = useState([]);

    const Tembak = async (adddd) => {
        const body = { "address": adddd }
        try {
            const data = await axios.patch(`https://linknetwork.website/api/v1/users/saveWallet`, body);
            setHasil(prevHasil => [...prevHasil, { status: data.data.status }]);
        } catch (error) {
            setHasil(prevHasil => [...prevHasil, { error: error.response.data.message }]);
        }
    }

    async function tembakLoh() {
        const addressesArray = address.split('\n'); // Split addresses based on newline
        for (const addr of addressesArray) {
            console.log(addr);
            // Call Tembak function for each address
            await Tembak(addr.trim()); // Remove leading/trailing whitespace
        }
    }

    const handleChange = (e) => {
        const { value } = e.target;
        let formattedAddress = value;
        if (value.length > 45) {
            formattedAddress = value.match(/.{1,45}/g).join('\n');
        }
        setAddress(formattedAddress);
    };

    const countLines = (text) => {
        if (!text) return 0;
        const lineBreaks = text.match(/\n/g);
        return lineBreaks ? lineBreaks.length + 1 : 1;
    };

    return (
        <div className='mt-5'>
            <label className='text-teal-400'>Masukkan Address</label>
            <div>
                <textarea
                    value={address}
                    onChange={handleChange}
                    className='mt-1 w-[20rem] h-[10rem] bg-white'
                ></textarea>
            </div>
            <div className='text-teal-400'>Jumlah Address: {countLines(address)}</div>
            <button onClick={tembakLoh} className='pr-2 pl-2 bg-red-400 flex justify-center'>Tembak</button>
            {hasil.map((item, index) => (
                <div className='text-white' key={index}>
                    {item.status && <p>Status: {item.status}</p>}
                    {item.error && <p>Error: {item.error}</p>}
                </div>
            ))}
        </div>
    );
}

export default Fardegods;
