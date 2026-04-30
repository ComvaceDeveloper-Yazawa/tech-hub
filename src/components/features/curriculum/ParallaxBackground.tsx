'use client';

export function ParallaxBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {/* PC用背景（md以上） */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: 'url(/stage-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* スマホ用背景（md未満） */}
      <div
        className="absolute inset-0 block md:hidden"
        style={{
          backgroundImage: 'url(/stage-bg-mobile.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="bg-black/15 absolute inset-0" />
    </div>
  );
}
