"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

const CATEGORIES = ["전체", "역사와 지명", "契(글)의 인식", "정음의 비밀", "영어 속 우리말"] as const;
type Category = (typeof CATEGORIES)[number];

interface Article {
  id?: string;
  category: string;
  title: string;
  summary: string;
  url?: string;
  date: string;
  readTime: string;
}

const staticArticles: Article[] = [
  {
    category: "契(글)의 인식",
    title: "한자(漢字)라 불러온 문자, 그 이름은 서글(書契)이었다",
    summary:
      "수천 년간 중국의 문자로 알려진 이 글자들. 하지만 그 이름 '글(契)'이 이미 우리말임을 아는가. 지명과 고문서 속에 숨어있는 진실을 추적한다.",
    date: "2026.02.28",
    readTime: "8분",
  },
  {
    category: "정음의 비밀",
    title: "세종은 '한글'이라 부른 적 없다 — 정음(正音)과 언문(諺文)의 진실",
    summary:
      "훈민정음 해례본 어디에도 '한글'이란 단어는 없다. 주시경이 만들어낸 이름이 어떻게 우리말 체계를 왜곡했는지, 박승빈의 원칙이 왜 더 옳은지 살펴본다.",
    date: "2026.02.21",
    readTime: "10분",
  },
  {
    category: "영어 속 우리말",
    title: "영어 'land'와 우리말 '땅' — 같은 뿌리에서 갈라진 언어의 증거",
    summary:
      "홍인섭의 『영어는 우리말이다』가 제시한 단서를 따라가면, 영어와 우리말이 공유하는 놀라운 어근을 발견하게 된다. 지명 속에 그 증거가 있다.",
    date: "2026.02.14",
    readTime: "12분",
  },
  {
    category: "역사와 지명",
    title: "백두산(白頭山)의 본래 이름과 서글로 읽은 진짜 의미",
    summary:
      "서글(書契)로 기록된 지명을 정음(正音)으로 제대로 읽으면, 우리 선조들이 이 땅을 어떻게 불렀는지가 드러난다. 백두산 지명의 숨겨진 뜻을 밝힌다.",
    date: "2026.02.07",
    readTime: "9분",
  },
  {
    category: "역사와 지명",
    title: "삼국사기 지명 속에 숨은 정음 — 왜곡되기 전 우리말을 복원한다",
    summary:
      "삼국사기의 지명 병기(竝記) 기록에는 당시 우리말 발음이 그대로 담겨 있다. 두음법칙이 적용되기 전 본래의 정음으로 읽으면 역사가 달라진다.",
    date: "2026.01.31",
    readTime: "11분",
  },
  {
    category: "契(글)의 인식",
    title: "갑골문(甲骨文)을 만든 것은 누구인가 — 서글의 기원을 찾아서",
    summary:
      "갑골문이 발견된 은허(殷墟). 그곳의 주인은 누구였는가. 권중혁 블로그와 '고품격 놀이터'의 통찰을 바탕으로 서글의 진짜 기원을 추적한다.",
    date: "2026.01.24",
    readTime: "15분",
  },
];

export default function ContentPreview() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const [articles, setArticles] = useState<Article[]>(staticArticles);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          // 보관된 기사(status === "archived") 제외
          const data = snap.docs
            .map((d) => ({ id: d.id, ...d.data() } as Article))
            .filter((a) => (a as Article & { status?: string }).status !== "archived");
          if (data.length > 0) setArticles(data);
        }
      } catch {
        // Firestore 불가 → 정적 기사 유지
      }
    };
    load();
  }, []);

  const filtered =
    activeCategory === "전체"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <section id="content" className="py-24 px-6 bg-parchment">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-subtitle">대표 기사</p>
          <h2 className="section-title">진실을 담은 글들</h2>
          <p
            className="text-ink/60 max-w-xl mx-auto text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
          >
            올바른 역사와 지명, 언어, 고대 사상을 알면 행복합니다.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans text-xs px-4 py-2 border transition-all duration-200 tracking-wide cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-parchment border-primary"
                  : "bg-transparent text-primary border-primary/30 hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((article) => (
            <article
              key={article.id ?? article.title}
              className="bg-white border border-primary/10 hover:border-secondary/60 hover:shadow-md transition-all duration-300 group"
            >
              {/* Category badge */}
              <div className="bg-primary px-4 py-2">
                <span className="font-sans text-xs text-secondary tracking-widest">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                {article.url ? (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h3
                      className="text-lg font-bold text-primary mb-3 leading-snug group-hover:text-accent transition-colors duration-200 cursor-pointer"
                      style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                    >
                      {article.title}
                    </h3>
                  </a>
                ) : (
                  <h3
                    className="text-lg font-bold text-primary mb-3 leading-snug"
                    style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                  >
                    {article.title}
                  </h3>
                )}
                <p
                  className="text-ink/60 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
                >
                  {article.summary}
                </p>
                <div className="flex items-center justify-between font-sans text-xs text-ink/40">
                  <span>{article.date}</span>
                  <span>읽기 {article.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* More button */}
        <div className="text-center">
          <a
            href="#subscribe"
            className="inline-block font-sans text-sm text-primary border border-primary px-8 py-3 hover:bg-primary hover:text-parchment transition-all duration-300 tracking-widest"
          >
            전체 기사 보기 →
          </a>
        </div>
      </div>
    </section>
  );
}
