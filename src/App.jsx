import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ClaimErdrop from './components/Claim'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ClaimErdrop/>
    </>
  )
}

export default App
