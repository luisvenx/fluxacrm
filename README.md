# 🏢 Fluxa Imob Engine v2.6

**Fluxa Imob** é uma plataforma de inteligência operacional e gestão financeira de alta performance, projetada especificamente para o ecossistema imobiliário. O sistema consolida métricas em tempo real, gestão de CRM, fluxos de marketing e auditoria financeira em uma interface moderna, intuitiva e focada em dados.

![Versão](https://img.shields.io/badge/version-2.6.0-blue)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Supabase%20%7C%20Tailwind-brightgreen)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)

---

## 💎 Visão Geral da Interface

O design do Fluxa Imob segue uma estética "High-End Business", priorizando a legibilidade e o acesso rápido a KPIs críticos. 
- **Layout:** Responsivo com suporte a desktop e dispositivos móveis.
- **Design System:** Baseado em Tailwind CSS, utilizando uma paleta de cores sóbria (Slate e Blue) com estados de feedback visual imediatos.
- **Experiência do Usuário:** Animações suaves de entrada, transições de estado e carregamento progressivo de dados.

---

## 🚀 Funcionalidades Principais

### 💰 Gestão Financeira (Financeiro)
- **Dashboard Financeiro:** Visão consolidada de entradas, saídas, lucro líquido e ticket médio.
- **Ledger de Transações:** Registro detalhado com conciliação bancária simulada.
- **DRE & Inteligência Contábil:** Cálculo automático de EBITDA e margens operacionais.
- **Fiscal:** Provisão de impostos e controle de tributos (Simples Nacional, ISS, etc).
- **Wallet:** Gestão de cartões corporativos e limites.

### 🤝 Comercial & CRM
- **Pipeline de Vendas:** Funil visual (Kanban) para gestão de leads desde a prospecção até o fechamento.
- **Leads Intelligence:** Central de contatos com rastreamento de origem e valor potencial.
- **Leaderboard:** Ranking de performance comercial em tempo real (Prospecções vs. Vendas).

### 🛠️ Operacional & CS
- **Sucesso do Cliente:** Monitoramento de Health Score e NPS (Net Promoter Score).
- **Onboarding:** Fluxo estruturado de implementação de novos contratos.
- **Contratos:** Gestão de MRR (Receita Recorrente Mensal) e vigências contratuais.
- **OKRs:** Definição e acompanhamento de objetivos e resultados-chave.

### 📣 Marketing & Squads
- **Marketing Boards:** Kanbans dedicados para produção de conteúdo e campanhas.
- **Gestão de Squads:** Organização de células de trabalho com líderes e membros específicos.

---

## 🛠️ Stack Tecnológica

- **Frontend:** [React.js](https://react.dev/) (v19+)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Backend/BaaS:** [Supabase](https://supabase.com/)
  - **Auth:** Autenticação JWT segura.
  - **Database:** PostgreSQL com políticas de segurança de linha (RLS).
  - **Realtime:** Atualização instantânea de dashboards.
- **PWA:** Suporte a Progressive Web App para instalação mobile e funcionamento offline parcial via Service Workers.

---

## 🏗️ Arquitetura de Dados & Segurança

O projeto utiliza uma estrutura de **Isolamento de Dados SQL**. Cada registro no banco de dados (transações, leads, contratos) é vinculado a um `user_id`. 
As consultas são rigorosamente filtradas no frontend e protegidas por regras de RLS (Row Level Security) no Supabase, garantindo que um usuário nunca acesse dados de outra conta.

### Principais Entidades:
- `transactions`: Fluxo de caixa.
- `customers`: Base de clientes e saúde.
- `leads`: Oportunidades comerciais.
- `contracts`: Gestão de recorrência.
- `appointments`: Agenda sincronizada.
- `profiles`: Metadados de usuários e permissões.

---

## 💻 Instalação e Desenvolvimento

Como o projeto utiliza módulos ES6 diretamente via CDN (esm.sh), ele não requer um processo pesado de build para prototipagem rápida.

1. **Requisitos:** Um servidor web simples ou ambiente Vercel/Netlify.
2. **Ambiente:** As variáveis de conexão com o banco de dados estão centralizadas em `lib/supabase.ts`.
3. **Execução:** 
   ```bash
   # O projeto pode ser servido diretamente através do index.html
   # Recomenda-se o uso de extensões como "Live Server" no VS Code
   ```

---

## 📱 Mobile & PWA

O Fluxa Imob está pronto para o uso mobile:
- Adicione à tela inicial para uma experiência de App nativo.
- Manifesto configurado em `manifest.json`.
- Offline caching básico via `sw.js`.

---

## 📄 Licença

Este software é de uso restrito e privado para gestão imobiliária. 

---
**Desenvolvido com foco em precisão e escala.**  
*Fluxa Imob Engine - Transformando dados em decisões.*