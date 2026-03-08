export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-parchment py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-bold text-parchment mb-3"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              우리역사와 땅
            </h3>
            <p className="font-sans text-secondary text-xs tracking-widest mb-4">
              밝완서의 인터넷 신문
            </p>
            <p
              className="text-parchment/50 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              서글(書契)과 정음(正音)으로
              <br />
              잃어버린 우리말과 역사를 복원합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs text-secondary tracking-[0.3em] uppercase mb-5">
              메뉴
            </h4>
            <ul className="space-y-3">
              {[
                { label: "철학", href: "#about" },
                { label: "기사", href: "#content" },
                { label: "필진 소개", href: "#author" },
                { label: "구독", href: "#subscribe" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-parchment/60 hover:text-secondary transition-colors duration-200 tracking-wide"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners & Contact */}
          <div>
            <h4 className="font-sans text-xs text-secondary tracking-[0.3em] uppercase mb-5">
              추천 채널
            </h4>
            <ul className="space-y-3 mb-8">
              {[
                {
                  label: "고품격 놀이터 (유튜브)",
                  href: "#",
                },
                {
                  label: "권중혁 블로그",
                  href: "https://blog.naver.com/joonghyuckk",
                },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-parchment/60 hover:text-secondary transition-colors duration-200"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="font-sans text-xs text-secondary tracking-[0.3em] uppercase mb-3">
              문의
            </h4>
            <a
              href="mailto:contact@ourhistory.kr"
              className="font-sans text-sm text-parchment/60 hover:text-secondary transition-colors duration-200"
            >
              contact@ourhistory.kr
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-parchment/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-parchment/30">
            © {currentYear} 우리역사와 땅. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["개인정보처리방침", "구독 해지"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans text-xs text-parchment/30 hover:text-parchment/60 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
