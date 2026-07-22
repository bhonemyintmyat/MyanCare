import { useTranslation } from 'react-i18next'
import '../styles/HowItWorks.css'

/*
 * Section 2: the three steps.
 * The step numbers are fixed; titles and text come from the
 * translation files, so the array is built inside the component
 * where t() is available.
 */
function HowItWorks() {
  const { t } = useTranslation()

  const steps = [1, 2, 3].map((number) => ({
    number,
    title: t(`howItWorks.step${number}Title`),
    text: t(`howItWorks.step${number}Text`),
  }))

  return (
    /* The id lets nav links and buttons scroll here with href="#how-it-works" */
    <section className="how-it-works" id="how-it-works">
      <h2 className="section-title">{t('howItWorks.title')}</h2>
      <ol className="steps">
        {steps.map((step) => (
          /* "key" helps React track each item in a list */
          <li className="step" key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorks
