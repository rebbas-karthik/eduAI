

import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('Home')
  const [topic, setTopic] = useState('')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const questions = {
    Java: 'What is Java, and what are its main features?',
    DBMS: 'What is a database management system?',
    React: 'What is React, and why is it used?',
    Python: 'What is Python, and where is it used?',
  }

  async function callAI(endpoint) {
    if (!answer.trim()) {
      setResult('Please enter your answer first.')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const response = await fetch(
        `https://eduai-e6cq.onrender.com/api/ai/${endpoint}`
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer: answer.trim() }),
        }
      )

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result || 'No response received from AI.')
    } catch (error) {
      console.error('AI request failed:', error)
      setResult(
        'Unable to connect to EduAI. Please check that the backend and Ollama are running, then try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function evaluateAnswer() {
    callAI('evaluate')
  }

  function summarizeAnswer() {
    callAI('summarize')
  }

  function openPage(item) {
    setPage(item)
    setResult('')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>EduAI 🎓</h2>
        <p className="tagline">Your AI Study Partner</p>

        {[
          'Home',
          'Practice Questions',
          'Evaluate Answer',
          'Summarizer',
          'Study Preparation',
        ].map(item => (
          <button
            key={item}
            className={
              page === item ? 'nav-button active' : 'nav-button'
            }
            onClick={() => openPage(item)}
          >
            {item}
          </button>
        ))}
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{page === 'Home' ? 'Student Dashboard' : page}</h1>
            <p>
              Learn better. Practise smarter. Prepare confidently.
            </p>
          </div>
        </header>

        {page === 'Home' && (
          <>
            <section className="welcome">
              <h2>Welcome to EduAI!</h2>
              <p>
                Your learning journey starts here. Practise questions,
                improve answers, and prepare for exams.
              </p>
            </section>

            <section className="cards">
              {[
                ['📝', 'Practice Questions', 'Test your knowledge'],
                ['✅', 'Evaluate Answer', 'Review your written answers'],
                ['📚', 'Summarizer', 'Create short revision notes'],
                ['🎯', 'Study Preparation', 'Prepare for your examinations'],
              ].map(([icon, title, description]) => (
                <button
                  className="feature-card"
                  key={title}
                  onClick={() => openPage(title)}
                >
                  <span className="feature-icon">{icon}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="card-link">Get started →</span>
                </button>
              ))}
            </section>
          </>
        )}

        {page === 'Practice Questions' && (
          <section className="panel">
            <h2>Practice Questions</h2>
            <p>Select a subject to practise a question.</p>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              >
                <option value="">Select a subject</option>
                {Object.keys(questions).map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {topic && (
              <div className="question-box">
                <strong>Your question:</strong>
                <p>{questions[topic]}</p>
              </div>
            )}
          </section>
        )}

        {(page === 'Evaluate Answer' || page === 'Summarizer') && (
          <section className="panel">
            <h2>
              {page === 'Evaluate Answer'
                ? 'Evaluate Your Answer'
                : 'Summarize Your Answer'}
            </h2>

            <p>
              {page === 'Evaluate Answer'
                ? 'Enter your answer to receive AI-generated feedback and suggestions.'
                : 'Enter your text to generate concise AI-powered study notes.'}
            </p>

            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer or paste your text here..."
              rows="8"
              disabled={loading}
            />

            <div className="actions">
              <button
                className="primary-button"
                onClick={
                  page === 'Evaluate Answer'
                    ? evaluateAnswer
                    : summarizeAnswer
                }
                disabled={loading}
              >
                {loading
                  ? 'AI is thinking...'
                  : page === 'Evaluate Answer'
                    ? 'Evaluate Answer'
                    : 'Summarize Text'}
              </button>

              <button
                className="secondary-button"
                disabled={loading}
                onClick={() => {
                  setAnswer('')
                  setResult('')
                }}
              >
                Clear
              </button>
            </div>

            {result && (
              <div className="result-box">
                <strong>
                  {loading ? 'Please wait' : 'AI Result'}
                </strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
              </div>
            )}
          </section>
        )}

        {page === 'Study Preparation' && (
          <section className="panel">
            <h2>Study Preparation</h2>
            <p>
              Choose a subject in Practice Questions, or start with
              these study tips.
            </p>

            <ul className="study-list">
              <li>Understand the basic concepts before memorizing.</li>
              <li>Practise answering questions in your own words.</li>
              <li>Revise important definitions and examples.</li>
              <li>Review your mistakes and practise again.</li>
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
