import Header from "./Header";

export default function Pricing() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your printing needs. No hidden
              fees, no surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <p className="text-gray-600 mb-6">
                  Perfect for occasional printing
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹2</span>
                  <span className="text-gray-600">/page</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Black & White printing
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Standard paper quality
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  A4 size only
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  3-5 business days delivery
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-indigo-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Premium
                </h3>
                <p className="text-gray-600 mb-6">
                  Best value for regular users
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹4</span>
                  <span className="text-gray-600">/page</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Color & Black & White printing
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Premium paper quality
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Multiple paper sizes
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  1-2 business days delivery
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority phone & email support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic binding options
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Business
                </h3>
                <p className="text-gray-600 mb-6">For teams and businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹6</span>
                  <span className="text-gray-600">/page</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Premium
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional binding
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Same day delivery*
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Bulk discounts available
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 priority support
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Additional Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Binding</h4>
                <p className="text-gray-600 text-sm mb-2">
                  Professional document binding
                </p>
                <p className="text-indigo-600 font-semibold">Starting at ₹25</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Lamination</h4>
                <p className="text-gray-600 text-sm mb-2">
                  Protect your documents
                </p>
                <p className="text-indigo-600 font-semibold">₹5 per page</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Express Delivery
                </h4>
                <p className="text-gray-600 text-sm mb-2">Same day delivery</p>
                <p className="text-indigo-600 font-semibold">₹50 extra</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Bulk Orders
                </h4>
                <p className="text-gray-600 text-sm mb-2">50+ pages discount</p>
                <p className="text-indigo-600 font-semibold">15% off</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Are there any setup fees or hidden charges?
                </h4>
                <p className="text-gray-600">
                  No, we believe in transparent pricing. The price you see is
                  what you pay, with no hidden fees or setup charges.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can I change my plan later?
                </h4>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time.
                  We&apos;ll prorate the charges accordingly.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, UPI, and net
                  banking through our secure payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Printing?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who trust AutoPrint X
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
