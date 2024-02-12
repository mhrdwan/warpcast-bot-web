import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ClaimErdrop from './components/Claim'
import RouterPage from '../Routes'
import { BrowserRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <RouterPage />
      </BrowserRouter>
    </>
  )
}

export default App
