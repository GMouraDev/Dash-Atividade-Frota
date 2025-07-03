# 🚌 Dash Atividade Frota

Sistema de controle e monitoramento de atividades da frota de veículos, desenvolvido com **Next.js 15**, **React 19**, **TypeScript** e **shadcn/ui**.

## ✨ Funcionalidades

- 📊 **Dashboard interativo** com visão mensal da atividade dos veículos
- 🚗 **Controle de status** (rodou, manutenção, folga, falta, sem-rota, sem-motorista)
- 🔍 **Filtros avançados** por:
  - 📅 Data (mês/ano)
  - 👨‍💼 Coordenador
  - 👔 Gerente
  - 🚗 Motorista (busca por texto)
  - 🏷️ Placa
  - 📄 Contrato
  - 🏢 Base
  - 🚌 Modalidade
  - 📊 Status
- 📈 **Estatísticas automáticas** de utilização e percentual de rodagem
- 📤 **Exportação de relatórios** em diferentes formatos
- 💡 **Tooltips informativos** com detalhes das rotas e informações extras
- 📱 **Interface responsiva** e moderna com layout otimizado
- 🎨 **Design system** com shadcn/ui e Tailwind CSS
- ⚡ **Performance otimizada** com dados determinísticos (sem erros de hidratação)

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Radix UI** - Componentes primitivos
- **Lucide React** - Ícones
- **Recharts** - Gráficos (preparado para uso futuro)

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** 18+ 
- **pnpm** (recomendado) ou npm/yarn

### 1. Clone e acesse o repositório
\`\`\`bash
git clone <url-do-seu-repositorio>
cd Dash-Atividade-Frota
\`\`\`

### 2. Instale as dependências
\`\`\`bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install

# Ou com yarn
yarn install
\`\`\`

### 3. Execute o projeto em modo desenvolvimento
\`\`\`bash
# Com pnpm
pnpm dev

# Ou com npm
npm run dev

# Ou com yarn
yarn dev
\`\`\`

### 4. Acesse a aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Scripts Disponíveis

\`\`\`bash
pnpm dev          # Inicia o servidor de desenvolvimento
pnpm build        # Gera build de produção
pnpm start        # Inicia servidor de produção
pnpm lint         # Executa o ESLint
\`\`\`

## 🗂️ Estrutura do Projeto

\`\`\`
├── app/                    # App Router do Next.js 15
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes do shadcn/ui
│   ├── vehicle-tracking-table.tsx  # Tabela principal
│   ├── filter-controls.tsx         # Controles de filtro
│   ├── legend.tsx                  # Legenda de status
│   ├── export-button.tsx           # Botão de exportação
│   └── status-icon.tsx             # Ícones de status
├── hooks/                 # Hooks customizados
├── lib/                   # Utilitários
└── public/               # Arquivos estáticos
\`\`\`

## 🎯 Próximos Passos Recomendados

### 1. **Integração com Backend**
- Substituir dados mock por API real
- Implementar autenticação
- Configurar banco de dados

### 2. **Funcionalidades Adicionais**
- Relatórios mais detalhados
- Gráficos de análise
- Notificações em tempo real
- Sistema de permissões

### 3. **Otimizações**
- Cache de dados
- Pagination da tabela
- Lazy loading
- PWA (Progressive Web App)

## 🐛 Troubleshooting

### Erro de dependências
\`\`\`bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
pnpm install
\`\`\`

### Problemas com TypeScript
O projeto está configurado para ignorar erros de TypeScript durante o build (`ignoreBuildErrors: true`). Para desenvolvimento, você pode remover essa configuração em \`next.config.mjs\`.

### Problemas de estilo
Certifique-se de que o Tailwind CSS está funcionando verificando se os estilos estão sendo aplicados. O arquivo \`globals.css\` contém as configurações necessárias.

## 📝 Dados Mock

O projeto atualmente usa dados mock para demonstração. Os dados incluem:
- 5 veículos de exemplo
- Status diários simulados
- Informações de rotas quando o veículo "rodou"
- Diferentes modalidades (Executivo, Escolar, Urbano, Rodoviário)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⚡ **Desenvolvido com Next.js 15 e muito ☕** 