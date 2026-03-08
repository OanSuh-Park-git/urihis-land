const goals = [
  {
    symbol: "歷史",
    subSymbol: "(역사)",
    title: "역사적 사건의 위치 검증",
    color: "border-accent/40",
    symbolColor: "text-accent",
    content:
      "동아시아 역사는 참담하다. 북방은 기록이 없고, 소위 한족은 부풀리거나 만들며, 일본은 훔치거나 조작하였다. 우리는 스스로 불태우고 그들에 동조하여 축소하였다. 모두 바로잡아 정체성 회복의 등불로 승화시켜 인류평화에 나서게 한다.",
    points: ["삼국의 실제 강역 지명으로 탐구", "'평양+낙랑군'설 등 논리로 격파", "사서 속 지명을 현존 지명으로 추적"],
  },
  {
    symbol: "書契",
    subSymbol: "(서글)",
    title: "우리말은 북반구 문명어의 조상말이다",
    color: "border-secondary/40",
    symbolColor: "text-secondary",
    content:
      "인류이동의 여정에서 빚어진 위대한 우리말: 무성음을 탄생시키고, 어휘 간 음소 연결로 말뜻을 선명화, 목적어를 앞세운 문법의 언어다. 영어에도 흔적이 남았다. 또 달리 무궁한 상상력의 뜻글과 비교 대상조차 없는 과학적 소리표기법인 정음을 창제하여 동양문명을 빛낸다.",
    points: ["書契(서글) — 우리 문자 [중국어 no]", "正音(정음)— 세종 창제원리로 복원 [한글 no]", "契(글)의 발음도 영어의 뿌리도 우리말"],
  },
  {
    symbol: "弘益",
    subSymbol: "(홍익)",
    title: "홍익인간의 인류 보편화가 세계 종교의 종착점이다",
    color: "border-parchment/20",
    symbolColor: "text-parchment/70",
    content:
      "三一神誥(삼일신고)와 天符經(천부경)은 짧지만 오묘하다. 이는 인류가 공유해야 할 깨달음을 향한 가르침의 結晶(결정)이다. 그것으로 이해하여 닿는 점은 이 땅 모든 존재의 평화공존, '人間(인간)' 곧 현대어인 '사회'를 풍요롭게 한다는 弘益人間(홍익인간)의 진정한 뜻이다.",
    points: ["천부경·삼일신고의 현대적 해석", "홍익인간 이념의 보편성과 세계화", "정신문명으로서의 한국 고대 사상"],
  },
];

const tags = [
  "#역사왜곡바로잡기",
  "#식민사관극복",
  "#서글(書契)",
  "#정음",
  "#홍익인간",
  "#천부경",
  "#삼일신고",
  "#우리역사와땅",
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-primary text-parchment">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold text-parchment leading-tight"
            style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
          >
            &lsquo;우리역사와 땅&rsquo;의 추구 명제 셋
          </h2>
        </div>

        {/* Goal cards */}
        <div className="space-y-6 mb-16">
          {goals.map((goal, i) => (
            <div
              key={i}
              className={`border ${goal.color} bg-parchment/5 p-8 hover:bg-parchment/10 transition-colors duration-300`}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Symbol */}
                <div className="flex-shrink-0 text-center md:w-36">
                  <div
                    className={`text-5xl font-bold leading-tight ${goal.symbolColor}`}
                    style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                  >
                    {goal.symbol}
                  </div>
                  <div
                    className={`text-xl font-bold mt-1 ${goal.symbolColor}`}
                    style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                  >
                    {goal.subSymbol}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className="text-xl md:text-2xl font-bold text-parchment mb-4"
                    style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                  >
                    {goal.title}
                  </h3>
                  <p
                    className="text-parchment/65 leading-relaxed mb-5 text-sm md:text-base"
                    style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
                  >
                    {goal.content}
                  </p>
                  {/* Sub-points */}
                  <ul className="flex flex-wrap gap-3">
                    {goal.points.map((pt) => (
                      <li
                        key={pt}
                        className="font-sans text-xs border border-parchment/20 text-parchment/60 px-3 py-1 tracking-wide"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 justify-center">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs text-secondary border border-secondary/30 px-4 py-2 tracking-wide hover:border-secondary hover:text-parchment transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
