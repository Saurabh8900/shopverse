import { useState, useEffect } from 'react';
import { getTimeLeft } from '../utils/helpers';

const Segment = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center font-display font-bold text-xl text-brand-400 border border-brand-500/20">
      {String(value).padStart(2, '0')}
    </div>
    <span className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{label}</span>
  </div>
);

const Colon = () => <span className="text-brand-500 font-bold text-xl pb-4 animate-pulse">:</span>;

export default function CountdownTimer({ endDate, className = '' }) {
  const [time, setTime] = useState(getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (time.expired) return <span className="text-white/40 text-sm">Sale ended</span>;

  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <Segment value={time.h} label="hrs"  />
      <Colon />
      <Segment value={time.m} label="min"  />
      <Colon />
      <Segment value={time.s} label="sec"  />
    </div>
  );
}
