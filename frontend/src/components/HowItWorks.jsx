import '../styles/HowItWorks.css'

/*
 * The three steps are kept in an array so the JSX below can stay short:
 * we loop over the data with .map() instead of repeating the markup.
 * To change a step, just edit this array.
 */
const steps = [
  {
    number: 1,
    title: 'You subscribe',
    text: 'Sign up and record a short voice note for your parent, so our first call arrives with your voice.',
  },
  {
    number: 2,
    title: 'We call your parent',
    text: 'Our trained caller phones your parent on the schedule you choose — a friendly chat on any GSM phone.',
  },
  {
    number: 3,
    title: 'You get an update',
    text: 'After each call, you receive a wellness update so you always know how Mom and Dad are doing.',
  },
]

function HowItWorks() {
  return (
    /* The id lets nav links and buttons scroll here with href="#how-it-works" */
    <section className="how-it-works" id="how-it-works">
      <h2 className="section-title">How it works</h2>
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
