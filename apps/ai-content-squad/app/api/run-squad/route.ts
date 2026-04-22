import { NextRequest, NextResponse } from "next/server";

interface Slide {
  titulo: string;
  conteudo: string;
}

const SLIDE_TEMPLATES: Record<string, Slide[]> = {
  Educativo: [
    { titulo: "Hook", conteudo: "Você sabia que essa notícia pode mudar a forma como você enxerga o mercado?" },
    { titulo: "Contexto", conteudo: "Entender o que está acontecendo é o primeiro passo para tomar decisões mais inteligentes." },
    { titulo: "Desenvolvimento", conteudo: "Os especialistas apontam que os impactos dessa mudança vão se refletir nos próximos meses em pelo menos 3 setores." },
    { titulo: "Dado Relevante", conteudo: "Segundo levantamentos recentes, mais de 60% das empresas ainda não se adaptaram a essa realidade. Isso é uma oportunidade." },
    { titulo: "Insight", conteudo: "Quem entende as tendências antes dos outros sai na frente. A informação é o ativo mais valioso de hoje." },
    { titulo: "CTA", conteudo: "Salve esse carrossel e compartilhe com quem precisa saber disso. Conhecimento que não circula, não transforma." },
  ],
  Medo: [
    { titulo: "Alerta", conteudo: "Essa notícia pode estar afetando você agora mesmo — e você ainda não percebeu." },
    { titulo: "O Problema", conteudo: "Ignorar essa informação pode custar caro. Muita gente já está sentindo os efeitos e não sabe por quê." },
    { titulo: "O Que Está em Jogo", conteudo: "Sua segurança financeira, seus planos e seu futuro podem ser impactados se você não agir agora." },
    { titulo: "Os Sinais", conteudo: "Existem sinais claros de que essa situação vai escalar. Quem identificou antes saiu à frente." },
    { titulo: "A Janela", conteudo: "A janela para agir está se fechando. Quem espera demais perde a chance de se proteger." },
    { titulo: "CTA", conteudo: "Não fique parado. Compartilhe isso com quem você se importa antes que seja tarde." },
  ],
  Profissional: [
    { titulo: "Análise", conteudo: "A notícia de hoje traz implicações diretas para o cenário corporativo e para tomadores de decisão." },
    { titulo: "Contexto de Mercado", conteudo: "Esse movimento se insere em uma tendência estrutural que vem se consolidando há meses no setor." },
    { titulo: "Impactos Esperados", conteudo: "As estimativas indicam mudanças significativas nas cadeias de fornecimento e nos modelos de receita das empresas expostas." },
    { titulo: "Oportunidades", conteudo: "Para líderes atentos, esse cenário abre espaço para reposicionamento estratégico e ganho de vantagem competitiva." },
    { titulo: "Recomendação", conteudo: "O momento exige revisão de premissas, alinhamento de equipes e agilidade na adaptação do planejamento." },
    { titulo: "CTA", conteudo: "Acompanhe nosso perfil para análises diárias que ajudam você a tomar decisões melhores." },
  ],
  Curiosidade: [
    { titulo: "Você Sabia?", conteudo: "Essa notícia esconde um detalhe surpreendente que a maioria das pessoas ignora completamente." },
    { titulo: "A História por Trás", conteudo: "Por trás desse fato existe uma cadeia de eventos que poucos conhecem — e que explica tudo." },
    { titulo: "O Detalhe Curioso", conteudo: "O que mais chama atenção não é o fato em si, mas o que ele revela sobre como as coisas funcionam nos bastidores." },
    { titulo: "A Conexão Inesperada", conteudo: "Isso está conectado a um padrão histórico que se repete toda vez que esse tipo de situação emerge." },
    { titulo: "Insight Revelador", conteudo: "A grande sacada aqui é perceber o que ninguém está falando: o contexto que dá sentido a tudo isso." },
    { titulo: "CTA", conteudo: "Curtiu? Salve para reler depois e compartilhe com alguém que vai amar esse tipo de análise." },
  ],
  Polêmico: [
    { titulo: "A Verdade Incômoda", conteudo: "Essa notícia vai contra o que a maioria das pessoas quer acreditar — mas é exatamente por isso que precisa ser dita." },
    { titulo: "O Que Ninguém Fala", conteudo: "A narrativa oficial esconde a parte mais importante. E quando você entende isso, tudo muda." },
    { titulo: "O Outro Lado", conteudo: "Há dois lados nessa história. Um é amplamente divulgado. O outro é sistematicamente ignorado." },
    { titulo: "A Contradição", conteudo: "Se você acredita no discurso mainstream, prepare-se para questionar algumas certezas." },
    { titulo: "Posicionamento", conteudo: "Não é possível ficar em cima do muro aqui. Ou você entende o que está acontecendo, ou é enganado por quem entende." },
    { titulo: "CTA", conteudo: "Discorda? Concorda? Comenta aqui. O debate é exatamente o que precisamos mais." },
  ],
};

function buildSlides(noticia: string, angulo: string): Slide[] {
  const templates = SLIDE_TEMPLATES[angulo] ?? SLIDE_TEMPLATES["Educativo"];
  const excerpt = noticia.length > 120 ? noticia.slice(0, 120) + "…" : noticia;

  return templates.map((slide, i) => ({
    titulo: slide.titulo,
    conteudo: i === 0
      ? `${slide.conteudo}\n\n📰 Base: "${excerpt}"`
      : slide.conteudo,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { noticia, angulo } = body as { noticia?: string; angulo?: string };

    if (!noticia?.trim() || !angulo?.trim()) {
      return NextResponse.json(
        { error: "Campos noticia e angulo são obrigatórios." },
        { status: 400 }
      );
    }

    // If an external backend URL is configured, proxy to it
    const backendUrl = process.env.SQUAD_BACKEND_URL;
    if (backendUrl) {
      const upstream = await fetch(`${backendUrl}/api/run-squad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticia, angulo }),
      });
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    }

    // Mock: simulate processing delay + generate slides from templates
    await new Promise((r) => setTimeout(r, 1400));
    const slides = buildSlides(noticia, angulo);
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
