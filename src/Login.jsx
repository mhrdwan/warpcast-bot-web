import React, { useEffect, useState } from 'react';
import { cekValidasi } from './func/CekGithub';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [githubUsername, setGithubUsername] = useState('');
    const [validasi, setValidsasi] = useState(null)
    const navigasi = useNavigate()

    useEffect(() => {
        if (validasi == true) {
            navigasi('/bot')
        }
    }, [validasi])
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('GitHub Username:', githubUsername);
        // Proses login atau validasi bisa ditambahkan di sini
        await cekValidasi(githubUsername).then((e) => { setValidsasi(e); console.log(e) })
        localStorage.setItem('user', githubUsername)
    };

    return (
        <div className="flex h-screen items-center justify-center bg-black p-4 border border-black">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 ">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {
                            validasi === false ? (
                                <>
                                    <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700">
                                        Kamu belum follow :') silahkan follow dahulu
                                        <a href="https://github.com/mhrdwan" className="text-red-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer"> Follow</a>
                                    </label>
                                </>
                            ) : validasi === true ? (
                                <>
                                    <label htmlFor="githubUsername" className="block text-sm font-medium text-green-500">
                                        Terimakasih Sudah Follow :)
                                    </label>
                                </>
                            ) : (
                                <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700">
                                    Masukkan Username GitHub Kamu, Pastikan Sudah
                                    <a href="https://github.com/mhrdwan" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer"> Follow</a>
                                </label>
                            )
                        }


                        <input
                            type="text"
                            id="githubUsername"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Username GitHub"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-3 text-white w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Check
                    </button>
                </form>
            </div >
        </div >

    );
}

export default LoginPage;
