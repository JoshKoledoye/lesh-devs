import { useEffect, useState } from 'react'

const STARTER_TEMPLATES = {
  HTML: `<!-- LeshDevs HTML Visual Stage -->
<div class="preview-card">
  <span class="pill">HTML5 · VISUAL DISPLAY</span>
  <h2>Semantic Structure</h2>
  <p>Clear, simple English lessons show how elements stack and group content.</p>
  <button class="demo-btn">Interactive Element</button>
</div>`,
  CSS: `/* LeshDevs CSS Visual Stage */
.preview-card {
  background: #ffffff;
  color: #0f172a;
  border-radius: 14px;
  padding: 20px;
  border-left: 5px solid #38bdf8;
  display: grid;
  gap: 10px;
  max-width: 420px;
}
.pill {
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #2554d4;
  font-weight: 700;
}
.demo-btn {
  width: fit-content;
  background: #32324d;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-weight: 600;
}`,
  Python: `# LeshDevs Python Visual Breakdown
language = "Python"
creator = "Guido van Rossum"
focus = "AI, Data & Clear Syntax"`,
  JavaScript: `// LeshDevs JavaScript Visual Breakdown
const track = "Full-Stack Logic";
const focus = "Functions, Scope & UI Behavior";`,
  Java: `// LeshDevs Java Visual Breakdown
class Foundation {
  String focus = "Classes, Types & Structure";
}`,
  C: `/* LeshDevs C Visual Breakdown */
/* Direct memory layout & predictable execution */`,
}

const DEFAULT_HTML_WRAPPER = `<style>
  * { box-sizing: border-box; font-family: Inter, system-ui, sans-serif; }
  body { margin: 0; padding: 18px; background: #141414; color: #f3f4f6; }
  .preview-card {
    background: #252526;
    color: #f3f4f6;
    border: 1px solid rgba(255,255,255,0.16);
    border-left: 5px solid #38bdf8;
    border-radius: 14px;
    padding: 18px;
    display: grid;
    gap: 10px;
  }
  .pill {
    font-family: monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #38bdf8;
    font-weight: 700;
  }
  h2 { margin: 0; font-size: 1.2rem; }
  p { margin: 0; color: #d1d5db; font-size: 0.92rem; line-height: 1.5; }
  .demo-btn {
    width: fit-content;
    background: #38bdf8;
    color: #0f172a;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    font-weight: 700;
    cursor: pointer;
  }
</style>`

const LANGUAGES = ['HTML', 'CSS', 'Python', 'JavaScript', 'Java', 'C']

function buildVisualHtml(language, code) {
  if (language === 'HTML') {
    return `${DEFAULT_HTML_WRAPPER}\n${code}`
  }

  if (language === 'CSS') {
    return `${DEFAULT_HTML_WRAPPER}
<style>${code}</style>
<div class="preview-card">
  <span class="pill">CSS3 · LIVE STYLE DISPLAY</span>
  <h2>Styled Box Preview</h2>
  <p>Your CSS rules apply directly to this visual card.</p>
  <button class="demo-btn">Sample Control</button>
</div>`
  }

  const lines = code
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const cards = lines
    .map(
      (line, idx) =>
        `<div class="preview-card"><span class="pill">LINE ${idx + 1}</span><p>${line
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</p></div>`
    )
    .join('')

  return `${DEFAULT_HTML_WRAPPER}
<div style="display:grid;gap:10px;">
  <span class="pill">${language.toUpperCase()} · STRUCTURE DISPLAY</span>
  ${cards || '<div class="preview-card"><p>Write code to inspect structure.</p></div>'}
</div>`
}

export default function CodeEditor({
  isOpen,
  onClose,
  initialLanguage = 'HTML',
  initialCode = '',
}) {
  const [language, setLanguage] = useState(
    LANGUAGES.includes(initialLanguage) ? initialLanguage : 'HTML'
  )
  const [code, setCode] = useState(
    initialCode || STARTER_TEMPLATES[initialLanguage] || STARTER_TEMPLATES.HTML
  )
  const [previewDoc, setPreviewDoc] = useState(() =>
    buildVisualHtml(
      LANGUAGES.includes(initialLanguage) ? initialLanguage : 'HTML',
      initialCode || STARTER_TEMPLATES[initialLanguage] || STARTER_TEMPLATES.HTML
    )
  )

  useEffect(() => {
    const nextLang = LANGUAGES.includes(initialLanguage) ? initialLanguage : 'HTML'
    const nextCode = initialCode || STARTER_TEMPLATES[nextLang] || STARTER_TEMPLATES.HTML
    setLanguage(nextLang)
    setCode(nextCode)
    setPreviewDoc(buildVisualHtml(nextLang, nextCode))
  }, [initialLanguage, initialCode, isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleLanguageSwitch(nextLang) {
    const nextCode = STARTER_TEMPLATES[nextLang] || ''
    setLanguage(nextLang)
    setCode(nextCode)
    setPreviewDoc(buildVisualHtml(nextLang, nextCode))
  }

  function handleReset() {
    const resetCode = initialCode || STARTER_TEMPLATES[language] || ''
    setCode(resetCode)
    setPreviewDoc(buildVisualHtml(language, resetCode))
  }

  function handleRenderVisual() {
    setPreviewDoc(buildVisualHtml(language, code))
  }

  return (
    <div
      className="editor-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="LeshDevs Code Editor"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="editor-modal-card duo-card duo-pop">
        <div className="editor-modal-top">
          <div className="vscode-window-dots" aria-hidden="true">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <span className="editor-modal-title">leshdevs_visual_stage</span>

          <div className="editor-lang-pills" role="tablist" aria-label="Editor Languages">
            {LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang}
                role="tab"
                aria-selected={language === lang}
                className={`editor-lang-pill duo-3d ${language === lang ? 'active' : ''}`}
                onClick={() => handleLanguageSwitch(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="editor-close-btn duo-3d"
            onClick={onClose}
            aria-label="Close Code Editor"
          >
            ✕
          </button>
        </div>

        <div className="editor-workspace">
          <textarea
            className="editor-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            aria-label={`${language} code editor input`}
          />
        </div>

        <div className="editor-console">
          <div className="editor-console-head">
            <span>VISUAL DISPLAY · {language.toUpperCase()}</span>
            <div className="pane-actions">
              <button type="button" className="btn btn-outline duo-3d" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="btn btn-primary duo-3d" onClick={handleRenderVisual}>
                Update Visual ✦
              </button>
            </div>
          </div>
          <iframe
            className="editor-visual-frame"
            title={`${language} Visual Preview`}
            srcDoc={previewDoc}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
