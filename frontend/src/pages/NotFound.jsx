import { Link } from 'react-router-dom'

/*
 * 404 page — rendered by the catch-all route (path="*") when no
 * other route matches the URL.
 */
function NotFound() {
  return (
    <main className="error-page">
      <h1 className="error-title">Page not found</h1>
      <p className="error-text">
        That page doesn&apos;t exist — the link may be old or mistyped.
      </p>
      <Link to="/" className="btn">
        Back to the home page
      </Link>
    </main>
  )
}

export default NotFound
