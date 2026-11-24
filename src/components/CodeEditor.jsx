import { useEffect, useState } from 'react'

const starterCode = {
  Python: `def greet(name):\n    print("Hello,", name)\n\ngreet("LeshDevs")\n`,
  Java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java");\n    }\n}\n`,
  HTML: `<div class="demo-box">\n  <h3>LeshDevs Lab</h3>\n  <p>Edit markup and hit Run.</p>\n</div>\n`,
  CSS: `.demo-box {\n  padding: 20px;\n  background: #020C33;\n  color: #ffffff;\n  font-family: system-ui, sans-serif;\n}\n`,
  JavaScript: `const tracks = ["Python", "Java", "HTML", "CSS", "JavaScript", "C"];\nconsole.log("Tracks count:", tracks.length);\n`,
  C: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello from C\\n");\n    return 0;\n}\n`,
}

const langList = Object.keys(starterCode)

function executeSnippet(language, code, htmlCode, cssCode) {
  if (language === 'HTML') {
    return {
      type: 'preview',
      srcDoc: `<!doctype html><html><head><style>body{margin:16px;font-family:system-ui,sans-serif;}${cssCode}</style></head><body>${code}</body></html>`,
      output: ['Rendered HTML preview.'],
    }
  }

  if (language === 'CSS') {
    return {
      type: 'preview',
      srcDoc: `<!doctype html><html><head><style>body{margin:16px;font-family:system-ui,sans-serif;}${code}</style></head><body>${htmlCode}</body></html>`,
      output: ['Applied CSS rules to sample HTML.'],
    }
  }

  if (language === 'JavaScript') {
    const logs = []
    const sandboxConsole = {
      log: (...args) => logs.push(args.map((item) => String(item)).join(' ')),
      warn: (...args) => logs.push(`WARN: ${args.join(' ')}`),
      error: (...args) => logs.push(`ERROR: ${args.join(' ')}`),
    }

    try {
      // eslint-disable-next-line no-new-func
      const runner = new Function('console', code)
      const returned = runner(sandboxConsole)
      if (returned !== undefined) {
        logs.push(`=> ${String(returned)}`)
      }
      return {
        type: 'console',
        srcDoc: '',
        output: logs.length ? logs : ['Executed with no console output.'],
      }
    } catch (err) {
      return {
        type: 'console',
        srcDoc: '',
        output: [`Error: ${err.message}`],
      }
    }
  }

  const lines = []
  for (const rawLine of code.split('\n')) {
    const line = rawLine.trim()
    const pyMatch = line.match(/^print\((.*)\)$/)
    const javaMatch = line.match(/^System\.out\.println\((.*)\);?$/)
    const cMatch = line.match(/^printf\((.*)\);?$/)

    const matched = pyMatch || javaMatch || cMatch
    if (matched) {
      const cleaned = matched[1]
        .replace(/\\n/g, '')
        .replace(/^f?["']|["']$/g, '')
        .trim()
      lines.push(cleaned || ' ')
    }
  }

  if (!lines.length) {
    lines.push(`${language} snippet saved in editor. Full compiler/backend runner comes later.`)
  }

  return { type: 'console', srcDoc: '', output: lines }
}

export default function CodeEditor({
  initialLanguage = 'Python',
  isOpen = true,
  onClose,
}) {
  const [selectedLang, setSelectedLang] = useState(
    starterCode[initialLanguage] ? initialLanguage : 'Python'
  )
  const [codes, setCodes] = useState(() => ({ ...starterCode }))
  const [result, setResult] = useState(() =>
    executeSnippet(
      starterCode[initialLanguage] ? initialLanguage : 'Python',
      starterCode[starterCode[initialLanguage] ? initialLanguage : 'Python'],
      starterCode.HTML,
      starterCode.CSS
    )
  )

  useEffect(() => {
    if (!isOpen) return
    const nextLang = starterCode[initialLanguage] ? initialLanguage : 'Python'
    setSelectedLang(nextLang)
    setResult(executeSnippet(nextLang, codes[nextLang], codes.HTML, codes.CSS))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialLanguage])

  useEffect(() => {
    if (!isOpen || !onClose) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleLanguageSwitch(lang) {
    setSelectedLang(lang)
    setResult(executeSnippet(lang, codes[lang], codes.HTML, codes.CSS))
  }

  function handleRun() {
    setResult(executeSnippet(selectedLang, codes[selectedLang], codes.HTML, codes.CSS))
  }

  function handleReset() {
    const resetVal = starterCode[selectedLang]
    setCodes((prev) => ({ ...prev, [selectedLang]: resetVal }))
    setResult(executeSnippet(selectedLang, resetVal, codes.HTML, codes.CSS))
  }

  const editorBody = (
    <div
      className={onClose ? 'editor-modal-dialog' : 'container'}
      role={onClose ? 'dialog' : undefined}
      aria-modal={onClose ? 'true' : undefined}
      aria-label="Code Editor"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="section-head">
        <div>
          <span className="section-kicker">CODE EDITOR MODAL</span>
          <h2>Quick Scratchpad</h2>
        </div>

        <div className="editor-modal-controls">
          <div className="holomat-lang-tabs" role="tablist" aria-label="Editor Languages">
            {langList.map((lang) => (
              <button
                type="button"
                key={lang}
                role="tab"
                aria-selected={selectedLang === lang}
                className={`holo-tab ${selectedLang === lang ? 'active' : ''}`}
                onClick={() => handleLanguageSwitch(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          {onClose && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close code editor modal"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      <div className="holomat-workspace">
        <div className="editor-pane">
          <div className="pane-bar">
            <span>{selectedLang.toUpperCase()} BUFFER</span>
            <div className="pane-actions">
              <button type="button" className="mini-btn" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="mini-btn run" onClick={handleRun}>
                Run ▶
              </button>
            </div>
          </div>
          <textarea
            className="code-textarea"
            value={codes[selectedLang]}
            onChange={(e) =>
              setCodes((prev) => ({ ...prev, [selectedLang]: e.target.value }))
            }
            spellCheck={false}
            aria-label={`${selectedLang} scratchpad editor`}
          />
        </div>

        <div className="output-pane">
          <div className="pane-bar">
            <span>{result.type === 'preview' ? 'PREVIEW' : 'OUTPUT'}</span>
            <span>BASIC RUNNER</span>
          </div>

          {result.type === 'preview' ? (
            <iframe
              title="Scratchpad Live Preview"
              className="holo-preview-frame"
              srcDoc={result.srcDoc}
              sandbox="allow-scripts"
            />
          ) : (
            <div className="console-screen">
              {result.output.map((line, i) => (
                <div key={i} className="console-line">
                  <span className="prompt-char">&gt;</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!onClose) {
    return (
      <section className="section" id="code-editor">
        {editorBody}
      </section>
    )
  }

  return (
    <div
      className="editor-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      {editorBody}
    </div>
  )
}
