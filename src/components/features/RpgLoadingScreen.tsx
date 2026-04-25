'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useLoading } from '@/contexts/loading/LoadingContext';

const LOADING_MESSAGES = [
  'データを読み込んでいます...',
  'サーバーと通信中...',
  'ネットワークに接続中...',
  '記録を保存しています...',
  'システムを更新中...',
];

const MIN_DISPLAY_MS = 3000;

export function RpgLoadingScreen() {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const shownAtRef = useRef<number | null>(null);
  const minElapsedRef = useRef(false);
  const loadingDoneRef = useRef(true);

  // isLoading の変化を追跡
  useEffect(() => {
    if (isLoading) {
      // 表示開始
      shownAtRef.current = Date.now();
      minElapsedRef.current = false;
      loadingDoneRef.current = false;
      setVisible(true);
    } else {
      // ローディング処理は完了した
      loadingDoneRef.current = true;
      // 最低表示時間も経過済みなら即非表示
      if (minElapsedRef.current) {
        setVisible(false);
        shownAtRef.current = null;
      }
    }
  }, [isLoading]);

  // 最低3秒タイマー
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      minElapsedRef.current = true;
      // ローディング処理も完了済みなら非表示
      if (loadingDoneRef.current) {
        setVisible(false);
        shownAtRef.current = null;
      }
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [visible]);

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center opacity-100 transition-opacity duration-300`}
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
              top: `${(i * 37 + 11) % 100}%`,
              left: `${(i * 53 + 7) % 100}%`,
              opacity: 0.4,
              animation: `float-particle ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i % 3) * 0.8}s`,
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
            className="absolute h-56 w-56 rounded-full"
            style={{
              background:
                'radial-gradient(circle, transparent 40%, rgba(0,212,255,0.12) 60%, transparent 75%)',
              animation: 'pulse-ring 3s ease-in-out infinite',
            }}
          />
          {/* 回転する点線リング */}
          <div
            className="absolute h-48 w-48 rounded-full"
            style={{
              border: '1px dashed rgba(0,212,255,0.4)',
              animation: 'spin-slow 12s linear infinite',
            }}
          />
          {/* 逆回転リング */}
          <div
            className="absolute h-40 w-40 rounded-full"
            style={{
              border: '1px solid rgba(124,58,237,0.5)',
              animation: 'spin-slow 8s linear infinite reverse',
              boxShadow: '0 0 12px rgba(124,58,237,0.3)',
            }}
          />

          {/* ウルフ画像 */}
          <div
            className="relative z-10 h-32 w-32 overflow-hidden rounded-full"
            style={{
              boxShadow:
                '0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2)',
            }}
          >
            <Image
              src="/wolf-icon.jpeg"
              alt="Tech Hub"
              width={128}
              height={128}
              className="h-full w-full object-cover"
              priority
            />
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
                transform: `rotate(${angle}deg) translateY(-96px)`,
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
