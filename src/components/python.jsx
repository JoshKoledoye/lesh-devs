
import { useState } from 'react'
import CodeBlock from './CodeBlock'

const PYTHON_LEVELS = [
  {
    id: 1,
    levelTag: 'LEVEL 01',
    title: 'History, Early Uses & Why Python Leads in AI/ML',
    summary:
      'Created by Guido van Rossum in 1989–1991, Python started as a readable scripting tool and grew into a top language for web apps, data, and AI/Machine Learning.',
    sections: [
      {
        heading: 'Guido van Rossum & Python’s Start',
        body: 'Dutch programmer Guido van Rossum began building Python in December 1989 and released the first public version in February 1991. He named it after Monty Python—not the snake—and focused on clean, easy-to-read code.',
      },
      {
        heading: 'Early Uses vs. Today',
        body: 'At first, Python was mostly used to automate daily tasks, glue scripts together, and write clear helper programs. Today, it powers web backends, data analysis, automation, and AI/ML systems.',
      },
      {
        heading: 'Why Python Is Huge in AI & Machine Learning',
        body: 'AI and ML need lots of fast experiments and heavy math. Python lets developers test ideas quickly, use libraries like NumPy, Pandas, scikit-learn, PyTorch, and TensorFlow, and rely on fast C/C++ code working behind the scenes.',
      },
    ],
    checkpoints: [
      'Guido van Rossum created Python and released it publicly in 1991 with readability in mind.',
      'Python began mainly as a scripting and automation tool before expanding into full software and data work.',
      'In AI and ML, Python shines because you can test models fast, use rich libraries, and run heavy math efficiently underneath.',
    ],
    code: `# Level 01: Your first Python check-in\ncreator = "Guido van Rossum"\nmain_use = "AI and Machine Learning"\n\nprint("Created by:", creator)\nprint("Popular today for:", main_use)`,
    tryTask: 'Change main_use to another area you like (such as "Web APIs") and run it in the Code Editor.',
    question: {
      prompt: 'Why is Python so widely used in Artificial Intelligence (AI) and Machine Learning (ML)?',
      options: [
        'It only runs without any external libraries',
        'It allows fast experimentation and has strong AI/ML libraries backed by fast underlying code',
        'It replaced HTML and CSS inside web browsers',
        'It was created specifically to replace C++ in hardware chips',
      ],
      answer:
        'It allows fast experimentation and has strong AI/ML libraries backed by fast underlying code',
    },
  },
  {
    id: 2,
    levelTag: 'LEVEL 02',
    title: 'Variables & Basic Data Types',
    summary:
      'A variable stores a value under a name using =. Common types are strings (str), integers (int), floats (float), and booleans (bool).',
    sections: [
      {
        heading: 'Storing Values in Variables',
        body: 'Think of a variable as a labeled box in memory. You assign a value using =, such as course_name = "Python Basics".',
      },
      {
        heading: 'Core Data Types',
        body: 'Strings (str) hold text in quotes, integers (int) hold whole numbers, floats (float) hold decimal numbers, and booleans (bool) hold True or False.',
      },
    ],
    checkpoints: [
      'Use = to store a value inside a variable name.',
      'Strings hold text in quotes; ints hold whole numbers without decimals.',
      'Booleans hold True or False values.',
    ],
    code: `course_name = "Python Basics"\nlessons_count = 12\nis_free = True\n\nprint(course_name)\nprint(lessons_count)`,
    tryTask: 'Create a variable called my_goal with a short text value and print it.',
    question: {
      prompt: 'What data type is the value 25 in Python?',
      options: ['str', 'int', 'bool', 'list'],
      answer: 'int',
    },
  },
  {
    id: 3,
    levelTag: 'LEVEL 03',
    title: 'Making Decisions (if, elif, else)',
    summary:
      'Programs use if, elif, and else to pick different paths based on a condition. Indentation (spaces) groups code inside each block.',
    sections: [
      {
        heading: 'Branching Logic',
        body: 'Use if for the first check, elif for extra conditions, and else as the fallback when earlier checks are False.',
      },
      {
        heading: 'Indentation Matters',
        body: 'Python uses spaces at the start of a line to group statements inside if, elif, and else blocks.',
      },
    ],
    checkpoints: [
      'if runs when its condition is True.',
      'elif checks another condition if earlier checks were False.',
      'Indent code inside a block consistently so Python knows what belongs to it.',
    ],
    code: `score = 75\n\nif score >= 70:\n    print("Great job! You passed.")\nelif score >= 50:\n    print("Good start. Keep practicing.")\nelse:\n    print("Try again. You will get it.")`,
    tryTask: 'Change score to 45 and trace which message gets printed.',
    question: {
      prompt: 'What does Python use to group statements inside an if block?',
      options: ['Curly braces {}', 'Semicolons ;', 'Indentation (spaces)', 'Parentheses ()'],
      answer: 'Indentation (spaces)',
    },
  },
]

