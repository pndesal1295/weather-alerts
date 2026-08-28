import { AlertTriangle } from 'lucide-react';

export default function AlertBanner({ alerts }) {
  // Combine all alerts into one massive string for the marquee
  const alertString = alerts.map(alert => `${alert.event} — ${alert.headline || alert.desc}`).join(' /// ');

  // Create an array to repeat the text so the marquee never runs out of content on wide screens
  const marqueeContent = Array(4).fill(alertString);

  return (
    <div className="w-full bg-red-600 text-black flex overflow-hidden py-4 border-black relative">
      <div className="flex whitespace-nowrap animate-marquee w-[200%]">
        {marqueeContent.map((text, index) => (
          <div key={index} className="flex items-center mx-8 w-1/2">
            <AlertTriangle className="w-8 h-8 mr-4 inline-block shrink-0" strokeWidth={3} />
            <span className="font-black text-2xl md:text-4xl tracking-tighter uppercase shrink-0">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}