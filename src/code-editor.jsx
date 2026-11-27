import { useEffect, useState } from 'react'

const STARTER_TEMPLATES = {
  Python: `# LeshDevs Python Playground\ncreator = "Guido van Rossum"\nmain_use = "AI and Machine Learning"\n\nprint("Created by:", creator)\nprint("Popular today for:", main_use)`,
  JavaScript: `// LeshDevs JavaScript Playground\nconst track = "Full-Stack Logic";\nconst lessons = 14;\n\nconsole.log("Track:", track, "Lessons:", lessons);`,
  HTML: `<!-- LeshDevs HTML Playground -->\n<main class="card">\n  <h1>LeshDevs Foundations</h1>\n  <p>Clear B1 programming lessons.</p>\n</main>`,
  CSS: `/* LeshDevs CSS Playground */\n.card {\n  display: grid;\n  gap: 12px;\n  padding: 20px;\n  border-radius: 14px;\n}`,
  Java: `// LeshDevs Java Playground\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("LeshDevs Java Ready");\n  }\n}`,
  C: `// LeshDevs C Playground\n#include <stdio.h>\n\nint main(void) {\n  printf("LeshDevs C Ready\\n");\n  return 0;\n}`,
}

const LANGUAGES = ['Python', 'JavaScript', 'HTML', 'CSS', 'Java', 'C']

function simulateExecution(language, sourceCode) {
  const trimmed = sourceCode.trim()
  if (!trimmed) {
    return 'Empty buffer — write some code first, then hit Run Code.'
  }

  if (language === 'Python') {
    const lines = []
    const printMatches = [...trimmed.matchAll(/print\((.+)\)/g)]
    for (const match of printMatches) {
      const inner = match[1].trim()
      const clean = inner
        .split(',')
        .map((part) => part.trim().replace(/^["']|["']$/g, ''))
        .join(' ')
      lines.push(clean)
    }
    if (lines.length > 0) {
      return lines.join('\n')
    }
    return `Ran Python code (${trimmed.split('\n').length} lines). Use print(...) to see values.`
  }

  if (language === 'JavaScript') {
    const logMatches = [...trimmed.matchAll(/console\.log\((.+)\)/g)]
    if (logMatches.length > 0) {
      return logMatches
        .map((m) => m[1].trim().replace(/^[`"'"]|[`"']$/g, ''))
        .join('\n')
    }
    return `Ran JavaScript code (${trimmed.split('\n').length} lines).`
  }

  return `[${language}] Checked ${trimmed.split('\n').length} lines of code.`
}

export default function CodeEditor({
  isOpen,
  onClose,
  initialLanguage = 'Python',
  initialCode = '',
}) {
  const [language, setLanguage] = useState(initialLanguage || 'Python')
  const [code, setCode] = useState(
    initialCode || STARTER_TEMPLATES[initialLanguage || 'Python'] || STARTER_TEMPLATES.Python
  )
  const [output, setOutput] = useState('Click "Run Code" to see output here.')

  useEffect(() => {
    const nextLang = LANGUAGES.includes(initialLanguage) ? initialLanguage : 'Python'
    setLanguage(nextLang)
    setCode(initialCode || STARTER_TEMPLATES[nextLang] || STARTER_TEMPLATES.Python)
    setOutput('Click "Run Code" to see output here.')
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
    setLanguage(nextLang)
    setCode(STARTER_TEMPLATES[nextLang] || '')
    setOutput('Switched language template. Click "Run Code" to test.')
  }

  function handleReset() {
    setCode(initialCode || STARTER_TEMPLATES[language] || '')
    setOutput('Reset to starter snippet.')
  }

  function handleRun() {
    setOutput(simulateExecution(language, code))
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
          <span className="editor-modal-title">leshdevs_playground</span>

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
            <span>TERMINAL OUTPUT · {language.toUpperCase()}</span>
            <div className="pane-actions">
              <button type="button" className="btn btn-outline duo-3d" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="btn btn-primary duo-3d" onClick={handleRun}>
                Run Code ▶
              </button>
            </div>
          </div>
          <pre className="editor-console-body">{output}</pre>
        </div>
      </div>
    </div>
  )
}
