# 🚌 Dashboard de Atividade da Frota

Sistema completo de controle e monitoramento de atividades da frota de veículos, com integração Excel e interface moderna.

## 📋 Sobre o Projeto

Dashboard profissional para gestão de frota que processa dados reais de planilhas Excel (Base de Veículos e Base de Rotas), oferecendo uma visão consolidada da atividade diária dos veículos com filtros avançados, estatísticas automáticas e exportação de relatórios.

## ✨ Funcionalidades

- 📊 **Dashboard interativo** com controle mensal da atividade dos veículos
- 📈 **Processamento de dados Excel** - integração com planilhas reais (422 veículos, 20.226 rotas)
- 🔍 **Filtros avançados** por:
  - 📅 Período (mês/ano)
  - 👨‍💼 Coordenador
  - 👔 Gerente
  - 🏷️ Placa (busca por texto)
  - 📄 Contrato Meli
  - 🏢 Categoria
  - 🏭 Base
  - 🚌 Tipo de Frota
- ✅ **Status simplificado** - Rodou/Não rodou com tooltips informativos
- 📊 **Estatísticas automáticas** de utilização e percentual de rodagem
- 📤 **Export XLSX** com dados filtrados
- 💡 **Tooltips detalhados** com informações da rota (ID, Milha, Cluster, Motorista, Performance)
- 🌙 **Modo escuro/claro** com design elegante preto e verde
- 📱 **Interface responsiva** otimizada para desktop e mobile
- ⚡ **Paginação inteligente** com controle de itens por página
- 🎯 **Performance otimizada** sem erros de hidratação

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Sistema de componentes
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Biblioteca de ícones

### Processamento de Dados
- **SheetJS (xlsx)** - Processamento de planilhas Excel
- **Node.js File System** - Leitura de arquivos do servidor

### Outros
- **next-themes** - Sistema de temas (modo escuro/claro)
- **class-variance-authority** - Utilitário para variantes de classes
- **clsx & tailwind-merge** - Utilitários CSS condicionais

## 🚀 Instalação

### Pré-requisitos
- **Node.js** 18.17+ 
- **npm**, **pnpm** ou **yarn**

### 1. Clone o repositório
```bash
git clone https://github.com/GMouraDev/Dash-Atividade-Frota.git
cd Dash-Atividade-Frota
```

### 2. Instale as dependências
```bash
# Com npm
npm install

# Com pnpm (recomendado)
pnpm install

# Com yarn
yarn install
```

**Nota:** Se houver conflitos de dependências com React 19, use:
```bash
npm install --legacy-peer-deps
```

### 3. Adicione os arquivos Excel
Coloque os arquivos de dados na pasta `resource/`:
- `Base-Veiculos.xlsx` - Lista de veículos da frota
- `Base Rotas.xlsx` - Registro de rotas executadas

### 4. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

## 🌐 Acesso

### Desenvolvimento
- **URL:** http://localhost:3000 (ou porta disponível)
- **Timeout da API:** 30 segundos (processamento Excel)
- **Região:** Configurado para Brasil (gru1) no Vercel

### Produção
- **Deploy:** Configurado para Vercel
- **Domínio:** [Configure seu domínio personalizado]

## 📁 Estrutura do Projeto

```
Dash-Atividade-Frota/
├── app/                           # App Router Next.js 15
│   ├── api/vehicles/             # API para processamento Excel
│   ├── globals.css               # Estilos globais + Tailwind
│   ├── layout.tsx                # Layout com providers
│   └── page.tsx                  # Página principal
├── components/                    # Componentes React
│   ├── ui/                       # Componentes shadcn/ui
│   ├── vehicle-tracking-table.tsx # Tabela principal
│   ├── filter-controls.tsx       # Controles de filtro
│   ├── pagination-controls.tsx   # Paginação
│   ├── export-button.tsx         # Export XLSX
│   ├── legend.tsx                # Legenda de status
│   ├── status-icon.tsx           # Ícones ✓/✗
│   ├── theme-provider.tsx        # Provider de tema
│   └── theme-toggle.tsx          # Toggle modo escuro
├── hooks/                        # Hooks customizados
├── lib/                          # Utilitários e configurações
├── resource/                     # Arquivos Excel de dados
│   ├── Base-Veiculos.xlsx        # Dados dos veículos
│   └── Base Rotas.xlsx           # Dados das rotas
├── public/                       # Assets estáticos
├── styles/                       # Estilos adicionais
├── components.json               # Configuração shadcn/ui
├── tailwind.config.ts            # Configuração Tailwind
├── next.config.mjs               # Configuração Next.js
├── vercel.json                   # Configuração deploy Vercel
└── tsconfig.json                 # Configuração TypeScript
```

## 📊 Dados e Integração

### Estrutura dos Dados Excel

**Base-Veiculos.xlsx:**
- Placa, Modelo, Contrato Meli, Categoria
- Base, Coordenador, Gerente, Tipo de Frota

**Base Rotas.xlsx:**
- Data Rota, ID Rota, Placa, Cluster
- Milha, Motorista, Modal, Performance
- KM Planejado

### Lógica de Status
- **✅ Rodou:** Existe rota para o veículo na data
- **❌ Não rodou:** Não há rota registrada (inclui folgas, manutenção, etc.)

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # Verificação ESLint
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Conecte seu repositório GitHub ao Vercel
# Configuração automática via vercel.json
```

### Configuração do Deploy
- **Timeout:** 30s para processamento Excel
- **Região:** South America (gru1)
- **Node.js:** 18.x+

## 🔍 Troubleshooting

### Problemas Comuns

**1. Erro de dependências React 19:**
```bash
npm install --legacy-peer-deps
```

**2. Timeout na API:**
- Verifique se os arquivos Excel estão na pasta `resource/`
- Arquivos muito grandes podem precisar de otimização

**3. Problemas de build:**
```bash
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**4. Modo escuro não funciona:**
- Verifique se o ThemeProvider está configurado no layout

## 💾 Dados de Demonstração

Se os arquivos Excel não estiverem disponíveis, o sistema automaticamente usa dados de fallback para demonstração, incluindo:
- Veículos de exemplo com diferentes configurações
- Status simulados baseados em padrões reais
- Informações de rota quando aplicável

---

**🚀 Sistema completo e pronto para produção** | **⚡ Desenvolvido com Next.js 15 e tecnologias modernas** 