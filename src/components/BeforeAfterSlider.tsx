import { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, Instagram } from "lucide-react";

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeStats = {
    metrics: [
      { label: "Följare", value: "1,234", change: "-3%", trending: "down" as const },
      { label: "Engagemang", value: "2.1%", change: "-0.8%", trending: "down" as const },
      { label: "Räckvidd", value: "3.2k", change: "-12%", trending: "down" as const },
      { label: "CTR", value: "0.9%", change: "-0.3%", trending: "down" as const },
    ]
  };

  const afterStats = {
    metrics: [
      { label: "Följare", value: "5,847", change: "+124%", trending: "up" as const },
      { label: "Engagemang", value: "8.4%", change: "+6.3%", trending: "up" as const },
      { label: "Räckvidd", value: "15.2k", change: "+12k", trending: "up" as const },
      { label: "CTR", value: "3.8%", change: "+2.9%", trending: "up" as const },
    ]
  };

  // Scroll detection and initial animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Quick animation: 50% -> 100% -> 0% -> 50%
            let frame = 0;
            const animateOnce = setInterval(() => {
              frame++;
              if (frame <= 10) {
                // 50% to 100% (10 frames)
                setSliderPosition(50 + (frame * 5));
              } else if (frame <= 30) {
                // 100% to 0% (20 frames)
                setSliderPosition(100 - ((frame - 10) * 5));
              } else if (frame <= 40) {
                // 0% to 50% (10 frames)
                setSliderPosition((frame - 30) * 5);
              } else {
                clearInterval(animateOnce);
                setSliderPosition(50);
                setHasAnimated(true);
              }
            }, 50); // Slower animation - increased from 30ms to 50ms
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden select-none bg-card rounded-lg min-h-[350px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Label in Center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div 
          className={`font-semibold text-sm uppercase tracking-wide transition-colors duration-300 ${
            sliderPosition < 50 ? "text-destructive" : "text-accent"
          }`}
        >
          {sliderPosition < 50 ? "Före" : "Efter"}
        </div>
      </div>

      {/* Before Stats Card - Full Dashboard style */}
      <div className="absolute inset-0 p-6">
        {/* Platform header */}
        <div className="flex items-center gap-3 mb-6 mt-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Instagram</h2>
            <p className="text-sm text-muted-foreground">Senaste 30 dagarna</p>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {beforeStats.metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* After Stats Card - Revealed by slider */}
      <div 
        className="absolute inset-0 p-6 bg-card"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        {/* Platform header */}
        <div className="flex items-center gap-3 mb-6 mt-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Instagram</h2>
            <p className="text-sm text-muted-foreground">Senaste 30 dagarna</p>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {afterStats.metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute bottom-12 z-30 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Handle circle with integrated vertical lines */}
        <div className="relative left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary shadow-elegant flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-white"></div>
            <div className="w-0.5 h-4 bg-white"></div>
          </div>
        </div>
        
        {/* Vertical line extending upward */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-1 h-[calc(100vh-200px)] max-h-[300px] bg-primary pointer-events-none"></div>
      </div>

      {/* Helper Text */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-muted-foreground text-sm pointer-events-none z-20">
        Dra slidern för att se förbättringen
      </div>
    </div>
  );
};

export default BeforeAfterSlider;