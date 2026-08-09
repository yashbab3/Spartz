import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section footer__inner">
        <div>
          <span className="footer__brand">SPORTZ</span>
          <p className="footer__tag">Fixtures, teams &amp; favorites for football fans.</p>
        </div>
        <p className="footer__note">
          Sample fixture data for demonstration only — no live scores, no betting or
          real-money features. Team crests are generated placeholders, not official club
          artwork.
        </p>
      </div>
    </footer>
  )
}
