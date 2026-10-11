import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero.jpg";
import welcomeImg from "@/assets/welcome.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";

export type SiteContent = {
  heroImage: string;
  welcomeImage: string;
  gallery: string[];
  heroPhrase: string;
  welcomeTitle: string;
  welcomeText: string;
  extraServiceTitle: string;
  extraServiceText: string;
  ctaTitle: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
};

export const defaultContent: SiteContent = {
  heroImage: heroImg,
  welcomeImage: welcomeImg,
  gallery: [g1, g2, g3, welcomeImg, heroImg, g1],
  heroPhrase: "A lealdade é tudo. Sem ela não somos nada.",
  welcomeTitle: "Bem-vindo ao time",
  welcomeText:
    "Aqui ninguém fica para trás. A Palermo Contas reúne quem corre pelo certo: contas Uber e 99 prontas para rodar, suporte de verdade e uma família que fecha junto. Entrou, é dos nossos.",
  extraServiceTitle: "Suporte 24h",
  extraServiceText: "Atendimento direto no WhatsApp, a qualquer hora. Problema seu vira problema nosso.",
  ctaTitle: "Pronto para entrar?",
  whatsapp: "5511956621281",
  facebook: "https://facebook.com/SEU_PERFIL",
  instagram: "https://instagram.com/SEU_PERFIL",
};

export function whatsappLink(number: string) {
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent("Olá! Vim pelo site da Palermo Contas.")}`;
}

export function mergeContent(raw: unknown): SiteContent {
  const c = (raw && typeof raw === "object" ? raw : {}) as Partial<SiteContent>;
  const out = { ...defaultContent };
  for (const k of Object.keys(defaultContent) as (keyof SiteContent)[]) {
    const v = c[k];
    if (k === "gallery") {
      if (Array.isArray(v) && v.length) {
        out.gallery = defaultContent.gallery.map((d, i) => (v[i] as string) || d);
      }
    } else if (typeof v === "string" && v.trim()) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async () => {
    const { data } = await supabase.from("site_settings").select("content").eq("id", 1).maybeSingle();
    return { raw: (data?.content ?? {}) as Partial<SiteContent>, merged: mergeContent(data?.content) };
  },
});
