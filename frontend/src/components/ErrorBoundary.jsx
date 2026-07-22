import { Component } from 'react'
import { withTranslation } from 'react-i18next'

/*
 * ErrorBoundary: catches render-time crashes anywhere below it in
 * the tree and shows a friendly recovery screen instead of a
 * blank white page.
 *
 * This is one of the few places React still requires a CLASS
 * component — there is no hook equivalent of componentDidCatch yet.
 * Classes can't use hooks like useTranslation(), so the
 * withTranslation() wrapper at the bottom injects t as a prop.
 */
class ErrorBoundary extends Component {
  state = { hasError: false }

  // React calls this when a child component throws during render
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // TODO(real API): report to an error-tracking service (e.g. Sentry)
    console.error('Unexpected error:', error, info)
  }

  handleRetry = () => {
    // Clearing the flag re-renders the children; if the crash was
    // transient (e.g. bad network moment) this recovers in place
    this.setState({ hasError: false })
  }

  render() {
    const { t } = this.props

    if (this.state.hasError) {
      return (
        <main className="error-page">
          <h1 className="error-title">{t('common.errorTitle')}</h1>
          <p className="error-text">{t('common.errorText')}</p>
          <button type="button" className="btn" onClick={this.handleRetry}>
            {t('common.tryAgain')}
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

export default withTranslation()(ErrorBoundary)
