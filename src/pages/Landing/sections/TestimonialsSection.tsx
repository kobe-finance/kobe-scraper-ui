import React, { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    id: 1,
    content: "Kobe Scraper revolutionized how we collect market intelligence. We've reduced our data collection time by 70% while improving data quality and coverage.",
    author: {
      name: 'Sarah Johnson',
      role: 'Head of Market Research at TechVision',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    content: "We've tried multiple scraping solutions before finding Kobe. The ease of use, reliability, and excellent customer support make it stand out. It's now an essential tool for our competitive analysis.",
    author: {
      name: 'Michael Chen',
      role: 'Product Manager at GlobalRetail',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    content: "The automated scheduling and data transformation features have saved our team countless hours. We can now focus on analyzing the data instead of collecting it.",
    author: {
      name: 'Emily Rodriguez',
      role: 'Data Scientist at FinAnalytics',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 4,
    content: "As a small e-commerce business, we needed affordable price monitoring across multiple competitors. Kobe Scraper delivers this seamlessly, and the insights have directly increased our profit margins.",
    author: {
      name: 'Daniel Park',
      role: 'Founder at StyleOutlet',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 5,
    content: "The proxy rotation and anti-detection features ensure we get reliable data consistently. We've had zero blocks since switching to Kobe, compared to frequent issues with our previous solution.",
    author: {
      name: 'Jessica Williams',
      role: 'CTO at DataDriven',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
];

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToTestimonial = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 7000);

    return () => clearInterval(interval);
  }, [nextTestimonial, isPaused]);

  return (
    <div id="testimonials" className="bg-gray-50 dark:bg-gray-800 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 dark:text-primary-500 tracking-wide uppercase">TESTIMONIALS</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Trusted by data-driven teams
          </p>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            See what our customers have to say about their experience with Kobe Scraper.
          </p>
        </div>

        <div 
          className="relative mt-12 max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-96 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`
                  absolute w-full h-full p-8 transition-all duration-700 ease-in-out transform 
                  ${index === activeIndex ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                `}
              >
                <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden">
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="h-5 w-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        ))}
                      </div>
                      <div className="relative text-lg font-medium text-gray-800 dark:text-gray-200">
                        <svg
                          className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-gray-200 dark:text-gray-700"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative z-10 mt-2">{testimonial.content}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={testimonial.author.image}
                          alt={testimonial.author.name}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {testimonial.author.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.author.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="absolute top-1/2 transform -translate-y-1/2 left-0 flex items-center justify-between w-full">
            <button
              onClick={prevTestimonial}
              className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 -ml-4"
            >
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 -mr-4"
            >
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === activeIndex
                    ? 'bg-primary-600 dark:bg-primary-500'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
