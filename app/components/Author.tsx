export default function Author() {
  return (
    <section id="author" className="py-24 px-6 bg-primary/5 border-y border-primary/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 md:w-52 md:h-52 bg-primary flex items-center justify-center border-4 border-secondary/40">
              <span
                className="text-6xl text-secondary"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
              >
                밝
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="section-subtitle">필진 소개</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-primary mb-2"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              밝완서
            </h2>
            <p className="font-sans text-secondary text-sm tracking-widest mb-6">
              인터넷 신문 &lsquo;우리역사와 땅&rsquo; 발행인
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
              <div className="h-px w-12 bg-secondary" />
              <span className="text-secondary text-sm">역사・언어・정신</span>
              <div className="h-px w-12 bg-secondary" />
            </div>

            {/* Philosophy quote */}
            <blockquote
              className="text-primary/80 text-base md:text-lg leading-relaxed mb-8 border-l-4 border-accent pl-6 italic"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              &ldquo;正史(정사)에 기록된 지명 추적으로 역사의 현장, 곧 바른 영역 탐색이 가능합니다. 영어 속에 우리말이 남아 있듯이 契(글)의 고대 발음은 우리말이고, 순 우리말이라는 訓(훈)조차 글로 이루어져. 함께 연구하면 역사 복원이 쉬워집니다.&rdquo;
            </blockquote>

            {/* Affiliations */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[
                "서글(書契) 연구",
                "정음(正音) 복원",
                "지명 어원 탐구",
                "박승빈 훈민정음 체계",
              ].map((badge) => (
                <span key={badge} className="tag">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Second author */}
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mt-16 pt-16 border-t border-primary/10">
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 md:w-52 md:h-52 bg-primary flex items-center justify-center border-4 border-secondary/40">
              <span
                className="text-6xl text-secondary"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
              >
                재
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="section-subtitle">필진 소개</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-primary mb-2"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              오재성
            </h2>
            <p className="font-sans text-secondary text-sm tracking-widest mb-6">
              대륙의 삼국 영역 최초 발견 연구자
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
              <div className="h-px w-12 bg-secondary" />
              <span className="text-secondary text-sm">역사・언어・정신</span>
              <div className="h-px w-12 bg-secondary" />
            </div>

            {/* Philosophy quote */}
            <blockquote
              className="text-primary/80 text-base md:text-lg leading-relaxed mb-8 border-l-4 border-accent pl-6 italic"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              &ldquo;삼국사(세칭 삼국사기)는 고구리 705년, 백제 678년, 신라 992년, 합하여 2,375년의 비교 대상이 없는 위대한 정사다. 이 3국의 흥망성쇠가 대륙과 이 땅의 연계된 역사임을 최초로 밝혀 1989년 &lsquo;숨겨진 역사를 찾아서&rsquo;를 출판하였다.&rdquo;
            </blockquote>

            {/* Affiliations */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[
                "동아시아의 역사",
                "글은 우리 문자",
                "글의 훈이 옛 우리 발음",
              ].map((badge) => (
                <span key={badge} className="tag">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Third author */}
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mt-16 pt-16 border-t border-primary/10">
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 md:w-52 md:h-52 bg-primary flex items-center justify-center border-4 border-secondary/40">
              <span
                className="text-6xl text-secondary"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
              >
                혁
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="section-subtitle">필진 소개</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-primary mb-2"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              권중혁
            </h2>
            <p className="font-sans text-secondary text-sm tracking-widest mb-6">
              유라시아의 기층언어가 우리말
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
              <div className="h-px w-12 bg-secondary" />
              <span className="text-secondary text-sm">언어・유전・인류</span>
              <div className="h-px w-12 bg-secondary" />
            </div>

            {/* Philosophy quote */}
            <blockquote
              className="text-primary/80 text-base md:text-lg leading-relaxed mb-8 border-l-4 border-accent pl-6 italic"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              &ldquo;소위 漢語(한어) 불경의 난해함을 극복하려 산스크리트어를 직접 연구하다, 그 문법이 우리말과 유사함에 놀란다. 불일치 증가는 음소의 소실 크기와 일치하고, 소실은 우리와 거리가 멀어짐과 유전자 변이 정도에 비례함을 발견한다.&rdquo;
            </blockquote>

            {/* Affiliations */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[
                "우리말, 유라시아어의 모태",
                "언어와 유전자 분기의 동질성",
                "음소와 강제 문법",
              ].map((badge) => (
                <span key={badge} className="tag">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
