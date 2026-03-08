"use client";

import { useState } from "react";

const faqs = [
  {
    q: "'우리역사와 땅'은 왜 창간됐나요?",
    a: "대한민국 역사학계의 90% 이상은 일제강점기에 이식된 식민사관과 사대주의적 역사관을 아직도 벗어나지 못하고 있습니다. '우리역사와 땅'은 이 구조적 왜곡을 실증 사료와 지명 분석으로 바로잡고, 동시에 언어(서글·정음)의 진실과 삼일신고·천부경에 담긴 홍익인간 정신문명을 세상에 알리기 위해 창간했습니다.",
  },
  {
    q: "천부경과 삼일신고가 역사와 어떤 관계가 있나요?",
    a: "천부경(天符經)과 삼일신고(三一神誥)는 단순한 종교 문헌이 아니라, 우리 선조의 세계관과 우주론을 담은 정신문명의 원형입니다. 이 문헌들에 기록된 홍익인간(弘益人間) 이념은 오늘날 인류가 공유해야 할 보편적 가치입니다. '우리역사와 땅'은 이 고대 정신문명을 현대적 언어로 해석하고 세계에 알리는 것을 세 번째 사명으로 삼습니다.",
  },
  {
    q: "왜 '한자' 대신 '서글(書契)'이라고 불러야 하나요?",
    a: "이른바 '한자(漢字)'라는 명칭은 중국 중심 역사관에서 붙여진 이름입니다. 이 문자를 뜻하는 본래 이름 '글(契)'은 명백한 우리말입니다. '서글(書契)'이란 '글을 쓴 것'이라는 뜻의 우리말로, 이 문자 체계가 우리 선조의 것임을 바르게 알리기 위해 이 명칭을 사용합니다.",
  },
  {
    q: "주시경의 한글 체계 대신 박승빈의 훈민정음 체계를 따라야 하는 이유는 무엇인가요?",
    a: "세종이 창제한 훈민정음 해례본 어디에도 두음법칙이나 구개음화 같은 규칙은 없습니다. 이는 20세기 초 주시경이 인위적으로 도입한 것으로, 본래의 정음 원칙을 왜곡합니다. 박승빈은 세종의 정음 원칙을 충실히 따랐습니다. 우리는 왜곡된 문법이 아닌, 세종의 참된 창제 원리로 돌아가야 합니다.",
  },
  {
    q: "뉴스레터 구독은 무료인가요?",
    a: "네, 완전히 무료입니다. 구독하시면 새 기사가 발행될 때마다 이메일로 받아보실 수 있으며, 구독 즉시 관련 소책자 PDF를 무료로 받으실 수 있습니다.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-primary/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">자주 묻는 질문</p>
          <h2 className="section-title">FAQ</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-primary/15 bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-primary/5 transition-colors duration-200"
                aria-expanded={openIndex === i}
              >
                <span
                  className="font-bold text-primary text-sm md:text-base leading-snug"
                  style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
                >
                  {faq.q}
                </span>
                <span
                  className={`flex-shrink-0 text-secondary text-xl transition-transform duration-300 ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-primary/10 mb-4" />
                  <p
                    className="text-ink/70 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
