import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type PricingPeriod = 'monthly' | 'annual';

interface PricingTier {
  name: string;
  id: string;
  price: {
    monthly: string;
    annual: string;
  };
  description: string;
  features: string[];
  mostPopular: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    id: 'tier-starter',
    price: { monthly: '$29', annual: '$24' },
    description: 'Perfect for individual researchers or small projects.',
    features: [
      '5,000 pages per month',
      '1 concurrent scraper',
      'Basic data extraction',
      'Export to CSV or JSON',
      'Email support',
      '7-day data retention',
    ],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    price: { monthly: '$79', annual: '$69' },
    description: 'Ideal for businesses needing regular data collection.',
    features: [
      '50,000 pages per month',
      '5 concurrent scrapers',
      'Advanced extraction with AI',
      'All export formats',
      'API access',
      'Scheduled scraping',
      'Priority support',
      '30-day data retention',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: { monthly: '$249', annual: '$199' },
    description: 'For organizations with large-scale data requirements.',
    features: [
      'Unlimited pages',
      'Unlimited concurrent scrapers',
      'Custom scraper development',
      'Data transformation pipelines',
      'Dedicated proxy pool',
      'Unlimited data retention',
      'Dedicated account manager',
      'SLA guarantees',
    ],
    mostPopular: false,
  },
];

const PricingSection: React.FC = () => {
  const [period, setPeriod] = useState<PricingPeriod>('monthly');

  const togglePeriod = () => {
    setPeriod((prev) => (prev === 'monthly' ? 'annual' : 'monthly'));
  };

  const calculateDiscount = (monthly: string, annual: string) => {
    const monthlyValue = parseInt(monthly.replace('$', ''));
    const annualValue = parseInt(annual.replace('$', ''));
    const annualTotal = annualValue * 12;
    const monthlyTotal = monthlyValue * 12;
    const savings = monthlyTotal - annualTotal;
    const discountPercentage = Math.round((savings / monthlyTotal) * 100);
    
    return discountPercentage;
  };

  return (
    <div id="pricing" className="bg-white dark:bg-gray-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 dark:text-primary-500 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Plans for businesses of all sizes
          </p>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Start for free, upgrade when you need more capacity. No credit card required.
          </p>

          {/* Toggle between monthly and annual billing */}
          <div className="relative mt-12 flex justify-center">
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${period === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly billing
              </span>
              <button
                type="button"
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${period === 'annual' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
                role="switch"
                aria-checked={period === 'annual'}
                onClick={togglePeriod}
              >
                <span
                  aria-hidden="true"
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${period === 'annual' ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
              <span className={`text-sm font-medium flex items-center ${period === 'annual' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Annual billing
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`
                relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm
                transition-all duration-200 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800
                ${tier.mostPopular ? 'border-primary-500 dark:border-primary-500 ring-1 ring-primary-500 dark:ring-primary-500' : ''}
              `}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 right-8">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    Most popular
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                {period === 'annual' && (
                  <p className="absolute top-8 right-8 text-sm text-green-600 dark:text-green-400">
                    Save {calculateDiscount(tier.price.monthly, tier.price.annual)}%
                  </p>
                )}
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {period === 'monthly' ? tier.price.monthly : tier.price.annual}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/mo</span>
                </p>
                <p className="mt-6 text-gray-500 dark:text-gray-400">{tier.description}</p>

                {/* Feature list */}
                <ul role="list" className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-400">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to={tier.name === 'Enterprise' ? '/contact' : '/auth/register'}
                  className={`
                    w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md 
                    ${
                      tier.mostPopular
                        ? 'text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800'
                        : 'text-primary-700 bg-primary-50 hover:bg-primary-100 dark:text-primary-300 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }
                    transition-colors duration-200
                  `}
                >
                  {tier.name === 'Enterprise' ? 'Contact us' : 'Get started'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Need a custom solution?
          </h3>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Our enterprise plans include custom features, dedicated support, and more.
          </p>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 border border-primary-500 text-base font-medium rounded-md text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-900 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
