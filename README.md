# Muvora

> **Tudo no seu tempo, de forma simples.**

Muvora é um aplicativo mobile de organização cotidiana: uma "agenda inteligente" para registrar datas importantes, acompanhar tarefas e receber lembretes no momento certo, reduzindo esquecimentos e facilitando o planejamento pessoal e profissional.

A documentação completa do projeto está em [`docs/Muvora-Documentacao-v0.1.pdf`](docs/Muvora-Documentacao-v0.1.pdf).

## Status

**Versão 0.1: estrutura inicial.** O esqueleto do app, a camada de dados e o serviço de notificações estão prontos; as telas de cadastro ainda precisam ser implementadas.

## Princípios

Simplicidade de uso · confiabilidade dos lembretes · funcionamento offline · organização do código · evolução incremental · desenvolvimento orientado por testes e feedback de usuários.

## Estrutura

```
muvora/
├── docs/                  # Documentação do projeto (PDF)
├── backend/               # Reservado: API Python futura (fora do MVP)
├── assets/                # Ícones e imagens
└── src/
    ├── app/               # Telas (Expo Router): Painel, Tarefas, Datas
    ├── components/        # Componentes reutilizáveis
    ├── constants/         # Tema e categorias
    ├── db/                # SQLite: conexão, migrações e repositórios
    ├── services/          # Notificações locais (agendar/cancelar/atualizar)
    ├── types/             # Tipos TypeScript do domínio
    └── utils/             # Utilitários (datas, recorrência anual)
```

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) LTS e o app **Expo Go** no celular (ou um emulador).

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go. Outros comandos úteis:

```bash
npm run typecheck      # verificação de tipos
npm run lint           # lint
npx expo-doctor        # diagnóstico de dependências
```

>Notificações **locais** funcionam no Expo Go; para recursos de push (futuros) é necessário um [development build](https://docs.expo.dev/develop/development-builds/introduction/). Instale novas dependências sempre com `npx expo install <pacote>`.

## Autor

Arquitetado e idealizado por **Murilo Moretto Marques**.