"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const SECTIONS = [
  {
    title: "Bem-vindo",
    content: [
      "Situado no bairro Moema, o Estúdio Quantica está instalado em um espaço de 184m², pensado para oferecer conforto, funcionalidade e inspiração no dia a dia de trabalho.",
      "O ambiente é amplo, bem iluminado e acolhedor, criando uma atmosfera onde diferentes estilos e processos criativos podem coexistir de forma harmônica.",
      "O estúdio possui todas as licenças necessárias para funcionamento e é devidamente aprovado pela vigilância sanitária, garantindo segurança tanto para os profissionais quanto para os clientes.",
    ],
    image: "/images/WhatsApp Image 2026-05-28 at 15.30.59.jpeg",
  },
  {
    title: "Promoção de Tatuadores",
    content: [
      "Promovemos todos os nossos artistas convidados no Instagram do estúdio antes da sua estadia.",
      "Recomendamos que você faça uma promoção paga no Instagram se estiver preocupado em preencher sua agenda — isso tem mostrado ótimos resultados com base em artistas anteriores.",
    ],
    image: "/images/4.jpeg",
  },
  {
    title: "Recepção e Frigobar",
    content: [
      "Área da recepção: Café de cápsula Dolce Gusto, chás, bolachas salgadas, filtro de água gelada.",
      "Frigobar: O tatuador que quiser oferecer bebidas para o seu cliente terá uma parte exclusiva, de acordo com o número da sua bancada.",
    ],
    bullets: [
      "Cada tatuador possui um espaço individual de acordo com o número da bancada utilizada.",
      "É responsável por abastecer e organizar seus itens.",
      "Ao final do dia, deve guardar seus produtos no seu armário.",
    ],
    image: "/images/2.jpeg",
  },
  {
    title: "Sala de Desenho",
    content: [
      "Temos à disposição: impressora térmica Brother A4, impressora térmica Peripage A4, impressora térmica chinesa A4, impressora tradicional Brother a laser (preta), papel hectográfico manual, papel térmico (reutilizável) e insumos como folhas sulfite A4.",
      "Disponibilizamos micro-ondas, copos, pratos e talheres. Os clientes podem se alimentar na recepção ou na área de fumantes.",
    ],
  },
  {
    title: "Música",
    content: [
      "O estúdio conta com uma caixa de som Alexa. A escolha das músicas deve ser democrática — evite volume alto e respeite o cliente do colega.",
      "Respeite o espaço de cada um no estúdio, principalmente os clientes de outros tatuadores. Evite conversas negativas e mantenha um ambiente confortável.",
    ],
    image: "/images/3.jpeg",
  },
];

export default function GuestInfo() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <main
      className="min-h-screen pb-8"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => router.back()} className="mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1
          className="text-3xl font-light text-[#2C2C2C] mb-1"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Informações do Estúdio
        </h1>
        {profile?.full_name && (
          <p className="text-sm text-[#888]">Olá, {profile.full_name}. Bem-vindo ao Quantica!</p>
        )}
      </div>

      <div className="w-full h-px bg-[#D5CFC9] mb-2" />

      {/* Sections */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-2">
          {/* Section photo */}
          {section.image && (
            <div className="relative w-full" style={{ height: "200px" }}>
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <h2
                className="absolute bottom-4 left-5 text-2xl font-light text-white"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {section.title}
              </h2>
            </div>
          )}

          <div className="px-5 py-4">
            {!section.image && (
              <h2
                className="text-xl font-light text-[#2C2C2C] mb-3"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {section.title}
              </h2>
            )}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
              {section.content.map((text, i) => (
                <p key={i} className="text-sm text-[#555] leading-relaxed mb-2 last:mb-0">
                  {text}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#555]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#3A4A3B" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="px-5 mt-4">
        <button
          onClick={() => router.push("/schedule")}
          className="w-full text-white py-4 rounded-full text-base font-medium"
          style={{ background: "#3A4A3B" }}
        >
          Ir para Agenda
        </button>
      </div>
    </main>
  );
}
