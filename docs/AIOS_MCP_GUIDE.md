# Guia Mestre: Framework .aios-core e Ecosistema MCP

Este documento foi criado para ajudar você a entender profundamente como extrair o máximo do seu esquadrão de IA (Squad) e como usar a tecnologia MCP (Model Context Protocol) para conectar seus agentes ao mundo real.

---

## 1. O Framework `.aios-core`

O `.aios-core` (Artificial Intelligence Operating System Core) é uma estrutura arquitetural para orquestrar múltiplos agentes de Inteligência Artificial dentro de um projeto de software. Ao invés de usar a IA apenas como um "chat", o framework transforma a IA em uma **equipe colaborativa**.

### Agentes
Os Agentes são "personas" especializadas que rodam dentro do seu projeto (ex: Arquiteto, Engenheiro, QA, Designer, Product Manager). 
- Cada agente tem instruções específicas de como pensar, que arquivos olhar e como interagir.
- **Auto-Handoff (Passagem de Bastão):** Os agentes trabalham em etapas. Quando o *Designer* termina o layout, ele passa o contexto estruturado para o *Dev Front-end*, que ao terminar, chama o *QA*.

### Workflows
São receitas (passo a passo) que dizem aos agentes *como* fazer processos complexos. 
- Exemplo: "Fluxo de Deploy" ou "Fluxo de Criação de Novo Agente". O Workflow impede que a IA alucine, forçando a execução de etapas rígidas e previsíveis.

### Tasks e Checklists
A IA perde o foco facilmente em conversas longas. Tasks (tarefas) e Checklists em arquivos markdown (`.md`) dão controle de estado. 
- Os agentes são instruídos a **sempre** atualizar os checklists (ex: `docs/stories/story-1.md`) criando evidências físicas do progresso: `- [x] Criar componente Header`, antes de passar para a próxima tarefa.

---

## 2. Model Context Protocol (MCP)

Como você bem notou: *"Não basta ter um squad inteiro de design se não tem um MCP conectado à plataforma de design"*. Você tocou exatamente no calcanhar de Aquiles das IAs tradicionais e na solução que vai dominar o mercado.

### O que é o MCP?
Criado inicialmente pela Anthropic, o **Model Context Protocol** é um padrão universal de código aberto. Ele permite que modelos de IA se conectem de forma padronizada a fontes de dados externas e ferramentas.
Pense no MCP como um "cabo USB" universal para as IAs. Antes, as IAs estavam "isoladas" no navegador ou IDE. Com o MCP, você pluga a IA via "Servidor MCP" aos seus bancos de dados (PostgreSQL, Supabase), APIs (GitHub, Slack, Jira), ou plataformas de design (Figma).

### O Impacto que Você Pode Gerar no Mercado através do MCP
O mercado está entupido de wrappers (ferramentas que só envelopam o ChatGPT). O verdeiro **Nível de Ouro (Moat)** está em IAs que *tomam ações no mundo corporativo interno*.
Com o MCP você vai:
1. **Criar Agentes Autônomos Reais:** Seu agente de Produto (PM) pode usar um MCP do Jira para criar e mover cards sozinho, ler tickets e repassar para os Devs.
2. **Eliminar Silos:** Seu agente Backend pode usar o MCP do Supabase para aplicar *Migrations* de banco de dados diretamente, ou ler esquemas para gerar código impecável sem você precisar copiar e colar esquemas no chat.
3. **Escalar Agências e Software Houses:** Um squad equipado com MCPs do Figma, GitHub e Vercel pode: ler um layout no Figma -> gerar o código React -> subir no pull request do GitHub -> acompanhar o deploy na Vercel. Tudo isso orquestrado pelo seu `.aios-core`.

### Como Usar / Trabalhar e Conectar com seu Squad

Para dar "superpoderes" ao seu time:

1. **Escolha a Ferramenta Alvo e Rode/Instale o Servidor MCP:**
   Existem dezenas de MCPs open source (https://github.com/modelcontextprotocol/servers). Você adiciona o servidor MCP ao seu ambiente local ou Claude Desktop / Cursor / IDE que suporte MCP.

2. **Acople ao Agente Específico no `.aios-core`:**
   Nas descrições do Agente (ex: `.agent/agents/designer.md` ou `.aios-core/development/agents/ux-design-expert.md`), você dirá a ele quais ferramentas MCP ele pode usar.
   
   *Exemplo de fluxo:*
   * **Seu Comando:** "Designer, leia o ID do Figma 1234 e crie os tokens CSS."
   * **O Agente (Designer):** Interpreta que precisa chamar a *Tool* do MCP do Figma (já configurado no seu sistema). Ele lê o arquivo direto pela API através da ponte MCP, extrai os hexadecimais, tamanhos de fonte, e então escreve no arquivo CSS do seu projeto.
   * **Handoff:** Ele preenche a checklist e chama o Dev para aplicar os componentes.

3. **Exemplos Práticos para o seu Squad:**
   * **Agente Supabase/DB:** Conecte o servidor oficial PostgreSQL ou Supabase. Ele investiga por que uma query está lenta diretamente acessando as `views` no banco, sem que o humano tenha que olhar logs do banco de dados.
   * **DevOps/Netlify:** Use o MCP do Netlify. O Agente faz build, checa logs remotos e retorna onde o erro aconteceu.

### Conclusão Estratégica
O **.aios-core** é como a gerência e os cérebros (Arquitetura). Os **MCPs** são as mãos, pernas e os sentidos da IA. Unindo os dois, você para de "escrever código usando IA" e passa a atuar como **CEO de uma fábrica de software digital**.
