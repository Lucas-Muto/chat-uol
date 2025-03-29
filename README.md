# Bate-Papo UOL

## Deploy
O projeto está disponível em: [Link do Deploy](https://chat-uol-7frg.vercel.app)

Uma implementação moderna do clássico Bate-Papo UOL, desenvolvida com JavaScript puro. Este projeto é uma versão mobile-first que permite aos usuários trocar mensagens em tempo real, com suporte a mensagens públicas e privadas.

## 🎯 Funcionalidades

- **Login de Usuário**
  - Entrada com nome de usuário único
  - Verificação automática de disponibilidade do nome
  - Conexão persistente com o servidor

- **Sistema de Mensagens**
  - Mensagens públicas para todos
  - Mensagens privadas para usuários específicos
  - Mensagens de status (entrada/saída de usuários)
  - Atualização automática a cada 3 segundos
  - Rolagem automática para novas mensagens

- **Tipos de Mensagens**
  - Status (fundo cinza - #DCDCDC)
  - Privadas (fundo rosa - #FFDEDE)
  - Públicas (fundo branco)

- **Lista de Participantes**
  - Visualização de usuários ativos
  - Atualização automática a cada 10 segundos
  - Seleção de destinatário para mensagens
  - Opções de visibilidade (Público/Reservadamente)

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript Vanilla (sem frameworks ou bibliotecas)

## 📱 Layout

O projeto segue um design mobile-first, com layout responsivo baseado no [Figma do projeto](https://www.figma.com/design/sHg0G7zVCQe1CvpX5jyjf3/Chat-UOL?node-id=0-1).

## 🔄 API

O projeto utiliza uma API REST com os seguintes endpoints:

- `POST /participants` - Registro de usuário
- `POST /status` - Manutenção de conexão
- `GET /messages` - Busca de mensagens
- `POST /messages` - Envio de mensagens
- `GET /participants` - Lista de participantes

## 💻 Como Usar

1. Digite seu nome ao entrar
2. Aguarde a validação do servidor
3. Comece a enviar mensagens!
4. Para mensagens privadas:
   - Clique no ícone de participantes (canto superior direito)
   - Selecione um usuário
   - Escolha entre "Público" ou "Reservadamente"

## 🔍 Detalhes Técnicos

- **Atualização Automática**
  - Mensagens: a cada 3 segundos
  - Lista de participantes: a cada 10 segundos
  - Status de conexão: a cada 5 segundos

- **Segurança**
  - Mensagens privadas são visíveis apenas para remetente e destinatário
  - Verificação constante de status do usuário

- **Interface**
  - Menu lateral com overlay semi-transparente
  - Indicadores visuais de seleção (checks)
  - Feedback visual do destinatário selecionado

## 🚫 Restrições

- Não utiliza bibliotecas ou frameworks externos
- Desenvolvido apenas com JavaScript puro
- Focado em dispositivos móveis
- Layout flexível (não fixo)

## 🔒 Regras de Negócio

1. **Mensagens Privadas**
   - Visíveis apenas para remetente e destinatário
   - Identificadas com fundo rosa (#FFDEDE)

2. **Mensagens de Status**
   - Entrada/saída de usuários
   - Fundo cinza (#DCDCDC)

3. **Seleção de Destinatário**
   - Opção "Todos" desativa mensagens reservadas
   - Necessário selecionar usuário específico para mensagens privadas

## 🔄 Estados do Sistema

1. **Login**
   - Validação de nome
   - Retry em caso de nome já utilizado

2. **Chat Ativo**
   - Monitoramento constante de conexão
   - Atualização automática de mensagens
   - Gestão de participantes ativos

3. **Desconexão**
   - Detecção automática
   - Redirecionamento para login

## ⚠️ Observações

- O sistema mantém conexão ativa através de requisições periódicas
- A filtragem de mensagens privadas é feita no front-end
- O layout se adapta a diferentes tamanhos de tela mobile
