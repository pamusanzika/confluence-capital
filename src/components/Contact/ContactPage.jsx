import React from 'react'
import ContactHero from './ContactHero'
import ContactForm from './ContactForm'
import ScrollToTopContact from './ScrollToTopContact'

const ContactPage = () => {
  return (
    <div>
        <ContactHero />
        <ContactForm />
        <ScrollToTopContact />
    </div>
  )
}

export default ContactPage