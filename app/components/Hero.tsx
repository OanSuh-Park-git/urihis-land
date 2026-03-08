"use client";

import Image from "next/image";
import { useAuth } from "../lib/AuthContext";

export default function Hero() {
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();

  const handleScrollToSubscribe = () => {
    document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" });
  };

  const missions = [
    {
      title: "역사 왜곡 바로잡기",
      desc: "제도권 국사의 파멸적 왜곡을 잔존한 사서 기록과 지명으로 바로잡는다",
    },
    {
      title: "언어와 문자의 진실",
      desc: "書契(서글)‧正音(정음)의 제자원리를 찾아 세계 모든 언어의 발전을 돕는다",
    },
    {
      title: "홍익인간 사상의 세계화",
      desc: "삼일신고‧천부경을 바탕으로 홍익인간 재세이화하므로 세계평화를 구축한다",
    },
  ];

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='5' y='42' font-size='38' fill='%23B5996E'%3E契%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/60" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20">
        {/* Sub-label */}
        <p
          className="text-secondary tracking-[0.3em] text-base md:text-xl text-center mb-4"
          style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
        >
          밝완서의 인터넷 신문
        </p>

        {/* Main headline */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-parchment leading-tight text-center mb-6"
          style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
        >
          장엄한 우리 역사의 본질 탐색,
          <br />
          <span className="text-secondary">인류의 미래 행복</span>을 선도한다
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-secondary/60" />
          <span
            className="text-secondary text-xl md:text-2xl"
            style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
          >
            우리역사와 땅
          </span>
          <div className="h-px w-16 bg-secondary/60" />
        </div>

        {/* Sub-copy */}
        <p
          className="text-parchment/70 text-base md:text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
        >
          동양 삼국의 제도권 사학계가 왜곡하고 축소한 우리 역사의 진실,
          <br className="hidden md:block" />
          書契(서글)과 正音(정음) 창제의 숨겨진 원리,
          <br className="hidden md:block" />
          그리고 삼일신고‧천부경의 홍익인간 정신을 온 세계에 알립니다.
        </p>

        {/* 3 Mission pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {missions.map((m) => (
            <div
              key={m.title}
              className="border border-secondary/25 bg-parchment/5 px-6 py-6 text-center hover:border-secondary/60 hover:bg-parchment/10 transition-all duration-300"
            >
              <h3
                className="text-parchment font-bold text-base mb-2"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
              >
                {m.title}
              </h3>
              <p
                className="text-parchment/55 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
              >
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA + 로그인 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={handleScrollToSubscribe} className="btn-primary cursor-pointer">
            진실의 역사, 지금 구독하기
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? ""}
                  width={36}
                  height={36}
                  className="rounded-full border border-secondary/50"
                />
              )}
              <span className="font-sans text-sm text-parchment/80">
                {user.displayName}
                {isAdmin && (
                  <a href="/admin" className="ml-2 font-sans text-xs bg-secondary text-primary px-2 py-0.5 rounded-sm hover:opacity-80 transition-opacity">
                    관리자
                  </a>
                )}
              </span>
              <button
                onClick={signOut}
                className="font-sans text-xs text-secondary border border-secondary/40 px-3 py-1 hover:bg-secondary/10 transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 font-sans text-sm text-parchment border border-parchment/30 px-5 py-3 hover:border-secondary hover:text-secondary transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google로 로그인
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
