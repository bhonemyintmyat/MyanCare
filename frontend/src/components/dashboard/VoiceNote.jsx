import { useRef, useState } from 'react'
import '../../styles/Dashboard.css'

/*
 * Section 3: record or upload a voice note for the next call.
 *
 * Recording uses the browser's built-in MediaRecorder API:
 * 1. getUserMedia asks for microphone permission
 * 2. MediaRecorder collects audio chunks while recording
 * 3. on stop, the chunks become a Blob we can play back
 *
 * useRef (instead of useState) holds the recorder and chunks because
 * changing them should NOT re-render the page — they're just plumbing.
 */
function VoiceNote() {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null) // playback source when set
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  async function startRecording() {
    setError('')
    setSaved(false)
    try {
      // This line triggers the browser's "allow microphone?" prompt
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (event) => chunksRef.current.push(event.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // A blob URL lets the <audio> element play in-memory data
        setAudioUrl(URL.createObjectURL(blob))
        // Release the microphone (turns off the browser's "recording" icon)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setRecording(true)
    } catch {
      // User said no, or the device has no microphone
      setError(
        "We couldn't access your microphone. You can upload an audio file instead.",
      )
    }
  }

  function stopRecording() {
    mediaRecorderRef.current.stop()
    setRecording(false)
  }

  function handleUpload(event) {
    const file = event.target.files[0]
    if (!file) return
    setAudioUrl(URL.createObjectURL(file))
    setError('')
    setSaved(false)
  }

  function handleSave() {
    // TODO(real API): upload the audio to the server, e.g.
    //   const formData = new FormData()
    //   formData.append('voiceNote', audioBlob)
    //   await fetch('/api/voice-note', { method: 'POST', body: formData })
    setSaved(true)
  }

  return (
    <section className="dash-card voice-card">
      <h2 className="dash-card-title">Voice note for the next call</h2>
      <p className="voice-intro">
        Record a short message — our caller will play it to{' '}
        <strong>your parent</strong> at the start of the call.
      </p>

      {error && <p className="voice-error">{error}</p>}

      <div className="voice-controls">
        {recording ? (
          <button type="button" className="btn voice-stop" onClick={stopRecording}>
            ■ Stop recording
          </button>
        ) : (
          <button type="button" className="btn" onClick={startRecording}>
            ● Record
          </button>
        )}

        {/* The label is styled as a button; the real file input is hidden.
            (Browsers don't allow much styling on <input type="file"> itself.) */}
        <label className="voice-upload">
          Upload audio
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            hidden
          />
        </label>
      </div>

      {recording && (
        <p className="voice-recording-hint">Recording… speak your message now.</p>
      )}

      {/* Playback + save appear only once there's something to play */}
      {audioUrl && (
        <div className="voice-preview">
          <audio controls src={audioUrl} className="voice-player" />
          {saved ? (
            <p className="voice-saved">✓ Saved — it will play on the next call.</p>
          ) : (
            <button type="button" className="btn voice-save" onClick={handleSave}>
              Save for next call
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default VoiceNote
