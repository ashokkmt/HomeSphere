'use client';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import feather from 'feather-icons'
import { useEffect } from 'react';
import '../styles/homepage.css';
import SearchBar from '../components/SearchBar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '../components/PropertyCard';
import LocalityCard from '../components/LocalityCard';
import Testimonials from '../components/Testimonials';


export default function NestQuest() {
  const router = useRouter();

  useEffect(() => {
    feather.replace();
  }, []);

  const properties = [
    {
      id: 1,
      title: 'Luxury Villa in Bangalore',
      location: 'Whitefield, Bangalore',
      price: '₹1.2 Cr',
      pricePerSqFt: '₹8,500/sq.ft',
      area: '1,400 sq.ft',
      bhk: '3 BHK',
      status: 'Ready to Move',
      featured: true,
      agent: 'John Properties',
      image: 'http://static.photos/real-estate/640x360/1',
      agentImage: 'http://static.photos/people/200x200/2'
    },
    {
      id: 2,
      title: 'Modern Apartment in Mumbai',
      location: 'Bandra West, Mumbai',
      price: '₹2.5 Cr',
      pricePerSqFt: '₹15,000/sq.ft',
      area: '1,650 sq.ft',
      bhk: '2 BHK',
      status: 'Under Construction',
      featured: false,
      agent: 'Elite Realtors',
      image: 'http://static.photos/real-estate/640x360/2',
      agentImage: 'http://static.photos/people/200x200/3'
    },
    {
      id: 3,
      title: 'Premium Villa in Goa',
      location: 'Candolim, Goa',
      price: '₹3.8 Cr',
      pricePerSqFt: '₹6,500/sq.ft',
      area: '5,800 sq.ft',
      bhk: '4 BHK',
      status: 'Ready to Move',
      featured: false,
      agent: 'Sunshine Properties',
      image: 'http://static.photos/real-estate/640x360/3',
      agentImage: 'http://static.photos/people/200x200/4'
    }
  ];

  const localities = [
    { name: 'Bandra West', avgPrice: '₹25,000/sq.ft', properties: '248+', image: 'http://static.photos/cityscape/640x360/1' },
    { name: 'Whitefield', avgPrice: '₹8,500/sq.ft', properties: '312+', image: 'http://static.photos/cityscape/640x360/2' },
    { name: 'Gurgaon Sector 56', avgPrice: '₹11,200/sq.ft', properties: '189+', image: 'http://static.photos/cityscape/640x360/3' }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      rating: 4,
      text: 'Found my dream home through NestQuest. The process was smooth and the team was very professional. Highly recommended!',
      image: 'http://static.photos/people/200x200/5'
    },
    {
      name: 'Priya Patel',
      rating: 5,
      text: 'As a first-time home buyer, I was nervous about the process. NestQuest made it so easy with their transparent pricing and great support.',
      image: 'http://static.photos/people/200x200/6'
    },
    {
      name: 'Amit Joshi',
      rating: 4,
      text: 'Excellent service! The property recommendations were spot on based on my preferences. Will definitely use NestQuest again.',
      image: 'http://static.photos/people/200x200/7'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <div className="heroContent">
            <h1 className="heroTitle">Find Your Perfect Home</h1>
            <p className="heroSubtitle">Discover thousands of properties for sale and rent across the country</p>
            <SearchBar />
          </div>
        </div>

        {/* Property Listings */}
        <div className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Featured Properties</h2>
            <Link href="/property" className="viewAll">View all</Link>
          </div>
          <div className="propertyGrid">
            {
              properties.map((property, index) => (
                <PropertyCard
                  index={index}
                  property={property}
                />
              ))
            }
          </div>
        </div>

        {/* Popular Localities */}
        <div className="localitiesSection">
          <div className="section">
            <h2 className="sectionTitle">Popular Localities</h2>
            <div className="localityGrid">
              {
                localities.map((locality, index) => (
                  <LocalityCard
                    index={index}
                    locality={locality}
                  />
                ))
              }
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="section">
          <h2 className="sectionTitleCenter">What Our Customers Say</h2>
          <div className="testimonialGrid">
            {
              testimonials.map((testimonial, index) => (
                <Testimonials
                  testimonial={testimonial}
                  index={index}
                />
              ))
            }
          </div>
        </div>

        {/* CTA Section */}
        <div className="ctaSection">
          <div className="ctaContent">
            <div className="ctaText">
              <h2 className="ctaTitle">Ready to find your dream home?</h2>
              <p className="ctaSubtitle">
                Join thousands of happy homeowners who found their perfect property with NestQuest.
              </p>
              <div className="ctaButtons">
                <Link href="#" className="ctaButtonPrimary">Browse Properties</Link>
                <Link href="#" className="ctaButtonSecondary">Contact Agent</Link>
              </div>
            </div>
            <div className="ctaImage">
              <img src="http://static.photos/real-estate/640x360/4" alt="Happy family" />
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}