'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '@/contexts/loading/LoadingContext';

const LOADING_MESSAGES = [
  'データを読み込んでいます...',
  'サーバーと通信中...',
  'ネットワークに接続中...',
  '記録を保存しています...',
  'システムを更新中...',
];

export function RpgLoadingScreen() {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (!visible) return;
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 8;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at center, #0a0a1a 0%, #000008 100%)',
      }}
    >
      {/* 回路基板風グリッド背景 */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="0.5"
              />
              <circle cx="0" cy="0" r="2" fill="#00d4ff" />
              <circle cx="80" cy="0" r="2" fill="#00d4ff" />
              <circle cx="0" cy="80" r="2" fill="#00d4ff" />
              <path
                d="M 40 0 L 40 30 L 60 30"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="0.5"
              />
              <path
                d="M 0 40 L 20 40 L 20 60"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="0.5"
              />
              <circle cx="40" cy="30" r="1.5" fill="#00d4ff" />
              <circle cx="20" cy="40" r="1.5" fill="#00d4ff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* パーティクル */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '3px',
              height: '3px',
              background:
                i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#7c3aed' : '#ffffff',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `float-particle ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative flex flex-col items-center gap-8">
        {/* ウルフアイコン */}
        <div className="relative flex items-center justify-center">
          {/* 外側グローリング */}
          <div
            className="absolute h-52 w-52 rounded-full"
            style={{
              background:
                'radial-gradient(circle, transparent 45%, rgba(0,212,255,0.08) 60%, transparent 75%)',
              animation: 'pulse-ring 3s ease-in-out infinite',
            }}
          />
          {/* 回転する点線リング */}
          <div
            className="absolute h-44 w-44 rounded-full"
            style={{
              border: '1px dashed rgba(0,212,255,0.4)',
              animation: 'spin-slow 12s linear infinite',
            }}
          />
          {/* 逆回転リング */}
          <div
            className="absolute h-36 w-36 rounded-full"
            style={{
              border: '1px solid rgba(124,58,237,0.5)',
              animation: 'spin-slow 8s linear infinite reverse',
              boxShadow: '0 0 12px rgba(124,58,237,0.3)',
            }}
          />

          {/* ウルフSVGアイコン */}
          <div
            className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle at 40% 35%, #1a1a3e 0%, #0a0a1a 100%)',
              border: '2px solid rgba(0,212,255,0.6)',
              boxShadow:
                '0 0 30px rgba(0,212,255,0.4), inset 0 0 20px rgba(0,212,255,0.05)',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="h-20 w-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 耳（左） */}
              <polygon
                points="22,48 15,20 35,38"
                fill="#1a1a3e"
                stroke="#00d4ff"
                strokeWidth="1.5"
              />
              {/* 耳（右） */}
              <polygon
                points="78,48 85,20 65,38"
                fill="#1a1a3e"
                stroke="#00d4ff"
                strokeWidth="1.5"
              />
              {/* 頭部シルエット */}
              <ellipse
                cx="50"
                cy="55"
                rx="28"
                ry="26"
                fill="#12122a"
                stroke="#00d4ff"
                strokeWidth="1.5"
              />
              {/* 鼻筋 */}
              <path
                d="M 50 42 L 50 65"
                stroke="rgba(0,212,255,0.3)"
                strokeWidth="1"
              />
              {/* 目（左）- サイバー風 */}
              <ellipse
                cx="38"
                cy="52"
                rx="5"
                ry="4"
                fill="#0a0a1a"
                stroke="#00d4ff"
                strokeWidth="1.5"
              />
              <ellipse
                cx="38"
                cy="52"
                rx="2.5"
                ry="2.5"
                fill="#00d4ff"
                style={{ filter: 'blur(0.5px)' }}
              />
              <ellipse cx="38" cy="52" rx="1" ry="1" fill="white" />
              {/* 目（右）- サイバー風 */}
              <ellipse
                cx="62"
                cy="52"
                rx="5"
                ry="4"
                fill="#0a0a1a"
                stroke="#00d4ff"
                strokeWidth="1.5"
              />
              <ellipse
                cx="62"
                cy="52"
                rx="2.5"
                ry="2.5"
                fill="#00d4ff"
                style={{ filter: 'blur(0.5px)' }}
              />
              <ellipse cx="62" cy="52" rx="1" ry="1" fill="white" />
              {/* 鼻 */}
              <ellipse cx="50" cy="65" rx="4" ry="2.5" fill="#7c3aed" />
              {/* 口 */}
              <path
                d="M 44 68 Q 50 73 56 68"
                fill="none"
                stroke="rgba(0,212,255,0.5)"
                strokeWidth="1.2"
              />
              {/* 回路ライン（額） */}
              <path
                d="M 35 44 L 30 40 L 25 40"
                fill="none"
                stroke="rgba(0,212,255,0.4)"
                strokeWidth="0.8"
              />
              <path
                d="M 65 44 L 70 40 L 75 40"
                fill="none"
                stroke="rgba(0,212,255,0.4)"
                strokeWidth="0.8"
              />
              <circle cx="25" cy="40" r="1.5" fill="rgba(0,212,255,0.6)" />
              <circle cx="75" cy="40" r="1.5" fill="rgba(0,212,255,0.6)" />
              {/* 額の回路 */}
              <path
                d="M 42 46 L 42 42 L 58 42 L 58 46"
                fill="none"
                stroke="rgba(124,58,237,0.5)"
                strokeWidth="0.8"
              />
              <circle cx="50" cy="42" r="1.5" fill="rgba(124,58,237,0.7)" />
            </svg>
          </div>

          {/* コーナーの光点 */}
          {[0, 90, 180, 270].map((angle) => (
            <div
              key={angle}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background: '#00d4ff',
                boxShadow: '0 0 8px #00d4ff',
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateY(-88px)`,
                transformOrigin: '0 0',
                animation: `blink ${1 + angle / 180}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* タイトル */}
        <div className="text-center">
          <h2
            className="mb-1 text-2xl font-bold tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #00d4ff)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 3s ease-in-out infinite',
              textShadow: 'none',
            }}
          >
            Tech Hub
          </h2>
          <p
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(0,212,255,0.5)' }}
          >
            Loading...
          </p>
        </div>

        {/* プログレスバー */}
        <div className="w-64">
          <div
            className="mb-2 h-0.5 overflow-hidden rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                boxShadow: '0 0 10px rgba(0,212,255,0.8)',
              }}
            />
          </div>
          <p
            className="text-center text-xs tracking-wider"
            style={{ color: 'rgba(0,212,255,0.5)' }}
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
