"use client";

import { useEffect, useState } from "react";
import {
  collection, getDocs, addDoc, deleteDoc, doc,
  orderBy, query, Timestamp, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  uid: string | null;
  createdAt: Timestamp | null;
}

interface UserRecord {
  id: string;
  displayName: string;
  email: string;
  role: string;
  lastLogin: Timestamp | null;
}

interface Article {
  id: string;
  category: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  readTime: string;
  createdAt: Timestamp | null;
}

const CATEGORIES = ["역사와 지명", "契(글)의 인식", "정음의 비밀", "영어 속 우리말"];

function formatDate(ts: Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function exportCSV(subscribers: Subscriber[]) {
  const header = "이름,이메일,가입일\n";
  const rows = subscribers.map((s) =>
    `"${s.name}","${s.email}","${formatDate(s.createdAt)}"`
  ).join("\n");
  const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `구독자목록_${new Date().toLocaleDateString("ko-KR").replace(/\. /g, "-").replace(".", "")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const emptyForm = { category: CATEGORIES[0], title: "", summary: "", url: "", date: "", readTime: "" };

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState<"subscribers" | "users" | "articles">("subscribers");

  // 기사 추가 폼
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/");
  }, [loading, isAdmin, router]);

  const loadArticles = async () => {
    const snap = await getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc")));
    setArticles(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article)));
  };

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [subSnap, userSnap] = await Promise.all([
        getDocs(query(collection(db, "subscribers"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "users"), orderBy("lastLogin", "desc"))),
      ]);
      setSubscribers(subSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscriber)));
      setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRecord)));
      await loadArticles();
      setFetching(false);
    };
    fetchData();
  }, [isAdmin]);

  const thisWeek = subscribers.filter((s) => {
    if (!s.createdAt) return false;
    return Date.now() - s.createdAt.toDate().getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      setFormError("제목과 링크는 필수입니다.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await addDoc(collection(db, "articles"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
      await loadArticles();
    } catch (err) {
      console.error(err);
      setFormError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("이 기사를 삭제하시겠습니까?")) return;
    await deleteDoc(doc(db, "articles", id));
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-parchment/60 font-sans text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-primary px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="font-sans text-secondary text-xs tracking-widest mb-1">관리자 대시보드</p>
            <h1 className="text-3xl font-bold text-parchment" style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>
              우리역사와 땅
            </h1>
          </div>
          <a href="/" className="font-sans text-xs text-parchment/50 border border-parchment/20 px-4 py-2 hover:border-secondary hover:text-secondary transition-colors">
            ← 홈으로
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "총 구독자", value: subscribers.length },
            { label: "이번 주 신규", value: thisWeek },
            { label: "등록 기사", value: articles.length },
            { label: "로그인 사용자", value: users.length },
          ].map((stat) => (
            <div key={stat.label} className="border border-secondary/20 p-5 text-center">
              <p className="text-3xl font-bold text-secondary mb-1" style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>
                {stat.value}
              </p>
              <p className="font-sans text-xs text-parchment/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {([
            ["subscribers", `구독자 (${subscribers.length})`],
            ["articles", `기사 관리 (${articles.length})`],
            ["users", `사용자 (${users.length})`],
          ] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`font-sans text-xs px-5 py-2 border transition-all cursor-pointer ${
                tab === t ? "bg-secondary text-primary border-secondary" : "text-parchment/50 border-parchment/20 hover:border-secondary/50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* 구독자 */}
        {tab === "subscribers" && (
          <>
            <div className="flex justify-end mb-3">
              <button onClick={() => exportCSV(subscribers)}
                className="font-sans text-xs text-secondary border border-secondary/40 px-4 py-2 hover:bg-secondary/10 transition-colors cursor-pointer">
                CSV 내보내기 ↓
              </button>
            </div>
            <div className="border border-parchment/10 overflow-x-auto">
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="border-b border-parchment/10 bg-parchment/5">
                    {["이름", "이메일", "가입일", "UID"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-parchment/50 font-normal text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscribers.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-parchment/30 text-xs">구독자가 없습니다.</td></tr>
                  ) : subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-parchment/5 hover:bg-parchment/5">
                      <td className="px-4 py-3 text-parchment">{s.name}</td>
                      <td className="px-4 py-3 text-parchment/80">{s.email}</td>
                      <td className="px-4 py-3 text-parchment/50 text-xs">{formatDate(s.createdAt)}</td>
                      <td className="px-4 py-3 text-parchment/30 text-xs font-mono">{s.uid ?? "비로그인"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 기사 관리 */}
        {tab === "articles" && (
          <div className="space-y-8">
            {/* 추가 폼 */}
            <div className="border border-secondary/20 p-6">
              <h2 className="text-parchment font-bold mb-5 text-lg" style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>
                새 기사 추가
              </h2>
              <form onSubmit={handleAddArticle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 카테고리 */}
                  <div>
                    <label className="block font-sans text-xs text-parchment/50 mb-1">카테고리</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-primary border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm focus:outline-none focus:border-secondary">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* 날짜 */}
                  <div>
                    <label className="block font-sans text-xs text-parchment/50 mb-1">날짜 (예: 2026.03.08)</label>
                    <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="2026.03.08"
                      className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm focus:outline-none focus:border-secondary placeholder:text-parchment/30" />
                  </div>
                </div>
                {/* 제목 */}
                <div>
                  <label className="block font-sans text-xs text-parchment/50 mb-1">제목 *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="기사 제목"
                    className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm focus:outline-none focus:border-secondary placeholder:text-parchment/30" />
                </div>
                {/* 요약 */}
                <div>
                  <label className="block font-sans text-xs text-parchment/50 mb-1">요약</label>
                  <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="기사 요약 (2~3문장)"
                    rows={3}
                    className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm focus:outline-none focus:border-secondary placeholder:text-parchment/30 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 링크 */}
                  <div>
                    <label className="block font-sans text-xs text-parchment/50 mb-1">기사 링크 *</label>
                    <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm focus:outline-none focus:border-secondary placeholder:text-parchment/30" />
                  </div>
                  {/* 읽기 시간 */}
                  <div>
                    <label className="block font-sans text-xs text-parchment/50 mb-1">읽기 시간 (예: 8분)</label>
                    <input value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                      placeholder="8분"
                      className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm focus:outline-none focus:border-secondary placeholder:text-parchment/30" />
                  </div>
                </div>
                {formError && <p className="font-sans text-xs text-accent">{formError}</p>}
                <button type="submit" disabled={saving}
                  className="font-sans text-sm bg-secondary text-primary px-6 py-2 hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer">
                  {saving ? "저장 중..." : "기사 추가"}
                </button>
              </form>
            </div>

            {/* 기사 목록 */}
            <div className="border border-parchment/10 overflow-x-auto">
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="border-b border-parchment/10 bg-parchment/5">
                    {["카테고리", "제목", "날짜", "링크", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-parchment/50 font-normal text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {articles.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-parchment/30 text-xs">등록된 기사가 없습니다.</td></tr>
                  ) : articles.map((a) => (
                    <tr key={a.id} className="border-b border-parchment/5 hover:bg-parchment/5">
                      <td className="px-4 py-3 text-xs">
                        <span className="text-secondary border border-secondary/30 px-2 py-0.5">{a.category}</span>
                      </td>
                      <td className="px-4 py-3 text-parchment max-w-xs">
                        <p className="truncate">{a.title}</p>
                      </td>
                      <td className="px-4 py-3 text-parchment/50 text-xs whitespace-nowrap">{a.date}</td>
                      <td className="px-4 py-3 text-xs">
                        <a href={a.url} target="_blank" rel="noopener noreferrer"
                          className="text-secondary/70 hover:text-secondary underline truncate block max-w-[160px]">
                          {a.url}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteArticle(a.id)}
                          className="font-sans text-xs text-accent/70 hover:text-accent transition-colors cursor-pointer">
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 사용자 */}
        {tab === "users" && (
          <div className="border border-parchment/10 overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-parchment/10 bg-parchment/5">
                  {["이름", "이메일", "역할", "마지막 로그인"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-parchment/50 font-normal text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-parchment/30 text-xs">사용자가 없습니다.</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-parchment/5 hover:bg-parchment/5">
                    <td className="px-4 py-3 text-parchment">{u.displayName}</td>
                    <td className="px-4 py-3 text-parchment/80">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 ${u.role === "admin" ? "bg-secondary text-primary" : "bg-parchment/10 text-parchment/50"}`}>
                        {u.role === "admin" ? "관리자" : "사용자"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-parchment/50 text-xs">{formatDate(u.lastLogin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
