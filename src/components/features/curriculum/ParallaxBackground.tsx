'use client';

export function ParallaxBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        backgroundImage: 'url(/stage-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-black/15 absolute inset-0" />
    </div>
  );
}
