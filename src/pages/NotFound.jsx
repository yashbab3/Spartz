import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="section" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <span className="eyebrow" style={{ color: 'var(--color-pitch)' }}>
        Offside
      </span>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem',
          textTransform: 'uppercase',
          marginTop: 8,
        }}
      >
        Page not found
      </h1>
      <p style={{ color: 'var(--color-muted)', marginTop: 10 }}>
        That page doesn&rsquo;t exist. Let&rsquo;s get you back on pitch.
      </p>
      <Link to="/" className="btn btn--gold" style={{ marginTop: 20 }}>
        Back to home
      </Link>
    </div>
  )
}
