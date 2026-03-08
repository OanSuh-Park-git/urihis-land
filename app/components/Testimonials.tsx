const testimonials = [
  {
    quote:
      "권중혁 블로그를 통해 처음 서글(書契)의 개념을 접했습니다. '우리역사와 땅'은 그 통찰을 더욱 깊이 파고들어, 지명과 역사를 결합한 방식이 정말 신선합니다.",
    author: "김○○",
    role: "역사 연구 동호회원, 고품격 놀이터 구독자",
  },
  {
    quote:
      "『영어는 우리말이다』를 읽고 많은 것을 깨달았는데, 이 신문은 그 주장을 실제 지명과 고문서로 뒷받침해 주어 더욱 설득력이 있습니다. 정음(正音)으로 읽은 지명 해석은 충격적이었습니다.",
    author: "이○○",
    role: "언어학 관심자, 홍인섭 저서 독자",
  },
  {
    quote:
      "주시경의 문법이 우리말을 얼마나 왜곡했는지, 박승빈의 체계가 왜 더 옳은지 이렇게 명확하게 설명해준 매체는 처음입니다. 구독 이후 매주 새 기사가 기다려집니다.",
    author: "박○○",
    role: "교사, 정음 원칙 관심자",
  },
];

const partners = [
  { name: "고품격 놀이터", desc: "유튜브 채널", href: "#" },
  { name: "권중혁 블로그", desc: "역사·언어 연구", href: "https://blog.naver.com/joonghyuckk" },
  { name: "영어는 우리말이다", desc: "홍인섭 저", href: "#" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-parchment">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-subtitle">독자 후기 · 연대</p>
          <h2 className="section-title">진실을 함께 찾는 사람들</h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-primary/10 p-8 relative">
              {/* Quote mark */}
              <div
                className="absolute top-4 right-6 text-5xl text-secondary/20 leading-none select-none"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                aria-hidden
              >
                &ldquo;
              </div>
              <p
                className="text-ink/70 text-sm leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p
                  className="font-bold text-primary text-sm"
                  style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                >
                  {t.author}
                </p>
                <p className="font-sans text-xs text-secondary mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Partner channels */}
        <div className="border-t border-primary/10 pt-16 text-center">
          <p className="section-subtitle mb-8">함께하는 채널</p>
          <div className="flex flex-wrap gap-6 justify-center">
            {partners.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-primary/20 hover:border-secondary px-8 py-5 text-center transition-all duration-200 group"
              >
                <p
                  className="font-bold text-primary group-hover:text-accent transition-colors duration-200 mb-1"
                  style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                >
                  {p.name}
                </p>
                <p className="font-sans text-xs text-ink/40">{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
