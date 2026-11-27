import { useEffect, useState } from 'react'
import './styles.css'
import pythonLogo from './python.svg'
import javaLogo from './java-4-logo.svg'
import htmlLogo from './HTML.webp'
import cssLogo from './CSS.webp'
import jsLogo from './javascript.webp'
import cLogo from './C.png'
import CodeEditor from './components/CodeEditor'
import LessonsPage from './pages/LessonsPage'

const languages = [
  {
    name: 'Python',
    symbol: 'Py',
    logoSrc: pythonLogo,
    lessons: 12,
    statusLabel: 'Active B1 Pilot',
    topic: 'History, syntax & AI/ML',
    code: '01',
    tag: 'Scripting & AI',
  },
  {
    name: 'Java',
    symbol: 'Jv',
    logoSrc: javaLogo,
    lessons: 10,
    statusLabel: 'Track Planned',
    topic: 'Classes & objects',
    code: '02',
    tag: 'Enterprise OOP',
  },
  {
    name: 'HTML',
    symbol: '5',
    logoSrc: htmlLogo,
    lessons: 8,
    statusLabel: 'Track Planned',
    topic: 'Semantic structure',
    code: '03',
    tag: 'Web Architecture',
  },
  {
    name: 'CSS',
    symbol: '3',
    logoSrc: cssLogo,
    lessons: 9,
    statusLabel: 'Track Planned',
    topic: 'Flexbox & Grid',
    code: '04',
    tag: 'Responsive UI',
  },
  {
    name: 'JavaScript',
    symbol: 'JS',
    logoSrc: jsLogo,
    lessons: 14,
    statusLabel: 'Track Planned',
    topic: 'Functions & scope',
    code: '05',
    tag: 'Full-Stack Logic',
  },
  {
    name: 'C',
    symbol: 'C',
    logoSrc: cLogo,
    lessons: 11,
    statusLabel: 'Track Planned',
    topic: 'Memory & pointers',
    code: '06',
    tag: 'Systems Core',
  },
]

const challenges = [
  {
    prompt: 'In Python, which keyword starts a function definition?',
    options: ['func', 'def', 'function', 'make'],
    answer: 'def',
    language: 'Python',
  },
  {
    prompt: 'Which HTML element is best for the main content of a page?',
    options: ['<section>', '<body>', '<main>', '<div>'],
    answer: '<main>',
    language: 'HTML',
  },
  {
    prompt: 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?',
    options: ['const', 'let', 'varies', 'static'],
    answer: 'let',
    language: 'JavaScript',
  },
  {
    prompt: 'In CSS Flexbox, which property aligns items along the main axis?',
    options: ['align-items', 'place-items', 'justify-content', 'flex-wrap'],
    answer: 'justify-content',
    language: 'CSS',
  },
  {
    prompt: 'In Java, which method is the usual program entry point?',
    options: ['start()', 'main()', 'run()', 'init()'],
    answer: 'main()',
    language: 'Java',
  },
  {
    prompt: 'Which symbol ends most statements in C?',
    options: [':', '.', ';', ','],
    answer: ';',
    language: 'C',
  },
]

const resources = [
  {
    type: 'COURSE',
    name: 'MIT OpenCourseWare',
    description: 'University-level computer science lectures and problem sets, freely shared.',
    meta: 'Free · Self-paced',
    url: 'https://ocw.mit.edu/search/?q=introduction%20programming',
    mark: 'MIT',
  },
  {
    type: 'VIDEO',
    name: 'Bro Code',
    description: 'Clear, zero-fluff programming tutorials built for hands-on learners.',
    meta: 'YouTube · Video tracks',
    url: 'https://www.youtube.com/@BroCodez',
    mark: '▶',
  },
  {
    type: 'PRACTICE',
    name: 'freeCodeCamp',
    description: 'Interactive coding sandboxes and certification projects at your own pace.',
    meta: 'Free · Interactive',
    url: 'https://www.freecodecamp.org/learn/',
    mark: 'fCC',
  },
]

