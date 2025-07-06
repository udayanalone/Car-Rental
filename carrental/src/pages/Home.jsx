import React from 'react';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import Banner from '../components/Banner';
import Testimonial from '../components/Testimonial';
import Footer from '../components/Footer';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <Banner />
      <Testimonial />
      <NewsLetter />
    </div>
  )
}

export default Home
