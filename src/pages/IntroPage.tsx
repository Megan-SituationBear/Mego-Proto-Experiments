import React from 'react';

interface IntroPageProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  onViewPricing?: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onLogin }) => {
  // Enter prototype = login action
  const handleEnterPrototype = () => {
    if (onLogin) {
      onLogin();
    }
  };
  return (
    <div className="min-h-screen bg-[#0e0330] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Full Proto Button - Top Right */}
      <button 
        onClick={handleEnterPrototype}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 bg-[#193cb8] hover:bg-[#1e4dd8] text-white px-6 sm:px-8 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition-all duration-200 border border-[#193cb8] hover:border-[#1e4dd8] shadow-lg hover:shadow-xl"
      >
        Full Proto
      </button>

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-12 max-w-6xl mx-auto">
        {/* Situation Bear Logo + Header */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {/* Logo */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
            <img 
              src="https://raw.githubusercontent.com/Megan-SituationBear/Mego-Proto-Experiments/main/situation-bear-logo.png" 
              alt="Situation Bear Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">SB</div>';
              }}
            />
          </div>

          {/* Brand Name */}
          <div className="text-center">
            <h1 className="text-white text-xl sm:text-2xl tracking-wider font-serif" style={{ letterSpacing: '-0.05em', lineHeight: '1.44' }}>
              SITUATION BEAR DESIGN
            </h1>
            <p className="text-[#f6b380] text-xs sm:text-sm tracking-wide mt-1" style={{ letterSpacing: '0.02em', lineHeight: '0.784' }}>
              DESIGNS TO INFORM AN EASIER FUTURE
            </p>
          </div>
        </div>

        {/* Large Client Name */}
        <div className="text-center px-4">
          <h2 className="text-white text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight" style={{ letterSpacing: '-0.05em', lineHeight: '0.98' }}>
            COPADO
          </h2>
        </div>

        {/* Goals Text - Clickable */}
        <button 
          onClick={handleEnterPrototype}
          className="text-center max-w-4xl px-4 hover:opacity-80 transition-opacity duration-200 cursor-pointer group"
        >
          <p className="text-slate-300 text-sm sm:text-base md:text-lg tracking-wide leading-relaxed group-hover:text-white transition-colors" style={{ letterSpacing: '0.02em' }}>
            GOALS: ADJUST INFORMATION ARCHITECTURE TO BE MORE INTUITIVE.<br className="hidden sm:block" />
            STRIKE A BALANCE OF WORK 'IN THE MOMENT' AND LASTING WORK.<br className="hidden sm:block" />
            CREATE PATHWAYS TO EMBED COPADO CAPABILITIES WHERE PEOPLE WORK.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-4 tracking-wide group-hover:text-slate-300 transition-colors">
            LOGGED OUT VIEW · LOGGED IN, NEW USER · WITH QUICK ACTIONS<br className="hidden sm:block" />
            CONTEXTUAL, SELF-CONTAINED AI INPUT
          </p>
        </button>

        {/* Bottom CTA Button */}
        <button 
          onClick={handleEnterPrototype}
          className="bg-[#193cb8] hover:bg-[#1e4dd8] text-white px-8 sm:px-12 py-3 sm:py-4 rounded text-sm sm:text-base font-medium transition-all duration-200 border border-[#193cb8] hover:border-[#1e4dd8] shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{ letterSpacing: '-0.02em' }}
        >
          Full Proto
        </button>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>
    </div>
  );
};

export default IntroPage;
