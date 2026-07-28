import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  label, 
  iconBg = 'bg-indigo-50', 
  iconColor = 'text-indigo-600', 
  svgIcon, 
  trend, 
  trendDirection = 'up' 
}) => {
  const isPositive = trendDirection === 'up';

  return (
    <div 
      aria-label={title} 
      className="bg-white border border-slate-200/80 rounded-2xl p-6 text-left flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group"
    >
      {/* Top Section: Icon & Trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={svgIcon} />
          </svg>
        </div>

        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {isPositive ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
              </svg>
            )}
            {trend}
          </span>
        )}
      </div>

      {/* Value & Label Section */}
      <div>
        <p className="text-[32px] font-bold text-slate-900 tracking-tight leading-none mb-1.5">
          {value}
        </p>
        <p className="text-[13px] font-medium text-slate-500 tracking-wide uppercase">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;