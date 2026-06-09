import React from 'react'
import BlogsHero from './BlogsHero'
import BlogsSection from './BlogsSection'
import ScrollToTopBlogs from './ScrollToTopBlogs'

const BlogsPage = () => {
  return (
    <div>
        <BlogsHero />
        <BlogsSection />
        <ScrollToTopBlogs />
    </div>
  )
}

export default BlogsPage