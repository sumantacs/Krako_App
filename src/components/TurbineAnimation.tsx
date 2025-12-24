import { useState, useImperativeHandle, forwardRef } from 'react';

export interface TurbineAnimationRef {
  triggerWave: () => void;
}

const TurbineAnimation = forwardRef<TurbineAnimationRef>((props, ref) => {
  const [isWaving, setIsWaving] = useState(false);

  const playClaimSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  };

  const handleClick = () => {
    setIsWaving(true);
    playClaimSound();
    setTimeout(() => setIsWaving(false), 2000);
  };

  useImperativeHandle(ref, () => ({
    triggerWave: handleClick,
  }));

  return (
    <div
      className="relative w-72 h-72 mx-auto my-8 cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center origin-bottom">
                <div
                  className={`w-5 h-28 bg-gradient-to-b from-cyan-400 via-teal-500 to-teal-600 rounded-full shadow-lg origin-bottom transition-all duration-200 ${
                    isWaving ? 'animate-tentacle-wave' : ''
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <div
                  className={`w-4 h-20 -mt-2 bg-gradient-to-b from-teal-500 via-teal-600 to-teal-700 rounded-full shadow-lg origin-top transition-all duration-200 ${
                    isWaving ? 'animate-tentacle-wave-2' : ''
                  }`}
                  style={{
                    animationDelay: `${i * 0.1 + 0.05}s`,
                  }}
                />
                <div
                  className={`w-3 h-12 -mt-2 bg-gradient-to-b from-teal-600 to-teal-800 rounded-full shadow-md origin-top transition-all duration-200 ${
                    isWaving ? 'animate-tentacle-wave-3' : ''
                  }`}
                  style={{
                    animationDelay: `${i * 0.1 + 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600 blur-2xl transition-all duration-500 ${
              isWaving ? 'opacity-60 scale-125' : 'opacity-30 scale-100'
            } animate-pulse`}></div>
            <div className={`absolute inset-0 rounded-full border-4 border-teal-400 transition-all duration-500 ${
              isWaving ? 'scale-125 opacity-0 animate-ping' : 'scale-100 opacity-0'
            }`}></div>
            <img
              src="/img-20251204-wa0043.jpg"
              alt="Krako Octopus"
              className={`relative w-48 h-48 object-contain transition-all duration-500 ${
                isWaving
                  ? 'scale-125 rotate-12 drop-shadow-[0_0_30px_rgba(45,212,191,0.8)]'
                  : 'scale-100 rotate-0 drop-shadow-2xl'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

TurbineAnimation.displayName = 'TurbineAnimation';

export default TurbineAnimation;
