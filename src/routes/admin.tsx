import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, siteContentQuery, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Palermo Contas" },
      { name: "description", content: "Painel administrativo da Palermo Contas." },
      { property: "og:title", content: "Painel — Palermo Contas" },
      { property: "og:description", content: "Painel administrativo da Palermo Contas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const inputCls = "w-full rounded-md border border-input bg-secondary px-3 py-2 text-foreground outline-none focus:border-primary focus:glow";
const btnCls = "rounded-md bg-primary px-5 py-2 font-heading font-bold uppercase tracking-wider text-primary-foreground transition hover:glow-strong disabled:opacity-50";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl">PALERMO <span className="text-primary">PAINEL</span></h1>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Ver site</Link>
        </div>
        {!ready ? null : !session ? <Login /> : isAdmin === null ? <p>Carregando…</p> : !isAdmin ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <p>Esta conta não tem acesso de administrador.</p>
            <button className={`${btnCls} mt-4`} onClick={() => supabase.auth.signOut()}>Sair</button>
          </div>
        ) : <Editor />}
      </div>
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("E-mail ou senha incorretos.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setMsg(error ? error.message : "Conta criada! Confira seu e-mail para confirmar e depois entre.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-primary/60 bg-card p-6 glow">
      <h2 className="font-heading text-xl uppercase">{mode === "in" ? "Entrar" : "Criar conta de administrador"}</h2>
      <input className={inputCls} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={inputCls} type="password" placeholder="Senha" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <button className={btnCls} disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</button>
      <p className="text-sm text-muted-foreground">
        {mode === "in" ? "Primeiro acesso? " : "Já tem conta? "}
        <button type="button" className="text-primary underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Criar conta" : "Entrar"}
        </button>
      </p>
      <p className="text-xs text-muted-foreground">A primeira conta criada vira a administradora do site.</p>
    </form>
  );
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("site-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2;
  return data.signedUrl;
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-secondary p-3">
      <p className="mb-2 font-heading text-sm uppercase">{label}</p>
      <img src={value} alt={label} className="mb-2 aspect-square w-full rounded object-cover" />
      <label className="block cursor-pointer text-center text-sm text-primary hover:text-glow">
        {busy ? "Enviando…" : "Trocar foto"}
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          setBusy(true);
          try { onChange(await uploadImage(f)); } catch { alert("Falha ao enviar a foto."); }
          setBusy(false);
        }} />
      </label>
    </div>
  );
}

function stripDefaults(f: SiteContent) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(f) as (keyof SiteContent)[]) {
    if (k === "gallery") out["gallery"] = f.gallery.map((g, i) => (g === defaultContent.gallery[i] ? "" : g));
    else if (f[k] !== defaultContent[k]) out[k] = f[k];
  }
  return out as never;
}

function Editor() {
  const qc = useQueryClient();
  const { data } = useQuery(siteContentQuery);
  const [form, setForm] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => { if (data && !form) setForm(data.merged); }, [data, form]);
  if (!form) return <p>Carregando…</p>;

  const set = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => setForm({ ...form, [k]: v });

  async function save() {
    setStatus("Salvando…");
    const { error } = await supabase.from("site_settings").update({ content: stripDefaults(form!), updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) { setStatus("Erro ao salvar."); return; }
    await qc.invalidateQueries({ queryKey: ["site-content"] });
    setStatus("Salvo! O site já está atualizado.");
  }

  const text = (k: keyof SiteContent, label: string, area = false) => (
    <label className="block">
      <span className="mb-1 block font-heading text-sm uppercase text-muted-foreground">{label}</span>
      {area ? (
        <textarea rows={4} className={inputCls} value={form[k] as string} onChange={(e) => set(k, e.target.value as never)} />
      ) : (
        <input className={inputCls} value={form[k] as string} onChange={(e) => set(k, e.target.value as never)} />
      )}
    </label>
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Fotos</h2>
        <div className="grid grid-cols-2 gap-4">
          <ImageField label="Foto principal" value={form.heroImage} onChange={(u) => set("heroImage", u)} />
          <ImageField label="Foto boas-vindas" value={form.welcomeImage} onChange={(u) => set("welcomeImage", u)} />
        </div>
        <h3 className="font-heading uppercase">Galeria</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {form.gallery.map((g, i) => (
            <ImageField key={i} label={`Foto ${i + 1}`} value={g} onChange={(u) => { const n = [...form.gallery]; n[i] = u; set("gallery", n); }} />
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Textos</h2>
        {text("heroPhrase", "Frase principal")}
        {text("welcomeTitle", "Título boas-vindas")}
        {text("welcomeText", "Texto boas-vindas", true)}
        {text("extraServiceTitle", "Card extra — título")}
        {text("extraServiceText", "Card extra — descrição", true)}
        {text("ctaTitle", "Chamada final")}
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl uppercase">Contato</h2>
        {text("whatsapp", "WhatsApp (com DDI e DDD, ex: 5511956621281)")}
        {text("facebook", "Link do Facebook")}
        {text("instagram", "Link do Instagram")}
      </section>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-4 rounded-xl border border-primary bg-card p-4 glow">
        <button className={btnCls} onClick={save}>Salvar alterações</button>
        <button className="text-sm text-muted-foreground hover:text-primary" onClick={() => setForm({ ...defaultContent })}>Restaurar padrão</button>
        <button className="ml-auto text-sm text-muted-foreground hover:text-primary" onClick={() => supabase.auth.signOut()}>Sair</button>
        {status && <p className="w-full text-sm">{status}</p>}
      </div>
    </div>
  );
}
