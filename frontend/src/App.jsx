import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import STTListener  from './component/STTListener'
function App() {
  return (
    <div>
      <h1>🎓 Learning Assistant</h1>
      <STTListener />
    </div>
  );
}

export default App
