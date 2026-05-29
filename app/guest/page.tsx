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
    title: "Valores + Pagamentos",
    content: [
      "Por se tratar de um estúdio privado, é essencial que cada tatuador seja responsável pela gestão da sua própria agenda e pelo recebimento direto dos pagamentos de seus clientes.",
      "O pagamento da comissão pode ser feito por PIX, Transferência ou dinheiro. Pode ser feito no final da tatuagem ou semanalmente.",
      "O estúdio oferece suporte na divulgação dos artistas por meio de postagens em nossos canais, porém isso não garante fluxo de clientes. Espera-se que cada profissional também atue ativamente na construção e manutenção da sua própria base de clientes.",
    ],
    image: "/images/4.jpeg",
  },
  {
    title: "Comissão do Estúdio",
    content: [],
    bullets: [
      "O repasse padrão é de 30% do valor total da tatuagem para o estúdio.",
      "Taxa diária (full day) é de R$450 — válido para quem cobra valores acima de R$1.500 por tatuagem, assim não é necessário repassar o excedente nesse dia.",
      "Semanal R$2.000 — Período de 6 dias consecutivos.",
      "Mensal R$4.900 — Livre para fazer quantas tatuagens quiser dentro do específico mês, pagamento antecipado.",
    ],
  },
  {
    title: "O Que Fornecemos",
    content: [
      "Papel toalha Snob, Sabonete líquido, Bandagem, Vaselina, Fita crepe, Copo plástico descartável, Solidificador de líquidos, Tinta preta Easyglow Ultrablack, Luvas Nitrilicas P, M e G, Batoques, Protetor de Clipcord, Plástico filme PVC, Aparelho barbeador descartável, Transfer, Almotolia para álcool, Almotolia para sabão, Borrifador para sabão, Protetor de almotolia, Babador impermeável, Máscara descartável.",
    ],
  },
  {
    title: "Bancadas",
    content: [
      "No Quantica temos o nosso próprio aplicativo para que os artistas gerenciem suas reservas. Hoje temos 4 bancadas rotativas disponíveis.",
      "Você precisará reservar uma bancada para os dias que deseja trabalhar. Para isso, vá até a aba \"Agenda\" e selecione \"Nova Reserva\".",
      "Na hora da escolha da bancada existem 3 opções:",
    ],
    bullets: [
      "1 — Dia completo",
      "2 — Meio período (manhã até 13hrs)",
      "3 — Meio período (tarde após 13hrs)",
    ],
    extra: [
      "Caso a escolha seja o meio período (manhã), é de extrema importância que o artista tenha certeza que irá finalizar a tatuagem no horário para a bancada estar liberada e limpa até 13hrs.",
      "É importante reservar com antecedência, pois as estações funcionam por ordem de chegada. Uma vez reservada, a estação será sua durante todo o dia.",
      "Se você não for mais trabalhar em determinado dia, por favor exclua sua reserva o quanto antes para que outros artistas possam utilizar a estação.",
      "As bancadas contêm todos os materiais necessários para montar seu espaço — caso falte algo, confira no armário de estoque.",
    ],
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
      "Temos à disposição: impressora térmica Brother A4, impressora térmica Peripage A4, impressora térmica chinesa A4 (necessita desenho impresso), impressora tradicional Brother a laser (preta), papel hectográfico manual, papel térmico (reutilizável) e insumos como folhas sulfite A4.",
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
  {
    title: "Armário dos Tatuadores",
    content: [
      "Devido a ser bancada rotativa, temos o armário de aço dos tatuadores que fica na sala de desenho para cada um guardar suas coisas pessoais e profissionais. Caso o tatuador queira trancar, o cadeado não é fornecido pelo estúdio.",
    ],
  },
  {
    title: "Após Finalizar",
    content: [],
    bullets: [
      "Desmontar toda sua bancada e deixar livre em cima (deixar tintas/produtos/almotolias no cesto da lateral direita da bancada).",
      "Higienizar bancada e maca após o uso com desinfetante hospitalar.",
      "Não deixar maca com proteção após finalizar a tattoo.",
      "Lixo infectante contaminado: retirar todo dia e descartar na Lixeira branca 1.",
      "Descarte de agulhas no recipiente próprio (perfurocortante).",
      "Usar solidificante de líquido para descartar os líquidos restantes.",
      "Recolher copos, garrafas e resíduos seus e do seu cliente.",
      "Louças, copos e todos utensílios utilizados devem ser lavados após o uso.",
      "Em caso de ser o último ao fechar o estúdio: sempre confira iluminação, ar condicionados desligados e tranque a fechadura do meio da porta de entrada.",
      "Não colar adesivos nas bancadas, almotolias, ou em qualquer outro lugar do estúdio.",
      "A primeira chave do estúdio é fornecida — em caso de perda será cobrado R$200,00 para uma nova cópia.",
      "Os artistas também devem seguir os protocolos locais de higiene.",
    ],
    image: "/images/WhatsApp Image 2026-05-28 at 15.30.51.jpeg",
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
          {section.image && (
            <div className="relative w-full" style={{ height: "200px" }}>
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
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
              {"extra" in section && section.extra && (
                <div className="mt-3 flex flex-col gap-2">
                  {(section.extra as string[]).map((text, i) => (
                    <p key={i} className="text-sm text-[#555] leading-relaxed">{text}</p>
                  ))}
                </div>
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
