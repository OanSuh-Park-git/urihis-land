"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";

const schema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해 주세요."),
  email: z.email("올바른 이메일 주소를 입력해 주세요."),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Subscribe() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await addDoc(collection(db, "subscribers"), {
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
        uid: user?.uid ?? null,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setError("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <section id="subscribe" className="py-24 px-6 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='10' y='55' font-size='48' fill='%23B5996E'%3E正%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="section-subtitle text-secondary mb-4">뉴스레터 구독</p>
        <h2
          className="text-3xl md:text-4xl font-bold text-parchment leading-tight mb-6"
          style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
        >
          제도권이 숨긴 우리 역사의 진실,
          <br />
          홍익인간의 정신문명
        </h2>
        <p
          className="text-parchment/70 mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
        >
          역사 왜곡을 바로잡고, 서글·정음의 진실을 밝히며,
          <br />
          삼일신고·천부경의 정신을 세계에 알리는 글들을 가장 먼저 받아보세요.
          <br />
          등록하시면 새로운 소식을 늘 전달하겠습니다.
        </p>

        {submitted ? (
          <div className="border border-secondary/50 p-8 text-parchment">
            <div
              className="text-4xl text-secondary mb-4"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              書契
            </div>
            <p
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              구독해 주셔서 감사합니다.
            </p>
            <p
              className="text-parchment/70 text-sm"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              입력하신 이메일로 확인 메일과 소책자 PDF를 발송해 드렸습니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Name */}
              <div className="flex-1">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="이름"
                  className={`w-full bg-transparent border px-4 py-3 text-parchment placeholder:text-parchment/40 font-sans text-sm focus:outline-none focus:border-secondary transition-colors duration-200 ${
                    errors.name ? "border-accent" : "border-parchment/30"
                  }`}
                />
                {errors.name && (
                  <p className="font-sans text-accent text-xs mt-1 text-left">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex-1">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="이메일 주소"
                  className={`w-full bg-transparent border px-4 py-3 text-parchment placeholder:text-parchment/40 font-sans text-sm focus:outline-none focus:border-secondary transition-colors duration-200 ${
                    errors.email ? "border-accent" : "border-parchment/30"
                  }`}
                />
                {errors.email && (
                  <p className="font-sans text-accent text-xs mt-1 text-left">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="flex-1">
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="전화번호 (선택)"
                  className="w-full bg-transparent border border-parchment/30 px-4 py-3 text-parchment placeholder:text-parchment/40 font-sans text-sm focus:outline-none focus:border-secondary transition-colors duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "처리 중..." : "진실의 역사, 지금 구독하기"}
            </button>

            {error && (
              <p className="font-sans text-accent text-sm mt-2">{error}</p>
            )}
            <p className="font-sans text-xs text-parchment/30 mt-4">
              언제든지 구독을 해지할 수 있습니다. 스팸 메일은 발송하지 않습니다.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
