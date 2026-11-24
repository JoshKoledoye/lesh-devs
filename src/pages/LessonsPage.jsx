import PythonTrack from '../components/python'

export default function LessonsPage({
  activeLanguage,
  onSelectLanguage,
  onBackHome,
  onOpenEditor,
  onCompleteLevel,
  completedPythonLevels = [],
}) {
  return (
    <main className="lessons-page">
      <div className="container">
        <div className="lessons-page-bar">
          <button type="button" className="btn btn-outline" onClick={onBackHome}>
            ← Back to Landing Page
          </button>

          <div className="holomat-lang-tabs" role="tablist" aria-label="Select Language Track">
            {['Python', 'Java', 'HTML', 'CSS', 'JavaScript', 'C'].map((lang) => (
              <button
                type="button"
                key={lang}
                role="tab"
                aria-selected={activeLanguage === lang}
                className={`holo-tab ${activeLanguage === lang ? 'active' : ''}`}
                onClick={() => onSelectLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeLanguage === 'Python' ? (
        <PythonTrack
          onOpenEditor={onOpenEditor}
          onCompleteLevel={onCompleteLevel}
        />
      ) : (
        <section className="section">
          <div className="container">
            <div className="challenge-box">
              <span className="challenge-badge">{activeLanguage.toUpperCase()} · COMING NEXT</span>
              <h2>{activeLanguage} Lessons Are Being Built</h2>
              <p>
                Python is currently our active B1 pilot track ({completedPythonLevels.length}/3 levels completed).
                Switch back to Python to start your first lesson now.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSelectLanguage('Python')}
              >
                Go to Python Lessons →
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
