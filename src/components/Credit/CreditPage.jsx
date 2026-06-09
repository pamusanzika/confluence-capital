import React from 'react'
import CreditHero from './CreditHero'
import WhatWeDoCredit from './WhatWeDoCredit'
import HowWeDoItCredit from './HowWeDoItCredit'
import OpportunityCredit from './OpportunityCredit'
import SuccessStoriesCredit from './SuccessStoriesCredit'
import ScrollToTopCredit from './ScrollToTopCredit'


const CreditPage = () => {
  return (
    <div>
        <CreditHero />
        <WhatWeDoCredit />
        <HowWeDoItCredit />
        <OpportunityCredit />
        <SuccessStoriesCredit/>
        <ScrollToTopCredit />
    </div>
  )
}

export default CreditPage