export default function PythonTrack({ onOpenEditor, onCompleteLevel }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [highestUnlocked, setHighestUnlocked] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isPassed, setIsPassed] = useState(false)

  const level = PYTHON_LEVELS[currentIdx]
  const isNextUnlocked = isPassed || currentIdx < highestUnlocked

  function handleSelectLevel(idx) {
    if (idx > highestUnlocked) {
      setStatusMessage(
        `Pass Level ${PYTHON_LEVELS[idx - 1].id} first to unlock Level ${PYTHON_LEVELS[idx].id}.`
      )
      return
    }
    setCurrentIdx(idx)
    setSelectedOption('')
    setStatusMessage('')
    setIsPassed(idx < highestUnlocked)
  }

  function handleVerifyAnswer() {
    if (!selectedOption) return

    if (selectedOption === level.question.answer) {
      setIsPassed(true)
      const nextUnlock = Math.max(
        highestUnlocked,
        Math.min(PYTHON_LEVELS.length - 1, currentIdx + 1)
      )
      setHighestUnlocked(nextUnlock)
      setStatusMessage('Verified! You can now move to the next level.')
      if (onCompleteLevel) {
        onCompleteLevel(level.id)
      }
    } else {
      setIsPassed(false)
      setStatusMessage('Not quite yet. Review the checkpoints above and try again.')
    }
  }

  function handleNextLevel() {
    if (!isNextUnlocked) {
      setStatusMessage('Answer the verification question correctly to unlock the next level.')
      return
    }
    if (currentIdx < PYTHON_LEVELS.length - 1) {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      setSelectedOption('')
      setStatusMessage('')
      setIsPassed(nextIdx < highestUnlocked)
    }
  }

  return (
    <section className="section" id="python-track">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-kicker">PYTHON LESSON MODULE · B1</span>
            <h2>{level.title}</h2>
          </div>

          <div className="holomat-lang-tabs" role="tablist" aria-label="Python Levels">
            {PYTHON_LEVELS.map((item, idx) => {
              const locked = idx > highestUnlocked
              return (
                <button
                  type="button"
                  key={item.id}
                  role="tab"
                  aria-selected={currentIdx === idx}
                  className={`holo-tab ${currentIdx === idx ? 'active' : ''}`}
                  onClick={() => handleSelectLevel(idx)}
                  disabled={locked}
                  title={locked ? 'Complete previous level to unlock' : item.title}
                >
                  {locked ? `🔒 ${item.levelTag}` : item.levelTag}
                </button>
              )
            })}
          </div>
        </div>

        <div className="challenge-box">
          <div className="challenge-head">
            <span className="challenge-badge">{level.levelTag} · PYTHON</span>
            <span className="challenge-step">
              LEVEL {currentIdx + 1} / {PYTHON_LEVELS.length}
            </span>
          </div>

          <p>{level.summary}</p>

          {level.sections?.map((sec) => (
            <div key={sec.heading}>
              <h3>{sec.heading}</h3>
              <p>{sec.body}</p>
            </div>
          ))}

          <div>
            <span className="section-kicker">CHECKPOINTS</span>
            <ul>
              {level.checkpoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="hero-code-card">
            <div className="code-header">
              <span>lesson_{level.id}.py</span>
              {onOpenEditor && (
                <button
                  type="button"
                  className="mini-btn run"
                  onClick={() => onOpenEditor('Python', level.code)}
                >
                  Open in Code Editor ↗
                </button>
              )}
            </div>
            <pre className="code-body">
              <code>{level.code}</code>
            </pre>
            <div className="code-footer">
              <span>TRY IT: {level.tryTask}</span>
            </div>
          </div>

          <div>
            <span className="section-kicker">UNDERSTANDING CHECK</span>
            <h3>{level.question.prompt}</h3>

            <div className="options-grid">
              {level.question.options.map((opt, i) => (
                <button
                  type="button"
                  key={opt}
                  className={`option-btn ${selectedOption === opt ? 'is-selected' : ''} ${
                    isPassed && opt === level.question.answer ? 'is-correct' : ''
                  }`}
                  onClick={() => {
                    setSelectedOption(opt)
                    setStatusMessage('')
                  }}
                >
                  <span className="opt-key">{String.fromCharCode(65 + i)}</span>
                  <span className="opt-val">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="challenge-actions">
            <span className="challenge-notice" aria-live="polite">
              {statusMessage || 'Answer the question to verify your understanding before moving on.'}
            </span>

            <div className="pane-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleVerifyAnswer}
                disabled={!selectedOption}
              >
                Verify Answer
              </button>

              {currentIdx < PYTHON_LEVELS.length - 1 && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextLevel}
                  disabled={!isNextUnlocked}
                >
                  Next Level →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
