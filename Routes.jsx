import { Route, Routes } from 'react-router-dom'
import ClaimErdrop from './src/components/Claim'
import LoginPage from './src/Login'

function RouterPage() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/bot' element={<ClaimErdrop />} />
                <Route path='*' element={<div className=''>
                    <div className='h-screen flex justify-center items-center text-[90px] w-screen  font-bold'>Halaman Tidak Ditemukan</div>
                </div>} />
            </Routes>
        </div>
    )
}

export default RouterPage