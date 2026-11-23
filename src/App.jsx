import { useEffect, useState } from 'react'
import logoImg from './favicon.png'
import './styles.css'

const languages = [
  { name: 'Python', symbol: 'Py', color: 'python', lessons: 12, progress: 68, topic: 'Loops & iteration', code: '01' },
  { name: 'Java', symbol: 'Jv', color: 'java', lessons: 10, progress: 34, topic: 'Classes & objects', code: '02' },
  { name: 'HTML', symbol: '5', color: 'html', lessons: 8, progress: 82, topic: 'Semantic structure', code: '03' },
  { name: 'CSS', symbol: '3', color: 'css', lessons: 9, progress: 51, topic: 'Flexbox layout', code: '04' },
  { name: 'JavaScript', symbol: 'JS', color: 'javascript', lessons: 14, progress: 23, topic: 'Functions & scope', code: '05' },
  { name: 'C', symbol: 'C', color: 'c', lessons: 11, progress: 12, topic: 'Variables & types', code: '06' },
]

const challenges = [
  { prompt: 'In Python, which keyword starts a function definition?', options: ['func', 'def', 'function', 'make'], answer: 'def', language: 'Python' },
  { prompt: 'Which HTML element is best for the main content of a page?', options: ['<section>', '<body>', '<main>', '<div>'], answer: '<main>', language: 'HTML' },
  { prompt: 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?', options: ['const', 'let', 'varies', 'static'], answer: 'let', language: 'JavaScript' },
  { prompt: 'In CSS Flexbox, which property aligns items along the main axis?', options: ['align-items', 'place-items', 'justify-content', 'flex-wrap'], answer: 'justify-content', language: 'CSS' },
  { prompt: 'In Java, which method is the usual program entry point?', options: ['start()', 'main()', 'run()', 'init()'], answer: 'main()', language: 'Java' },
  { prompt: 'Which symbol ends most statements in C?', options: [':', '.', ';', ','], answer: ';', language: 'C' },
]

const resources = [
  {
    type: 'COURSE',
    name: 'MIT OpenCourseWare',
    description: 'University-level computer science courses, freely shared.',
    meta: 'Free · Self-paced',
    url: 'https://ocw.mit.edu/search/?q=introduction%20programming',
    mark: 'MIT',
  },
  {
    type: 'VIDEO',
    name: 'Bro Code',
    description: 'Clear, hands-on programming tutorials for curious beginners.',
    meta: 'YouTube · Video lessons',
    url: 'https://www.youtube.com/@BroCodez',
    mark: '▶',
  },
  {
    type: 'PRACTICE',
    name: 'freeCodeCamp',
    description: 'Build projects and practice web development at your own pace.',
    meta: 'Free · Interactive',
    url: 'https://www.freecodecamp.org/learn/',
    mark: 'fCC',
  },
]

const ranks = [
  { name: 'E', min: 0, color: 'rank-e' },
  { name: 'D', min: 100, color: 'rank-d' },
  { name: 'C', min: 250, color: 'rank-c' },
  { name: 'B', min: 500, color: 'rank-b' },
  { name: 'A', min: 900, color: 'rank-a' },
  { name: 'S', min: 1500, color: 'rank-s' },
]

function getRank(points) {
  return [...ranks].reverse().find((rank) => points >= rank.min) || ranks[0]
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('leshdevs-theme') || 'light')
  const [activeLanguage, setActiveLanguage] = useState(() => localStorage.getItem('leshdevs-lang') || 'Python')
  const [points, setPoints] = useState(() => Number(localStorage.getItem('leshdevs-points')) || 420)
  const [solvedCount, setSolvedCount] = useState(() => Number(localStorage.getItem('leshdevs-solved')) || 0)
  const [attemptsCount, setAttemptsCount] = useState(() => Number(localStorage.getItem('leshdevs-attempts')) || 0)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [notice, setNotice] = useState('')
  const [hudOpen, setHudOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('leshdevs-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('leshdevs-lang', activeLanguage)
  }, [activeLanguage])

  const rank = getRank(points)
  const nextRank = ranks.find((item) => item.min > points)
  const progressToNext = nextRank
    ? Math.min(100, ((points - rank.min) / (nextRank.min - rank.min)) * 100)
    : 100
  const challenge = challenges[challengeIndex]
  const currentLanguage = languages.find((language) => language.name === activeLanguage) || languages[0]
  const accuracy = attemptsCount > 0 ? Math.round((solvedCount / attemptsCount) * 100) : 100

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  function submitAnswer() {
    if (!selectedAnswer || answered) return
    setAnswered(true)
    const nextAttempts = attemptsCount + 1
    setAttemptsCount(nextAttempts)
    localStorage.setItem('leshdevs-attempts', String(nextAttempts))

    if (selectedAnswer === challenge.answer) {
      const updatedPoints = points + 25
      const updatedSolved = solvedCount + 1
      setPoints(updatedPoints)
      setSolvedCount(updatedSolved)
      localStorage.setItem('leshdevs-points', String(updatedPoints))
      localStorage.setItem('leshdevs-solved', String(updatedSolved))
      setNotice('Correct! +25 points added to your rank score.')
    } else {
      setNotice(`Not quite — the answer is ${challenge.answer}. Keep going!`)
    }
  }

  function nextChallenge() {
    setChallengeIndex((index) => (index + 1) % challenges.length)
    setSelectedAnswer('')
    setAnswered(false)
    setNotice('')
  }

  function startChallenge(language) {
    const index = challenges.findIndex((item) => item.language === language)
    if (index >= 0) setChallengeIndex(index)
    setSelectedAnswer('')
    setAnswered(false)
    setNotice('')
    document.querySelector('#arena')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSelectLanguage(name) {
    setActiveLanguage(name)
    const index = challenges.findIndex((item) => item.language === name)
    if (index >= 0) {
      setChallengeIndex(index)
      setSelectedAnswer('')
      setAnswered(false)
      setNotice('')
    }
  }

  function resetTelemetry() {
    setPoints(420)
    setSolvedCount(0)
    setAttemptsCount(0)
    localStorage.setItem('leshdevs-points', '420')
    localStorage.setItem('leshdevs-solved', '0')
    localStorage.setItem('leshdevs-attempts', '0')
    setNotice('Telemetry reset to baseline (420 pts).')
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="LeshDevs home">
          <img className="brand-logo" src={logoImg} alt="LeshDevs shield emblem" />
          <span>
            lesh<span className="brand-light">devs</span>
          </span>
        </a>

        <div className="side-label">
          <span>LEARNING SPACE</span>
          <span className="mono-tag">{theme === 'dark' ? 'BRUTAL.SYS' : 'UI.LIGHT'}</span>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#home">
            <span>⌂</span> Overview
          </a>
          <a className="nav-link" href="#languages">
            <span>▦</span> My languages
          </a>
          <a className="nav-link" href="#arena">
            <span>⚡</span> Challenge arena
          </a>
          <a className="nav-link" href="#source-wall">
            <span>↗</span> Source wall
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="streak-card">
            <span className="streak-icon">✦</span>
            <div>
              <strong>Keep showing up</strong>
              <small>Active loadout: {currentLanguage.name}</small>
            </div>
          </div>

          {/* Bat-Tech Operative HUD Module */}
          <div className="bat-hud">
            <button
              type="button"
              className="bat-hud-trigger"
              onClick={() => setHudOpen((open) => !open)}
              aria-expanded={hudOpen}
            >
              <img className="hud-emblem" src={logoImg} alt="" />
              <div className="hud-meta">
                <span className="hud-callsign">BAT-HUD // OP-01</span>
                <strong>RANK {rank.name} · {points} PTS</strong>
              </div>
              <span className="hud-toggle-icon">{hudOpen ? '−' : '+'}</span>
            </button>

            {hudOpen && (
              <div className="bat-hud-drawer">
                <div className="hud-row">
                  <span>ACCURACY</span>
                  <strong>{accuracy}% ({solvedCount}/{attemptsCount})</strong>
                </div>
                <div className="hud-row">
                  <span>SYNC MODE</span>
                  <strong>LOCAL // MERN-READY</strong>
                </div>
                <div className="hud-actions">
                  <button type="button" className="hud-btn" onClick={toggleTheme}>
                    {theme === 'light' ? 'Activate Cyber-Brutal' : 'Switch to Light Mode'}
                  </button>
                  <button type="button" className="hud-btn ghost" onClick={resetTelemetry}>
                    Reset XP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview <span>/</span> {currentLanguage.name}
          </div>
          <div className="topbar-right">
            <button
              type="button"
              className="theme-switch"
              onClick={toggleTheme}
              aria-label="Toggle dark and light mode"
            >
              <span className="online-dot" />
              <span>{theme === 'light' ? 'CYBER BRUTALISM MODE' : 'LIGHT MODE'}</span>
            </button>
            <div className="top-hud-pill" title="Operative Rank & Loadout">
              <img src={logoImg} alt="Operative emblem" />
              <span>OP-01 · {rank.name}</span>
            </div>
          </div>
        </header>

        <section className="welcome-row">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> YOUR NEXT CHAPTER STARTS HERE
            </p>
            <h1>
              Build your coding
              <br />
              foundation<span className="accent-dot">.</span>
            </h1>
            <p className="welcome-copy">
              Learn the fundamentals, take on challenges, and earn your place on the board.
            </p>
            <a className="button button-dark" href="#languages">
              Pick up where you left off <span>↗</span>
            </a>
          </div>

          <div className="welcome-art" aria-label="Code your own way illustration">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-sticker sticker-code">{'</>'}</div>
            <div className="art-sticker sticker-star">✳</div>
            <div className="art-sticker sticker-spark">✦</div>
            <div className="art-window">
              <div className="window-top">
                <i />
                <i />
                <i />
                <span>your_next_idea.py</span>
              </div>
              <div className="code-lines">
                <span>
                  <b>01</b>
                  <em>print</em>(<strong>&quot;hello, future&quot;</strong>)
                </span>
                <span>
                  <b>02</b>
                </span>
                <span>
                  <b>03</b>
                  <em>while</em> <strong>learning:</strong>
                </span>
                <span>
                  <b>04</b>&nbsp;&nbsp; build(<strong>something_new</strong>)
                </span>
                <span>
                  <b>05</b>&nbsp;&nbsp; repeat(∞)
                </span>
              </div>
              <div className="code-cursor" />
            </div>
            <div className="art-caption">IDEAS → REALITY</div>
          </div>
        </section>

        <section className="stats-row" aria-label="Your learning stats">
          <article className="stat-card points-stat">
            <div className="stat-icon yellow">✦</div>
            <div>
              <span className="stat-label">[01] TOTAL POINTS</span>
              <strong>{points.toLocaleString()}</strong>
              <small>Earn points as you learn</small>
            </div>
            <span className="stat-arrow">↗</span>
          </article>

          <article className="stat-card">
            <div className={`rank-badge ${rank.color}`}>{rank.name}</div>
            <div>
              <span className="stat-label">[02] CURRENT RANK</span>
              <strong>Rank {rank.name}</strong>
              <small>
                {nextRank ? `${nextRank.min - points} points to Rank ${nextRank.name}` : 'Top rank unlocked!'}
              </small>
            </div>
            <span className="rank-system">S · A · B · C · D · E</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon mint">◷</div>
            <div>
              <span className="stat-label">[03] LEARNING STREAK</span>
              <strong>3 days</strong>
              <small>Consistency looks good on you</small>
            </div>
            <span className="stat-arrow">↗</span>
          </article>
        </section>

        <section className="rank-progress">
          <div className="progress-heading">
            <div>
              <strong>Your rank journey</strong>
              <span>Points turn practice into progress.</span>
            </div>
            <span className="progress-numbers">
              {points} <i>/</i> {nextRank ? nextRank.min : points} pts
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progressToNext}%` }} />
          </div>
          <div className="rank-steps">
            {ranks.map((item) => (
              <span className={points >= item.min ? 'rank-step reached' : 'rank-step'} key={item.name}>
                <i className={item.color}>{item.name}</i>
                <small>{item.min}</small>
              </span>
            ))}
          </div>
        </section>

        <section className="section-block" id="languages">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR TOOLKIT</p>
              <h2>
                Choose a language<span className="accent-dot">.</span>
              </h2>
              <p className="section-subtitle">Strong foundations start with one small step.</p>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => startChallenge(currentLanguage.name)}
            >
              Practice {currentLanguage.name} <span>↗</span>
            </button>
          </div>

          <div className="language-grid">
            {languages.map((language) => (
              <button
                type="button"
                key={language.name}
                className={`language-card ${activeLanguage === language.name ? 'language-active' : ''}`}
                onClick={() => handleSelectLanguage(language.name)}
                aria-pressed={activeLanguage === language.name}
              >
                <div className="language-card-top">
                  <span className={`language-icon ${language.color}`}>{language.symbol}</span>
                  <span className="card-menu">/{language.code}</span>
                </div>
                <strong>{language.name}</strong>
                <span className="language-topic">Next up · {language.topic}</span>
                <div className="language-progress">
                  <span style={{ width: `${language.progress}%` }} />
                </div>
                <div className="language-meta">
                  <span>{language.progress}% complete</span>
                  <span>{language.lessons} lessons</span>
                </div>
              </button>
            ))}
          </div>
          <p className="coming-soon">
            <span>＋</span> More languages are on the way. Start with the fundamentals, then grow your toolkit.
          </p>
        </section>

        <section className="arena-section" id="arena">
          <div className="arena-intro">
            <p className="eyebrow">LEARN IT. PROVE IT.</p>
            <h2>
              Challenge arena<span className="accent-dot">.</span>
            </h2>
            <p>
              Quick-fire questions earn you points. Every correct answer gets you closer to the next rank.
            </p>
            <div className="arena-tags">
              <span>⚡ +25 points</span>
              <span>◷ Just a minute</span>
            </div>
          </div>

          <div className="challenge-card">
            <div className="challenge-top">
              <span className="live-pill">
                <i /> QUICK CHALLENGE
              </span>
              <span className="challenge-language">{challenge.language} · Foundations</span>
            </div>
            <h3>{challenge.prompt}</h3>
            <div className="answer-list">
              {challenge.options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`answer-option ${selectedAnswer === option ? 'answer-selected' : ''} ${
                    answered && option === challenge.answer ? 'answer-correct' : ''
                  } ${
                    answered && selectedAnswer === option && option !== challenge.answer ? 'answer-wrong' : ''
                  }`}
                  onClick={() => !answered && setSelectedAnswer(option)}
                  disabled={answered}
                >
                  <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                  {option}
                  <span className="answer-check">{answered && option === challenge.answer ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            <div className="challenge-footer">
              <span
                className={notice.startsWith('Correct') ? 'notice success' : 'notice'}
                aria-live="polite"
              >
                {notice || 'Choose your answer to play'}
              </span>
              {answered ? (
                <button type="button" className="button button-dark" onClick={nextChallenge}>
                  Next question <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-dark"
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                >
                  Lock it in <span>→</span>
                </button>
              )}
            </div>
            <div className="challenge-switch">
              <span>Want a different language?</span>
              <button
                type="button"
                onClick={() =>
                  startChallenge(currentLanguage?.name === challenge.language ? 'HTML' : currentLanguage?.name)
                }
              >
                {currentLanguage?.name === challenge.language
                  ? 'Try HTML'
                  : `Try ${currentLanguage?.name}`}{' '}
                ↗
              </button>
            </div>
          </div>
        </section>

        {/* DC Comics Source Wall Styled Section */}
        <section className="source-section source-wall-cosmic" id="source-wall">
          <div className="source-wall-beams" aria-hidden="true" />
          <div className="section-heading source-heading">
            <div>
              <p className="eyebrow source-eyebrow">EDGE OF THE KNOWN CURRICULUM</p>
              <h2>
                The Source Wall<span className="source-spark">.</span>
              </h2>
              <p className="section-subtitle">
                Ancient archives &amp; cosmic relays beyond the core syllabus.
              </p>
            </div>
            <span className="source-note">SOURCE RELAYS · OPENS IN NEW TAB</span>
          </div>

          <div className="resource-grid">
            {resources.map((resource) => (
              <a
                className="resource-card monolith-card"
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                key={resource.name}
              >
                <div className="resource-top">
                  <span className="resource-mark">{resource.mark}</span>
                  <span className="resource-type">{resource.type}</span>
                  <span className="resource-arrow">↗</span>
                </div>
                <h3>{resource.name}</h3>
                <p>{resource.description}</p>
                <div className="resource-meta">
                  {resource.meta}
                  <span>↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <footer className="footer">
          <a className="brand footer-brand" href="#home">
            <img className="brand-logo" src={logoImg} alt="LeshDevs shield emblem" />
            <span>
              lesh<span className="brand-light">devs</span>
            </span>
          </a>
          <span>Learn the basics. Build what’s next.</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </main>
    </div>
  )
}
