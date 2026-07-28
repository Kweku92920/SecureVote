import React from 'react';

const SecureVoteLandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] font-sans text-gray-900 overflow-x-hidden">
      
      {/* --- Navigation Bar --- */}
      <nav className="w-full px-6 py-4 md:px-12 flex justify-between items-center bg-[var(--app-surface)] sticky top-0 z-50 shadow-sm">
        {/* Logo Area */}
        {/* Logo Area */}
{/* Logo Area */}
<div className="flex items-center cursor-pointer">
  <img 
    src="/Logo.png" 
    alt="SecureVote Logo" 
    className="h-5 w-auto object-contain" 
  />
</div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
         
        </div>

        {/* Get Started Button */}
        <div>
          <button
            onClick={onGetStarted}
            className="bg-[#2da44e] hover:bg-[#258740] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative w-full py-28 flex flex-col items-center justify-center px-4 text-center overflow-hidden">
  {/* Background Image Layer */}
  <div 
    className="absolute inset-0 z-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/Vote.jpg')" }}
  ></div>

  {/* Gray Tint Overlay */}
  {/* Adjust the opacity by changing /90 (e.g., /80, /70) */}
  <div className="absolute inset-0 z-[1] bg-[#76808a]/90 pointer-events-none"></div>

  {/* Content Layer */}
  <div className="relative z-10">
    {/*<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
      <div className="w-2 h-2 rounded-full bg-[#4ade80]"></div>
      <span className="text-sm font-medium text-white">Trusted As Your No 1 Election Partner</span>
    </div>*/}

    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
      <span className="text-white block">Voting</span>
      <span className="text-[#55c57a] block mt-1">Simplified</span>
    </h1>

    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
      SecureVote is a secure, transparent, and easy-to-use platform for reliable digital elections.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button
        onClick={onGetStarted}
        className="w-full sm:w-auto bg-[#2da44e] hover:bg-[#258740] text-white font-semibold text-lg px-8 py-3.5 rounded-md transition-all shadow-lg hover:shadow-xl"
      >
        Get Started
      </button>
    </div>
  </div>
</section>
      {/* --- Features Section --- */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#16a34a] font-bold tracking-widest text-sm uppercase mb-3">Platform Features</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-6">Everything You Need for Secure Elections</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From voter registration to real-time results, SecureVote covers every aspect of modern electronic voting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Fraud Detection</h3>
            <p className="text-gray-500 leading-relaxed">
              Our system detects duplicate votes, suspicious activity, and unauthorized access attempts in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Anonymous Voting</h3>
            <p className="text-gray-500 leading-relaxed">
              The system keeps each vote private while ensuring every person can vote only once.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Live Results</h3>
            <p className="text-gray-500 leading-relaxed">
              Real-time vote counting with interactive charts and graphs updated instantly as votes are cast.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Multi-Language</h3>
            <p className="text-gray-500 leading-relaxed">
              Support for multiple languages ensures accessibility for diverse voter populations worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-24 bg-[#f8fafc] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#16a34a] font-bold tracking-widest text-sm uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-6">How SecureVote Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {/* Step 1 */}
            <div>
              <div className="text-6xl font-extrabold text-[#bbf7d0] mb-4">01</div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Register & Verify</h3>
              <p className="text-gray-500 leading-relaxed">
                Voters register with their names and phone number to complete verification. Admins approve registrations in bulk.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="text-6xl font-extrabold text-[#bbf7d0] mb-4">02</div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Cast Your Vote</h3>
              <p className="text-gray-500 leading-relaxed">
                Browse active elections, review candidates, and cast your anonymous vote with one click.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="text-6xl font-extrabold text-[#bbf7d0] mb-4">03</div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Track Results</h3>
              <p className="text-gray-500 leading-relaxed">
                Watch live results update in real time. Admins monitor turnout, detect fraud, and export reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* --- CTA / Footer Section --- */}
      <section className="py-24 bg-[#0f172a] text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Elections?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Join hundreds of organizations that trust SecureVote for their democratic processes.
          </p>
        
        </div>
      </section>

    </div>
  );
};

export default SecureVoteLandingPage;