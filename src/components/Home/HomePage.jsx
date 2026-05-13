import Approach from "./Approach"
import Blogs from "./Blogs"
import Brands from "./Brands"
import Clients from "./Clients"
import Deals from "./Deals"
import FinancialCTA from "./FinancialCTA"
import HomeHero from "./HomeHero"
import ScrollToTopHome from "./ScrollToTopHome"
import Testimonials from "./Testimonials"
import Testimonials2 from "./Testimonials2"
import WhatWeDo from "./WhatWeDo"
import WhoWeAre from "./WhoWeAre"
import WhyChooseUs from "./WhyChooseUs"


const HomePage = () => {
  return (
    <div>
        <HomeHero />
        <Brands />
        <WhoWeAre />
         
        <WhatWeDo />
        <Clients />
       
        <Testimonials />
        <Testimonials2 />
         <Deals />
         <WhyChooseUs />
         <Blogs />
         <Approach />
         <FinancialCTA/>
         <ScrollToTopHome />
        
  
       
        
        
     
    </div>
  )
}

export default HomePage