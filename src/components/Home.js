// src/components/Home.js
import Link from 'next/link'

export default function Home() {
  const pathways = [
    {
      title: 'Explore Careers',
      description: 'Browse thousands of career options based on your interests.',
      href: '/questionnaire',
      buttonText: 'Get Started',
    },
    {
      title: 'Build Your CV',
      description: 'Use our AI-powered builder to craft the perfect résumé.',
      href: '/cvbuilder',
      buttonText: 'Build CV',
    },
    {
      title: 'Find Opportunities',
      description: 'See job postings tailored to your skills.',
      href: '/results',
      buttonText: 'View Jobs',
    },
  ]

  return (
    <div className="home-wrapper">
      <section className="intro-section">
        <h1>Welcome to CareerNext</h1>
        <p className="intro-subtext">
          Take our quick quiz, build your CV, and discover the perfect career match.
        </p>
      </section>

      <div className="user-pathways">
        {pathways.map(({ title, description, href, buttonText }) => (
          <div key={title} className="card">
            <h2>{title}</h2>
            <p>{description}</p>
            <Link href={href}>
              <button>{buttonText}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
