import React, { useState } from 'react';
import { Check, Star, Zap, Building2 } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

export default function PricingSaaS() {
  const { push: toast } = useToast();
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (plan) => {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      
      window.location.href = data.url;
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      setLoading(null);
    }
  };

  const tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$19',
      description: 'Perfect for individuals looking to boost their career.',
      features: [
        '50 AI Generations / month',
        'Resume Fixer Access',
        'LinkedIn Profile Roast',
        'Standard Support'
      ],
      icon: <Star className="w-6 h-6 text-indigo-400" />
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$39',
      popular: true,
      description: 'For power users and founders building their side-hustle.',
      features: [
        '250 AI Generations / month',
        'SEO Article Generator',
        'Business Plan Generator',
        'Priority Output Generation',
        'Advanced Support'
      ],
      icon: <Zap className="w-6 h-6 text-purple-400" />
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '$99',
      description: 'For teams that need massive scale and API access.',
      features: [
        'Unlimited AI Generations',
        'Bulk Article Generation',
        'SEO Optimization Score',
        'Custom Webhooks',
        '24/7 Dedicated Support'
      ],
      icon: <Building2 className="w-6 h-6 text-blue-400" />
    }
  ];

  return (
    <div className="py-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-400 text-lg">No hidden fees. Cancel anytime. Accelerate your growth today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={`relative bg-[#111113] rounded-3xl p-8 border ${
              tier.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-white/10'
            } flex flex-col`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                MOST POPULAR
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                {tier.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
            </div>
            
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">{tier.price}</span>
              <span className="text-gray-400 font-medium">/month</span>
            </div>
            
            <p className="text-gray-400 mb-8 pb-8 border-b border-white/10 flex-1">
              {tier.description}
            </p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleCheckout(tier.id)}
              disabled={loading === tier.id}
              className={`w-full py-4 rounded-xl font-bold transition-all flex justify-center ${
                tier.popular 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {loading === tier.id ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Get Started'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
