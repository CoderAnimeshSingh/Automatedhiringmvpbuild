import { Link } from 'react-router-dom';
import { Bot, Zap, Users, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">HRFlow AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <Link
                to="/hr/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                HR Login
              </Link>
              <Link
                to="/apply"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI-Powered Hiring Revolution</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Automate Your Entire
            <br />
            Hiring Process
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From candidate screening to interview scheduling to offer letters—all automated with AI.
            Save 10+ hours per week and hire the best talent faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/apply"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              Start Your Application
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              See How It Works
            </a>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>90% Faster Screening</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Zero Manual Work</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to streamline hiring</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Bot className="w-8 h-8" />}
              title="AI Resume Screening"
              description="Automatically analyze resumes and rank candidates by fit score using advanced AI"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Processing"
              description="Candidates get screened within minutes of applying—no waiting"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Smart Dashboard"
              description="View all candidates, filter by score, and manage the entire pipeline"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Auto Scheduling"
              description="Qualified candidates automatically receive interview scheduling links"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple 4-step automation</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Candidate Applies"
              description="Submit application form with resume upload"
            />
            <StepCard
              number="2"
              title="AI Screening"
              description="Resume analyzed, skills extracted, fit score generated"
            />
            <StepCard
              number="3"
              title="Auto Notification"
              description="Email sent with next steps or interview link"
            />
            <StepCard
              number="4"
              title="HR Reviews"
              description="View top candidates in dashboard and hire"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Start automating today</p>
          </div>
          <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">$59<span className="text-2xl text-gray-600">/mo</span></div>
              <p className="text-gray-600">or ₹4,999/month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <PricingFeature text="Unlimited candidate applications" />
              <PricingFeature text="AI resume screening" />
              <PricingFeature text="HR dashboard access" />
              <PricingFeature text="Email notifications" />
              <PricingFeature text="Priority support" />
              <PricingFeature text="Free 2-week trial" />
            </ul>
            <Link
              to="/apply"
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-shadow text-center"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl mb-6">Ready to Transform Your Hiring?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join companies saving 10+ hours per week on recruitment
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-xl transition-shadow"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 HRFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}
