import { useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useToast } from '../../context/ToastContext.jsx'
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
 *
 * Accessibility:
 * - one toggle button with aria-pressed, so screen readers announce
 *   "Record, toggle button, pressed" while recording
 * - status messages use role="status" (announced politely) and the
 *   error uses role="alert" (announced immediately)
 */
function VoiceNote() {
  const { t } = useTranslation()
  const addToast = useToast()

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
      setError(t('dashboard.voice.micError'))
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
    //   await fetch(`${API_URL}/voice-note`, { method: 'POST', body: formData })
    setSaved(true)
    addToast(t('dashboard.voice.toast'))
  }

  return (
    <section className="dash-card voice-card">
      <h2 className="dash-card-title">{t('dashboard.voice.title')}</h2>
      <p className="voice-intro">
        {/* Trans: the translation contains <strong>…</strong> markup,
            so translators can move the emphasis where their language
            needs it */}
        <Trans
          i18nKey="dashboard.voice.intro"
          components={{ strong: <strong /> }}
        />
      </p>

      {error && (
        <p className="voice-error" role="alert">
          {error}
        </p>
      )}

      <div className="voice-controls">
        {/* One toggle button: label AND aria-pressed change together.
            aria-hidden hides the ●/■ symbols from screen readers —
            they'd be read out loud as "black circle" otherwise. */}
        <button
          type="button"
          className={recording ? 'btn voice-stop' : 'btn'}
          onClick={recording ? stopRecording : startRecording}
          aria-pressed={recording}
        >
          <span aria-hidden="true">{recording ? '■' : '●'}</span>{' '}
          {recording ? t('dashboard.voice.stop') : t('dashboard.voice.record')}
        </button>

        {/* The label is styled as a button; the real file input is hidden.
            (Browsers don't allow much styling on <input type="file"> itself.) */}
        <label className="voice-upload">
          {t('dashboard.voice.upload')}
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            hidden
          />
        </label>
      </div>

      {/* role="status" = announced by screen readers when it appears */}
      {recording && (
        <p className="voice-recording-hint" role="status">
          {t('dashboard.voice.hint')}
        </p>
      )}

      {/* Playback + save appear only once there's something to play */}
      {audioUrl && (
        <div className="voice-preview">
          <audio
            controls
            src={audioUrl}
            className="voice-player"
            aria-label={t('dashboard.voice.previewLabel')}
          />
          {saved ? (
            <p className="voice-saved" role="status">
              {t('dashboard.voice.saved')}
            </p>
          ) : (
            <button type="button" className="btn voice-save" onClick={handleSave}>
              {t('dashboard.voice.save')}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default VoiceNote
