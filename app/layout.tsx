import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  weight: ["400", "600", "700"],
  display: "swap",
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  weight: ["400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "우리역사와 땅 - 서글(契)과 정음, 영어가 우리말인 진짜 역사",
  description:
    "밝완서가 파헤치는 지명의 비밀. 서글과 박승빈의 정음 체계로 잃어버린 우리말과 땅의 진실을 찾아갑니다. 고품격 놀이터, 권중혁, 홍인섭의 통찰과 함께합니다.",
  keywords: ["우리역사와 땅", "밝완서", "서글", "정음", "언문", "박승빈 훈민정음", "영어는 우리말이다", "서계"],
  openGraph: {
    title: "우리역사와 땅 - 서글(契)과 정음, 영어가 우리말인 진짜 역사",
    description:
      "밝완서가 파헤치는 지명의 비밀. 서글과 박승빈의 정음 체계로 잃어버린 우리말과 땅의 진실을 찾아갑니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "우리역사와 땅 - 서글(契)과 정음, 영어가 우리말인 진짜 역사",
    description: "밝완서가 파헤치는 지명의 비밀. 서글과 정음으로 잃어버린 우리말과 땅의 진실을 찾아갑니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} ${notoSerifKr.variable} ${nanumMyeongjo.variable} font-serif bg-parchment text-ink antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
