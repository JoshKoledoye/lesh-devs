import { Fragment } from 'react'

const PYTHON_KEYWORDS = new Set([
  'def',
  'return',
  'if',
  'elif',
  'else',
  'for',
  'in',
  'while',
  'break',
  'continue',
  'True',
  'False',
  'None',
  'and',
  'or',
  'not',
  'import',
  'from',
  'as',
  'class',
  'try',
  'except',
  'finally',
])

const BUILTIN_FUNCS = new Set(['print', 'len', 'range', 'input', 'int', 'str', 'float', 'bool'])

function highlightLine(line) {
  // Separate trailing or full-line comments
  const commentIndex = line.indexOf('#')
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : ''

  // Tokenize strings, words, numbers, operators, and punctuation
  const tokenRegex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b|==|!=|<=|>=|=|\+|\-|\*|\/|%|<|>|\(|\)|\[|\]|\{|\}|:|,|\.)/g

  const tokens = []
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(codePart)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'plain', value: codePart.slice(lastIndex, match.index) })
    }

    const value = match[0]
    const nextChar = codePart[match.index + value.length]

    if (value.startsWith('"') || value.startsWith("'")) {
      tokens.push({ type: 'string', value })
    } else if (PYTHON_KEYWORDS.has(value)) {
      tokens.push({ type: 'keyword', value })
    } else if (BUILTIN_FUNCS.has(value) && nextChar === '(') {
      tokens.push({ type: 'builtin', value })
    } else if (/^\d/.test(value)) {
      tokens.push({ type: 'number', value })
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      // Variable / identifier on left side of '=' is highlighted as a variable
      if (nextChar === '=') {
        tokens.push({ type: 'variable', value })
      } else if (nextChar === '(') {
        tokens.push({ type: 'function', value })
      } else {
        tokens.push({ type: 'identifier', value })
      }
    } else if (['=', '==', '!=', '<=', '>=', '+', '-', '*', '/', '%', '<', '>'].includes(value)) {
      tokens.push({ type: 'operator', value })
    } else {
      tokens.push({ type: 'punctuation', value })
    }

    lastIndex = match.index + value.length
  }

  if (lastIndex < codePart.length) {
    tokens.push({ type: 'plain', value: codePart.slice(lastIndex) })
  }

  if (commentPart) {
    tokens.push({ type: 'comment', value: commentPart })
  }

  return tokens
}

export default function CodeBlock({
  code = '',
  filename = 'lesson.py',
  language = 'Python',
  tryTask = '',
  onOpenEditor,
}) {
  const lines = code.split('\n')

  return (
    <div className="vscode-block" role="region" aria-label={`${language} code snippet`}>
      <div className="vscode-topbar">
        <div className="vscode-window-dots" aria-hidden="true">
          <span className="dot-red" />
          <span className="dot-yellow" />
          <span className="dot-green" />
        </div>
        <span className="vscode-file">{filename}</span>
        <span className="vscode-lang-badge">{language}</span>
        {onOpenEditor && (
          <button
            type="button"
            className="vscode-open-btn"
            onClick={() => onOpenEditor(language, code)}
          >
            Open in Editor ↗
          </button>
        )}
      </div>

      <div className="vscode-legend" aria-label="Syntax color key">
        <span><i className="swatch kw" />Keyword</span>
        <span><i className="swatch vr" />Variable</span>
        <span><i className="swatch fn" />Function</span>
        <span><i className="swatch st" />String</span>
        <span><i className="swatch nm" />Number</span>
        <span><i className="swatch cm" />Comment</span>
      </div>

      <div className="vscode-editor-body">
        <pre className="vscode-pre">
          <code>
            {lines.map((line, idx) => {
              const tokens = highlightLine(line)
              return (
                <div className="vscode-line" key={idx}>
                  <span className="vscode-ln">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="vscode-code-content">
                    {tokens.length > 0 ? (
                      tokens.map((tok, tIdx) => (
                        <Fragment key={tIdx}>
                          <span className={`tok-${tok.type}`}>{tok.value}</span>
                        </Fragment>
                      ))
                    ) : (
                      ' '
                    )}
                  </span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>

      {tryTask && (
        <div className="vscode-footer">
          <strong>TRY IT:</strong> <span>{tryTask}</span>
        </div>
      )}
    </div>
  )
}
