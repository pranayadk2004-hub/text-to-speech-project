import { useEffect, useState } from 'react'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function App() {
  const [text, setText] = useState('Hello! Type something and press Speak.')
  const [voices, setVoices] = useState([])
  const [voiceName, setVoiceName] = useState('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = () => {
    if (!supported || !text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find((v) => v.name === voiceName)
    if (voice) utterance.voice = voice
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <main className="app">
      <h1>Text to Speech</h1>
      {!supported && (
        <p className="warning">Your browser does not support speech synthesis.</p>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Enter text to speak…"
      />
      <div className="controls">
        <label>
          Voice
          <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)}>
            <option value="">Default</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </label>
        <label>
          Rate: {rate.toFixed(1)}
          <input type="range" min="0.5" max="2" step="0.1" value={rate}
            onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label>
          Pitch: {pitch.toFixed(1)}
          <input type="range" min="0" max="2" step="0.1" value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))} />
        </label>
      </div>
      <div className="buttons">
        <button onClick={speak} disabled={!supported || !text.trim()}>
          {speaking ? 'Restart' : 'Speak'}
        </button>
        <button onClick={stop} disabled={!speaking}>Stop</button>
      </div>
    </main>
  )
}

export default App