function BrandShield() {
  return (
    <span className="shield-emblem duo-float" aria-hidden="true">
      <svg viewBox="0 0 48 54" width="28" height="32">
        <path
          d="M24 2 L45 9 L39 38 L24 52 L9 38 L3 9 Z"
          fill="#020C33"
          stroke="#ffffff"
          strokeWidth="2.2"
        />
        <path
          d="M11 33 L18 21 L23 29 L30 14 L38 33"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M8 34 Q24 31 40 34 L39 39 Q24 36 9 39 Z" fill="#ffffff" />
      </svg>
    </span>
  )
}

function LanguageLogoSlot({ language }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [language.logoSrc])

  return (
    <div className="lang-logo-slot" aria-hidden="true">
      {!imgError && language.logoSrc ? (
        <img
          src={language.logoSrc}
          alt={`${language.name} logo`}
          className="lang-logo-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="lang-badge">{language.symbol}</span>
      )}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home') // 'home' | 'lessons'
  const [theme, setTheme] = useState(() => localStorage.getItem('leshdevs-theme') || 'light')
  const [activeLanguage, setActiveLanguage] = useState(
    () => localStorage.getItem('leshdevs-lang') || 'Python'
  )
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null)
  const [notice, setNotice] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorSnippet, setEditorSnippet] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('leshdevs-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('leshdevs-lang', activeLanguage)
  }, [activeLanguage])

  const challenge = challenges[challengeIndex]
  const currentLanguage =
    languages.find((language) => language.name === activeLanguage) || languages[0]

  function resetChallengeFeedback() {
    setSelectedAnswer('')
    setAnswered(false)
    setIsAnswerCorrect(null)
    setNotice('')
  }

  function navigateToPage(targetPage, selector = '') {
    setPage(targetPage)
    requestAnimationFrame(() => {
      if (selector) {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  function toggleDarkMode() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function submitAnswer() {
    if (!selectedAnswer || answered) return
    setAnswered(true)
    if (selectedAnswer === challenge.answer) {
      setIsAnswerCorrect(true)
      setNotice('Awesome! Correct answer.')
    } else {
      setIsAnswerCorrect(false)
      setNotice(`Not quite! Correct answer: ${challenge.answer}`)
    }
  }

  function nextChallenge() {
    setChallengeIndex((index) => (index + 1) % challenges.length)
    resetChallengeFeedback()
  }

  function startChallenge(language) {
    const index = challenges.findIndex((item) => item.language === language)
    if (index >= 0) setChallengeIndex(index)
    resetChallengeFeedback()
    navigateToPage('home', '#arena')
  }

  function handleSelectLanguage(name) {
    setActiveLanguage(name)
    const index = challenges.findIndex((item) => item.language === name)
    if (index >= 0) {
      setChallengeIndex(index)
      resetChallengeFeedback()
    }
    if (name === 'Python') {
      navigateToPage('lessons')
    }
  }

  function handleOpenEditorFromLesson(language, snippet) {
    if (language) setActiveLanguage(language)
    if (typeof snippet === 'string') setEditorSnippet(snippet)
    setIsEditorOpen(true)
  }

  return (
    <div className="site-shell" data-theme={theme}>
      <header className="navbar">
        <div className="nav-inner">
          <a
            className="brand"
            href="#top"
            aria-label="LeshDevs Home"
            onClick={(e) => {
              e.preventDefault()
              navigateToPage('home')
            }}
          >
            <BrandShield />
            <span>
              lesh<span className="brand-thin">devs</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary Navigation">
            <a
              href="#lessons"
              onClick={(e) => {
                e.preventDefault()
                navigateToPage('lessons')
              }}
            >
              Lessons
            </a>
            <a
              href="#languages"
              onClick={(e) => {
                e.preventDefault()
                navigateToPage('home', '#languages')
              }}
            >
              Curriculum
            </a>
            <a
              href="#arena"
              onClick={(e) => {
                e.preventDefault()
                navigateToPage('home', '#arena')
              }}
            >
              Challenge Arena
            </a>
            <a
              href="#source-wall"
              onClick={(e) => {
                e.preventDefault()
                navigateToPage('home', '#source-wall')
              }}
            >
              The Source Wall
            </a>
            <a
              href="#code-editor"
              onClick={(e) => {
                e.preventDefault()
                setIsEditorOpen(true)
              }}
            >
              Code Editor
            </a>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-btn duo-3d"
              onClick={toggleDarkMode}
              aria-pressed={theme === 'dark'}
            >
              <span>{theme === 'dark' ? '☀' : '☾'}</span>
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              type="button"
              className="nav-cta duo-3d"
              onClick={() => navigateToPage('lessons')}
            >
              Open Lessons
            </button>
          </div>
        </div>
      </header>

      {page === 'lessons' ? (
        <LessonsPage
          activeLanguage={activeLanguage}
          onSelectLanguage={setActiveLanguage}
          onBackHome={() => navigateToPage('home')}
          onOpenEditor={handleOpenEditorFromLesson}
        />
      ) : (
        <main id="top" className="duo-pop">
          <section className="hero-section">
            <div className="container hero-grid">
              <div className="hero-copy">
                <div className="hero-badge duo-bounce">
                  <span className="pulse-dot" />
                  <span>FOUNDATIONS FIRST · 6 CORE LANGUAGES</span>
                </div>
                <h1>
                  Master the core of software engineering<span className="dot">.</span>
                </h1>
                <p className="hero-subtitle">
                  LeshDevs takes students from their first line of syntax to confident problem-solving
                  across Python, Java, HTML, CSS, JavaScript, and C.
                </p>
                <div className="hero-cta-row">
                  <button
                    type="button"
                    className="btn btn-primary duo-3d"
                    onClick={() => navigateToPage('lessons')}
                  >
                    Start Python Lessons <span>→</span>
                  </button>
                  <a className="btn btn-outline duo-3d" href="#arena">
                    Try Live Challenge
                  </a>
                </div>

                <div className="hero-metrics">
                  <div className="duo-stat-tile">
                    <strong>6</strong>
                    <span>Core Languages</span>
                  </div>
                  <div className="duo-stat-tile">
                    <strong>B1</strong>
                    <span>Clear English Lessons</span>
                  </div>
                  <div className="duo-stat-tile">
                    <strong>Live</strong>
                    <span>Code Editor &amp; Checks</span>
                  </div>
                </div>
              </div>

              <div className="hero-code-card duo-card" aria-label="Interactive code preview">
                <div className="code-header">
                  <div className="code-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="code-filename">foundation_core.py</span>
                  <span className="code-lang-tag">{currentLanguage.name}</span>
                </div>
                <pre className="code-body">
                  <code>
                    <span className="ln">01</span> <span className="kw">def</span>{' '}
                    <span className="fn">build_foundation</span>(student):
                    {'\n'}
                    <span className="ln">02</span>     stack = [<span className="str">&quot;Python&quot;</span>,{' '}
                    <span className="str">&quot;Java&quot;</span>, <span className="str">&quot;JS&quot;</span>,{' '}
                    <span className="str">&quot;C&quot;</span>]
                    {'\n'}
                    <span className="ln">03</span>     <span className="kw">for</span> lang{' '}
                    <span className="kw">in</span> stack:
                    {'\n'}
                    <span className="ln">04</span>         student.master(lang)
                    {'\n'}
                    <span className="ln">05</span>     <span className="kw">return</span>{' '}
                    <span className="str">&quot;Ready to ship.&quot;</span>
                  </code>
                </pre>
                <div className="code-footer">
                  <span>TRACK: {currentLanguage.name.toUpperCase()}</span>
                  <span>{currentLanguage.statusLabel.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="languages">
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-kicker">CURRICULUM TRACKS</span>
                  <h2>Six foundational languages. Zero fluff.</h2>
                </div>
                <button
                  type="button"
                  className="btn btn-outline duo-3d"
                  onClick={() => startChallenge(currentLanguage.name)}
                >
                  Practice {currentLanguage.name} →
                </button>
              </div>

              <div className="lang-grid">
                {languages.map((lang) => (
                  <button
                    type="button"
                    key={lang.name}
                    className={`lang-card duo-card duo-3d ${
                      activeLanguage === lang.name ? 'selected' : ''
                    }`}
                    onClick={() => handleSelectLanguage(lang.name)}
                    aria-pressed={activeLanguage === lang.name}
                  >
                    <div className="lang-card-top">
                      <LanguageLogoSlot language={lang} />
                      <span className="lang-tag">{lang.tag}</span>
                    </div>
                    <h3>{lang.name}</h3>
                    <p className="lang-topic">Focus: {lang.topic}</p>
                    <div className="lang-meta">
                      <span>{lang.statusLabel}</span>
                      <span>{lang.lessons} planned lessons</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="section arena-band" id="arena">
            <div className="container arena-grid">
              <div className="arena-copy">
                <span className="section-kicker">INTERACTIVE SANDBOX</span>
                <h2>Prove what you know in the Challenge Arena.</h2>
                <p>
                  Test your instincts with quick concept checks across all six languages—no sign-in
                  required.
                </p>
                <div className="arena-pills">
                  <span>✓ NO SIGN-IN NEEDED</span>
                  <span>◷ INSTANT FEEDBACK</span>
                </div>
              </div>

              <div className="challenge-box duo-card">
                <div className="challenge-head">
                  <span className="challenge-badge">LIVE CHECK · {challenge.language.toUpperCase()}</span>
                  <span className="challenge-step">
                    Q{challengeIndex + 1} / {challenges.length}
                  </span>
                </div>
                <h3>{challenge.prompt}</h3>

                <div className="options-grid">
                  {challenge.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option
                    const isRightOption = answered && option === challenge.answer
                    const isWrongPick = answered && isSelected && option !== challenge.answer

                    return (
                      <button
                        type="button"
                        key={option}
                        className={`option-btn duo-3d ${isSelected ? 'is-selected' : ''} ${
                          isRightOption ? 'is-correct' : ''
                        } ${isWrongPick ? 'is-wrong' : ''}`}
                        onClick={() => !answered && setSelectedAnswer(option)}
                        disabled={answered}
                      >
                        <span className="opt-key">{String.fromCharCode(65 + idx)}</span>
                        <span className="opt-val">{option}</span>
                        {isRightOption && <span className="opt-feedback-tag">✓</span>}
                        {isWrongPick && <span className="opt-feedback-tag">✕</span>}
                      </button>
                    )
                  })}
                </div>

                <div
                  className={`challenge-actions duo-tray ${
                    answered
                      ? isAnswerCorrect
                        ? 'is-tray-correct'
                        : 'is-tray-wrong'
                      : ''
                  }`}
                >
                  <span className="challenge-notice" aria-live="polite">
                    {notice || 'Select an option to check your answer'}
                  </span>
                  {answered ? (
                    <button
                      type="button"
                      className="btn btn-primary duo-3d"
                      onClick={nextChallenge}
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary duo-3d"
                      onClick={submitAnswer}
                      disabled={!selectedAnswer}
                    >
                      Check Answer →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="section source-wall-section" id="source-wall">
            <div className="container">
              <div className="section-head light-head">
                <div>
                  <span className="section-kicker">CURATED EXTERNAL ARCHIVES</span>
                  <h2>The Source Wall</h2>
                  <p className="source-sub">
                    Hand-picked university lectures, video tracks, and interactive labs beyond the core
                    syllabus.
                  </p>
                </div>
                <span className="mono-label">VERIFIED RELAYS ↗</span>
              </div>

              <div className="source-grid">
                {resources.map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="source-card duo-card duo-3d"
                  >
                    <div className="source-card-top">
                      <span className="source-mark">{res.mark}</span>
                      <span className="source-type">{res.type}</span>
                    </div>
                    <h3>{res.name}</h3>
                    <p>{res.description}</p>
                    <div className="source-card-foot">
                      <span>{res.meta}</span>
                      <span>Visit ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <div className="container footer-inner">
          <a
            className="brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              navigateToPage('home')
            }}
          >
            <BrandShield />
            <span>
              lesh<span className="brand-thin">devs</span>
            </span>
          </a>
          <p>Foundations of programming — Python, Java, HTML, CSS, JavaScript &amp; C.</p>
          <button
            type="button"
            className="back-top duo-3d"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile Quick Navigation">
        <button
          type="button"
          className={page === 'home' ? 'active' : ''}
          onClick={() => navigateToPage('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={page === 'lessons' ? 'active' : ''}
          onClick={() => navigateToPage('lessons')}
        >
          Lessons
        </button>
        <button type="button" onClick={() => setIsEditorOpen(true)}>
          Editor
        </button>
      </nav>

      <CodeEditor
        initialLanguage={activeLanguage}
        initialCode={editorSnippet}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  )
}
