import React from 'react'
import DealBookHero from './DealBookHero'
import DealBookCards from './DealBookCards'
import ScrollToTopDealBook from './ScrollToTopDealBook'


const DealBookPage = () => {
  return (
    <div>
        <DealBookHero />
        <DealBookCards />
        <ScrollToTopDealBook />
    </div>
  )
}

export default DealBookPage