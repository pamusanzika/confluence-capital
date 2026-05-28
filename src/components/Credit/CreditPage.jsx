import React from 'react'
import CreditHero from './CreditHero'
import WhatWeDoCredit from './WhatWeDoCredit'
import HowWeDoItCredit from './HowWeDoItCredit'
import OpportunityCredit from './OpportunityCredit'
import SuccessStoriesCredit from './SuccessStoriesCredit'


const CreditPage = () => {
  return (
    <div>
        <CreditHero />
        <WhatWeDoCredit />
        <HowWeDoItCredit />
        <OpportunityCredit />
        <SuccessStoriesCredit/>
    </div>
  )
}

export default CreditPage