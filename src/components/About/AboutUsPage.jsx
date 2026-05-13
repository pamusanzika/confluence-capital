import React from 'react'
import AboutUsHero from './AboutUsHero'
import WhoWeAreAbout from './WhoWeAreAbout'
import WhatDrivesUs from './WhatDrivesUs'
import OurValues from './OurValues'
import OurExpertise from './OurExpertise'
import OurImpact from './OurImpact'
import Team from './Team'
import CallToActionAbout from './CallToActionAbout'

const AboutUsPage = () => {
  return (
    <div>
        <AboutUsHero/>
        <WhoWeAreAbout />
        <WhatDrivesUs />
        <OurValues />
        <OurExpertise />
        <OurImpact />
        <Team />
        <CallToActionAbout />
    </div>
  )
}

export default AboutUsPage