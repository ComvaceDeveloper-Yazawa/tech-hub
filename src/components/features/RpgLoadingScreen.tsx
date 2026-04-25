'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '@/contexts/loading/LoadingContext';

const LOADING_MESSAGES = [
  'データを読み込んでいます...',
  'サーバーと通信中...',
  '魔法陣を展開中...',
  '記録を保存しています...',
  '世界を更新中...',
];

const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

export function RpgLoadingScreen() {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [runeAngles, setRuneAngles] = useState<number[]>([]);

  // ローディング開始時に少し遅延させてチラつきを防ぐ
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    if (isLoading) {
      showTimer = setTimeout(() => setVisible(true), 100);
    } else {
      hideTimer = setTimeout(() => setVisible(false), 300);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading]);

  // メッセージをランダムに切り替え
  useEffect(() => {
    if (!visible) return;
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [visible]);

  // プログレスバーアニメーション
  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p; // 90%で止める（完了まで待つ）
        return p + Math.random() * 8;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [visible]);

  // ルーン文字の初期角度
  useEffect(() => {
    setRuneAngles(RUNES.map((_, i) => (i / RUNES.length) * 360));
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at center, #0d0d1a 0%, #000005 100%)',
      }}
    >
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative flex flex-col items-center gap-8">
        {/* 魔法陣 */}
        <div className="relative flex items-center justify-center">
          {/* 外側の回転リング */}
          <div
            className="absolute h-48 w-48 rounded-full border border-indigo-500/30"
            style={{ animation: 'spin 8s linear infinite' }}
          >
            {runeAngles.map((angle, i) => (
              <span
                key={i}
                className="absolute text-xs text-indigo-400/60"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateY(-96px) rotate(-${angle}deg)`,
                  transformOrigin: '0 0',
                }}
              >
                {RUNES[i]}
              </span>
            ))}
          </div>

          {/* 中間リング（逆回転） */}
          <div
            className="absolute h-36 w-36 rounded-full border border-purple-500/40"
            style={{ animation: 'spin 5s linear infinite reverse' }}
          />

          {/* 内側の六角形グロー */}
          <div
            className="absolute h-24 w-24 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />

          {/* 中央のシンボル */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* 六芒星 */}
              <polygon
                points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                fill="none"
                stroke="rgba(139,92,246,0.8)"
                strokeWidth="2"
                style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
              />
              <circle
                cx="50"
                cy="50"
                r="8"
                fill="rgba(139,92,246,0.9)"
                style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}
              />
            </svg>
          </div>
        </div>

        {/* タイトル */}
        <div className="text-center">
          <h2
            className="mb-1 text-2xl font-bold tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc, #818cf8)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 3s ease-in-out infinite',
            }}
          >
            YazawaBlog
          </h2>
          <p className="text-xs tracking-[0.3em] text-indigo-400/60 uppercase">
            Loading...
          </p>
        </div>

        {/* プログレスバー */}
        <div className="w-64">
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                boxShadow: '0 0 8px rgba(139,92,246,0.8)',
              }}
            />
          </div>
          <p className="text-center text-xs tracking-wider text-indigo-300/70">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
