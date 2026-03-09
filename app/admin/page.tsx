"use client";

import { useEffect, useState } from "react";
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc,
  doc, orderBy, query, Timestamp, serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";

/* ── 타입 ─────────────────────────────────────── */
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
  status?: string; // "archived" | undefined(노출)
  createdAt: Timestamp | null;
}

const CATEGORIES = ["역사와 지명", "契(글)의 인식", "정음의 비밀", "영어 속 우리말"];
const EMPTY_FORM = { category: CATEGORIES[0], title: "", summary: "", url: "", date: "", readTime: "" };

/* ── 유틸 ─────────────────────────────────────── */
function fmt(ts: Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}
function exportCSV(subs: Subscriber[]) {
  const rows = subs.map((s) => `"${s.name}","${s.email}","${fmt(s.createdAt)}"`).join("\n");
  const blob = new Blob(["\uFEFF이름,이메일,가입일\n" + rows], { type: "text/csv;charset=utf-8;" });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `구독자_${new Date().toISOString().slice(0, 10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ── 공통 UI ──────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-xs text-parchment/50 mb-1">{children}</p>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}
function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2 font-sans text-sm
        focus:outline-none focus:border-secondary placeholder:text-parchment/30" />
  );
}

/* ── 기사 테이블 행 ──────────────────────────────── */
function ArticleRow({
  article, onArchive, onRestore, onDelete,
}: {
  article: Article;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-parchment/5 hover:bg-parchment/5">
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        <span className="text-secondary border border-secondary/30 px-2 py-0.5">{article.category}</span>
      </td>
      <td className="px-4 py-3 text-parchment max-w-[220px]">
        <p className="truncate text-sm">{article.title}</p>
        {article.url && (
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            className="text-parchment/30 hover:text-secondary text-xs underline truncate block max-w-full">
            {article.url}
          </a>
        )}
      </td>
      <td className="px-4 py-3 text-parchment/50 text-xs whitespace-nowrap">{article.date || "—"}</td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">
        <span className="text-parchment/30">{fmt(article.createdAt)}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-3">
          {onArchive && (
            <button onClick={onArchive}
              className="font-sans text-xs text-parchment/40 hover:text-secondary transition-colors cursor-pointer">
              보관 ↓
            </button>
          )}
          {onRestore && (
            <button onClick={onRestore}
              className="font-sans text-xs text-secondary/70 hover:text-secondary transition-colors cursor-pointer">
              복원 ↑
            </button>
          )}
          <button onClick={onDelete}
            className="font-sans text-xs text-accent/50 hover:text-accent transition-colors cursor-pointer">
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── 메인 ─────────────────────────────────────── */
export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [users, setUsers]             = useState<UserRecord[]>([]);
  const [articles, setArticles]       = useState<Article[]>([]);
  const [fetching, setFetching]       = useState(true);
  const [fetchError, setFetchError]   = useState("");
  const [tab, setTab] = useState<"subscribers" | "articles" | "users">("subscribers");

  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");
  const [formOk, setFormOk]       = useState(false);

  /* 관리자 체크 */
  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/");
  }, [loading, isAdmin, router]);

  /* 기사 새로고침 */
  async function reloadArticles() {
    const snap = await getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc")));
    setArticles(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article)));
  }

  /* 전체 데이터 로드 */
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        setFetchError("");
        const [subSnap, userSnap, artSnap] = await Promise.all([
          getDocs(query(collection(db, "subscribers"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "users"), orderBy("lastLogin", "desc"))),
          getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc"))),
        ]);
        setSubscribers(subSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscriber)));
        setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRecord)));
        setArticles(artSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Article)));
      } catch (err: unknown) {
        setFetchError(err instanceof Error ? err.message : String(err));
      } finally {
        setFetching(false);
      }
    })();
  }, [isAdmin]);

  /* 기사 추가 */
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) { setFormError("제목과 링크는 필수입니다."); return; }
    setSaving(true); setFormError(""); setFormOk(false);
    try {
      await addDoc(collection(db, "articles"), { ...form, status: "featured", createdAt: serverTimestamp() });
      setForm(EMPTY_FORM); setFormOk(true);
      await reloadArticles();
      setTimeout(() => setFormOk(false), 3000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "저장 오류");
    } finally { setSaving(false); }
  }

  /* 보관 */
  async function handleArchive(id: string) {
    await updateDoc(doc(db, "articles", id), { status: "archived" });
    setArticles((prev) => prev.map((a) => a.id === id ? { ...a, status: "archived" } : a));
  }

  /* 복원 */
  async function handleRestore(id: string) {
    await updateDoc(doc(db, "articles", id), { status: "featured" });
    setArticles((prev) => prev.map((a) => a.id === id ? { ...a, status: "featured" } : a));
  }

  /* 삭제 */
  async function handleDelete(id: string) {
    if (!confirm("기사를 영구 삭제할까요?")) return;
    await deleteDoc(doc(db, "articles", id));
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  /* 분류 */
  const featured = articles.filter((a) => a.status !== "archived");
  const archived = articles.filter((a) => a.status === "archived");

  const thisWeek = subscribers.filter(
    (s) => s.createdAt && Date.now() - s.createdAt.toDate().getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  /* ── 로딩 / 미인증 ── */
  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <p className="text-parchment/40 font-sans text-sm">인증 확인 중...</p>
    </div>
  );
  if (!isAdmin) return null;
  if (fetching) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <p className="text-parchment/40 font-sans text-sm">데이터 불러오는 중...</p>
    </div>
  );

  /* ── 렌더 ── */
  return (
    <div className="min-h-screen bg-primary px-4 sm:px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-sans text-secondary text-xs tracking-widest mb-1">관리자 대시보드</p>
            <h1 className="text-2xl font-bold text-parchment" style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>
              우리역사와 땅
            </h1>
          </div>
          <a href="/" className="font-sans text-xs text-parchment/40 border border-parchment/20 px-4 py-2
            hover:border-secondary/50 hover:text-secondary transition-colors">
            ← 홈으로
          </a>
        </div>

        {/* 오류 배너 */}
        {fetchError && (
          <div className="mb-6 border border-accent/40 bg-accent/10 px-4 py-3 text-accent font-sans text-sm">
            <strong>데이터 로드 오류:</strong> {fetchError}
            <p className="text-xs mt-1 text-accent/70">
              Firebase 콘솔 → Firestore → 규칙에서 읽기 권한을 확인해 주세요.
            </p>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "총 구독자",      value: subscribers.length },
            { label: "이번 주 신규",   value: thisWeek },
            { label: "노출 기사",      value: featured.length },
            { label: "보관 기사",      value: archived.length },
          ].map((s) => (
            <div key={s.label} className="border border-secondary/20 p-5 text-center">
              <p className="text-3xl font-bold text-secondary mb-1"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>{s.value}</p>
              <p className="font-sans text-xs text-parchment/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {(["subscribers", "articles", "users"] as const).map((t) => {
            const labels = {
              subscribers: `구독자 (${subscribers.length})`,
              articles:    `기사 관리 (노출 ${featured.length} · 보관 ${archived.length})`,
              users:       `사용자 (${users.length})`,
            };
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`font-sans text-xs px-5 py-2 border transition-all cursor-pointer ${
                  tab === t
                    ? "bg-secondary text-primary border-secondary"
                    : "text-parchment/50 border-parchment/20 hover:border-secondary/50 hover:text-parchment"
                }`}>
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* ── 구독자 탭 ── */}
        {tab === "subscribers" && (
          <>
            <div className="flex justify-end mb-3">
              <button onClick={() => exportCSV(subscribers)}
                className="font-sans text-xs text-secondary border border-secondary/40 px-4 py-2
                  hover:bg-secondary/10 transition-colors cursor-pointer">
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
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-parchment/30 text-xs">구독자가 없습니다.</td></tr>
                  ) : subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-parchment/5 hover:bg-parchment/5">
                      <td className="px-4 py-3 text-parchment">{s.name}</td>
                      <td className="px-4 py-3 text-parchment/80">{s.email}</td>
                      <td className="px-4 py-3 text-parchment/50 text-xs">{fmt(s.createdAt)}</td>
                      <td className="px-4 py-3 text-parchment/30 text-xs font-mono truncate max-w-[120px]">
                        {s.uid ?? "비로그인"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── 기사 관리 탭 ── */}
        {tab === "articles" && (
          <div className="space-y-10">

            {/* 추가 폼 */}
            <div className="border border-secondary/20 p-6">
              <h2 className="text-parchment font-bold mb-5 text-base"
                style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>
                새 기사 추가
              </h2>
              <form onSubmit={handleAdd} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="카테고리">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-primary border border-parchment/20 text-parchment px-3 py-2
                        font-sans text-sm focus:outline-none focus:border-secondary">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="날짜 (예: 2026.03.09)">
                    <TextInput value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="2026.03.09" />
                  </Field>
                </div>
                <Field label="제목 *">
                  <TextInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="기사 제목" />
                </Field>
                <Field label="요약 (선택)">
                  <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="기사 요약 (2~3문장)" rows={3}
                    className="w-full bg-transparent border border-parchment/20 text-parchment px-3 py-2
                      font-sans text-sm focus:outline-none focus:border-secondary placeholder:text-parchment/30 resize-none" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="기사 링크 *">
                    <TextInput value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://..." />
                  </Field>
                  <Field label="읽기 시간 (예: 8분)">
                    <TextInput value={form.readTime} onChange={(v) => setForm({ ...form, readTime: v })} placeholder="8분" />
                  </Field>
                </div>
                {formError && <p className="font-sans text-xs text-accent">{formError}</p>}
                {formOk    && <p className="font-sans text-xs text-secondary">기사가 홈페이지에 추가되었습니다.</p>}
                <button type="submit" disabled={saving}
                  className="font-sans text-sm bg-secondary text-primary px-6 py-2
                    hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer">
                  {saving ? "저장 중..." : "기사 추가 →"}
                </button>
              </form>
            </div>

            {/* 홈페이지 노출 기사 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-sans text-xs text-secondary tracking-widest uppercase">
                  홈페이지 노출 기사 ({featured.length})
                </h3>
                <span className="text-parchment/30 text-xs font-sans">— 보관 ↓ 버튼을 누르면 숨겨집니다</span>
              </div>
              <div className="border border-parchment/10 overflow-x-auto">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr className="border-b border-parchment/10 bg-parchment/5">
                      {["카테고리", "제목 / 링크", "날짜", "등록일", ""].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 text-parchment/40 font-normal text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featured.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-parchment/30 text-xs">노출 중인 기사가 없습니다.</td></tr>
                    ) : featured.map((a) => (
                      <ArticleRow key={a.id} article={a}
                        onArchive={() => handleArchive(a.id)}
                        onDelete={() => handleDelete(a.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 보관함 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-sans text-xs text-parchment/40 tracking-widest uppercase">
                  보관함 ({archived.length})
                </h3>
                <span className="text-parchment/30 text-xs font-sans">— 복원 ↑ 버튼을 누르면 다시 홈페이지에 노출됩니다</span>
              </div>
              <div className="border border-parchment/10 overflow-x-auto">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr className="border-b border-parchment/10 bg-parchment/5">
                      {["카테고리", "제목 / 링크", "날짜", "등록일", ""].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 text-parchment/30 font-normal text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {archived.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-parchment/20 text-xs">보관된 기사가 없습니다.</td></tr>
                    ) : archived.map((a) => (
                      <ArticleRow key={a.id} article={a}
                        onRestore={() => handleRestore(a.id)}
                        onDelete={() => handleDelete(a.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── 사용자 탭 ── */}
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
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-parchment/30 text-xs">사용자가 없습니다.</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-parchment/5 hover:bg-parchment/5">
                    <td className="px-4 py-3 text-parchment">{u.displayName || "—"}</td>
                    <td className="px-4 py-3 text-parchment/80">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-xs px-2 py-0.5 ${
                        u.role === "admin" ? "bg-secondary text-primary" : "bg-parchment/10 text-parchment/50"
                      }`}>
                        {u.role === "admin" ? "관리자" : "사용자"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-parchment/50 text-xs whitespace-nowrap">{fmt(u.lastLogin)}</td>
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
