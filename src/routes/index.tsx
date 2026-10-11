import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, Shield, Flame, Link2, Car, Headphones, MessageCircle, Facebook, Instagram, Phone } from "lucide-react";
import { defaultContent, siteContentQuery, whatsappLink } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Palermo Contas" },
      { name: "description", content: "Palermo Contas — contas Uber e 99 com lealdade, coragem e conexão. Chame no WhatsApp." },
      { property: "og:title", content: "Palermo Contas" },
      { property: "og:description", content: "A lealdade é tudo. Sem ela não somos nada. Contas Uber e 99." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function UberIcon() {
  return <span className="font-heading text-sm font-bold tracking-tight text-foreground">Uber</span>;
}
function NinetyNineIcon() {
  return <span className="font-display text-lg text-primary">99</span>;
}

const NAV = [
  ["Início", "#inicio"],
  ["Sobre", "#sobre"],
  ["Serviços", "#servicos"],
  ["Galeria", "#galeria"],
  ["Contato", "#contato"],
] as const;

function Index() {
  const { data } = useQuery(siteContentQuery);
  const c = data?.merged ?? defaultContent;
  const wa = whatsappLink(c.whatsapp);
  const [open, setOpen] = useState(false);
  const ringText = "A LEALDADE É TUDO • SEM ELA NÃO SOMOS NADA • ";

  return (
    <div className="relative overflow-x-hidden">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#inicio" className="font-display text-xl">
            PALERMO <span className="text-primary">CONTAS</span>
          </a>
          <ul className="hidden items-center gap-7 font-heading text-sm uppercase tracking-widest md:flex">
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} className="transition hover:text-primary hover:text-glow">{l}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href={c.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full p-2 transition hover:text-primary hover:glow"><Facebook size={18} /></a>
            <a href={c.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full p-2 transition hover:text-primary hover:glow"><Instagram size={18} /></a>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
          </div>
        </nav>
        {open && (
          <ul className="flex flex-col gap-1 border-t border-border/40 bg-background/95 px-4 py-3 font-heading uppercase tracking-widest md:hidden">
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-2 hover:text-primary">{l}</a></li>
            ))}
          </ul>
        )}
      </header>

      {/* HERO */}
      <section id="inicio" className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0 smoke-bg" />
        <div className="pointer-events-none absolute inset-0 particles opacity-40" />

        <div className="relative mt-4 aspect-square w-[78vw] max-w-[420px]">
          <svg viewBox="0 0 300 300" className="absolute -inset-[9%] h-[118%] w-[118%] animate-spin-slow">
            <defs><path id="ring" d="M150,150 m-138,0 a138,138 0 1,1 276,0 a138,138 0 1,1 -276,0" /></defs>
            <text className="fill-foreground font-heading" fontSize="11">
              <textPath href="#ring" textLength="860" lengthAdjust="spacing">{ringText}{ringText}</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-neon-pulse" />
          <img src={c.heroImage} alt="Palermo Contas - braços cruzados" width={1024} height={1024} className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-full object-cover [object-position:center_18%]" style={{ objectPosition: "center 18%" }} />
          <div className="absolute -left-6 top-1/4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary bg-card glow animate-floaty"><UberIcon /></div>
          <div className="absolute -right-6 bottom-1/4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary bg-card glow animate-floaty [animation-delay:1.5s]"><NinetyNineIcon /></div>
        </div>

        <h1 className="relative mt-12 font-display text-[22vw] leading-[0.85] stone-text sm:text-[9rem]">PALERMO</h1>
        <div className="relative -mt-2 -rotate-2 bg-primary-deep px-8 py-1 shadow-lg ring-1 ring-primary">
          <span className="font-display text-3xl tracking-[0.35em] text-foreground sm:text-4xl">CONTAS</span>
        </div>
        <p className="relative mt-8 max-w-md text-center font-heading text-lg uppercase tracking-wider text-muted-foreground">{c.heroPhrase}</p>
        <a href={wa} target="_blank" rel="noreferrer" className="relative mt-8 inline-flex items-center gap-3 rounded-md bg-primary px-8 py-4 font-heading text-lg font-bold uppercase tracking-widest text-primary-foreground animate-neon-pulse transition hover:scale-105">
          <MessageCircle /> Chamar no WhatsApp
        </a>
      </section>

      {/* BEM-VINDO */}
      <section id="sobre" className="relative px-4 py-24">
        <Reveal className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-primary">Família Palermo</p>
            <h2 className="mt-3 font-display text-5xl uppercase sm:text-6xl">{c.welcomeTitle}</h2>
            <div className="mt-4 h-1 w-20 bg-primary glow" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{c.welcomeText}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-xl border border-primary/60 glow" />
            <img src={c.welcomeImage} alt="Bem-vindo à Palermo" loading="lazy" width={1024} height={1280} className="relative aspect-[4/5] w-full rounded-lg object-cover" />
          </div>
        </Reveal>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="relative px-4 py-24">
        <div className="pointer-events-none absolute inset-0 smoke-bg opacity-60" />
        <Reveal className="relative mx-auto max-w-6xl">
          <h2 className="text-center font-display text-5xl uppercase sm:text-6xl">Serviços</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Car />, t: "Contas Uber", d: "Contas prontas para rodar no Uber, verificadas e com suporte na ativação." },
              { icon: <span className="font-display text-xl">99</span>, t: "Contas 99", d: "Comece a rodar na 99 sem dor de cabeça. Rápido, seguro e do jeito certo." },
              { icon: <Headphones />, t: c.extraServiceTitle, d: c.extraServiceText },
            ].map((s) => (
              <div key={s.t} className="group rounded-xl border border-primary/70 bg-card p-8 transition hover:-translate-y-1 hover:glow-strong">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary text-primary glow">{s.icon}</div>
                <h3 className="mt-6 font-heading text-2xl font-bold uppercase">{s.t}</h3>
                <p className="mt-3 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* POR QUE */}
      <section className="px-4 py-24">
        <Reveal className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-5xl uppercase sm:text-6xl">Por que a <span className="text-primary text-glow">Palermo</span></h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              { icon: <Shield size={30} />, t: "Lealdade", d: "Palavra dada é palavra cumprida. Sempre." },
              { icon: <Flame size={30} />, t: "Coragem", d: "Encaramos qualquer corre ao seu lado." },
              { icon: <Link2 size={30} />, t: "Conexão", d: "Uma rede forte onde ninguém anda sozinho." },
            ].map((f) => (
              <div key={f.t} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary text-primary animate-neon-pulse">{f.icon}</div>
                <h3 className="mt-6 font-display text-3xl uppercase">{f.t}</h3>
                <p className="mt-2 text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="px-4 py-24">
        <Reveal className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-5xl uppercase sm:text-6xl">Galeria</h2>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {c.gallery.map((src, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border border-border transition hover:border-primary hover:glow-strong">
                <img src={src} alt={`Galeria ${i + 1}`} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 bg-primary/0 transition group-hover:bg-primary/15" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section id="contato" className="relative overflow-hidden px-4 py-28 cta-bg">
        <div className="pointer-events-none absolute inset-0 particles opacity-30" />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-6xl uppercase sm:text-7xl">{c.ctaTitle}</h2>
          <p className="mt-4 font-heading uppercase tracking-widest">{c.heroPhrase}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-3 rounded-md bg-background px-10 py-5 font-heading text-lg font-bold uppercase tracking-widest text-foreground transition hover:scale-105 hover:glow-strong">
            <MessageCircle className="text-primary" /> Chamar no WhatsApp
          </a>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <div className="font-display text-2xl">PALERMO <span className="bg-primary-deep px-2">CONTAS</span></div>
            <a href={wa} className="mt-2 inline-flex items-center gap-2 text-muted-foreground hover:text-primary"><Phone size={16} /> +{c.whatsapp}</a>
          </div>
          <div className="flex gap-3">
            {[
              { h: wa, i: <MessageCircle size={20} />, l: "WhatsApp" },
              { h: c.facebook, i: <Facebook size={20} />, l: "Facebook" },
              { h: c.instagram, i: <Instagram size={20} />, l: "Instagram" },
            ].map((s) => (
              <a key={s.l} href={s.h} target="_blank" rel="noreferrer" aria-label={s.l} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 transition hover:bg-primary hover:glow-strong">{s.i}</a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Palermo Contas. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground animate-wa-pulse transition hover:scale-110">
        <MessageCircle size={30} />
      </a>
    </div>
  );
}
