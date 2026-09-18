# 🚚 Fast Feet

API para gerenciamento de encomendas desenvolvida com **Node.js e NestJS**, aplicando princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

O projeto simula o funcionamento de uma transportadora, permitindo gerenciar usuários, entregadores, destinatários e o ciclo completo das encomendas, desde sua criação até a entrega ou devolução.

A aplicação também implementa regras de autorização baseadas em **RBAC (Role-Based Access Control)**, autenticação utilizando **Guards**, notificações disparadas por **Domain Events** e upload de fotos para confirmação de entrega.

## 🚀 Tecnologias

* **Node.js**
* **NestJS**
* **TypeScript**
* **ESM (ECMAScript Modules)**
* **Zod** — validação e tipagem dos dados de entrada
* **Vitest** — testes unitários e E2E
* **Prisma ORM**
* **PostgreSQL**
* **Docker**
* **Multer** — upload de arquivos
* **Cloudflare R2** — armazenamento de arquivos
* **Amazon S3 API** — integração com o armazenamento
* **JWT** — autenticação
* **Guards do NestJS**
* **RBAC** — controle de acesso baseado em papéis

## 🏗️ Arquitetura

O projeto foi desenvolvido utilizando conceitos de **Clean Architecture** e **Domain-Driven Design (DDD)**, buscando manter as regras de negócio independentes de frameworks e detalhes de infraestrutura.

A aplicação é organizada em módulos e separa responsabilidades entre diferentes camadas:

```text
src/
├── core/
│   ├── entities/
│   ├── errors/
│   ├── events/
│   └── ...
│
├── domain/
│   └── transportation/
│       ├── application/
│       │   ├── repositories/
│       │   └── use-cases/
│       │
│       └── enterprise/
│           ├── entities/
│           ├── events/
│           └── value-objects/
│
└── infra/
    ├── auth/
    ├── database/
    ├── http/
    │   ├── controllers/
    │   └── ...
    ├── storage/
    └── ...
```

### Princípios utilizados

* Separação entre regras de negócio e infraestrutura
* Inversão de dependências
* Dependency Injection
* Use Cases
* Repository Pattern
* Entities
* Value Objects
* Domain Events
* Agregados
* Mapeamento entre domínio e persistência
* Validação de entrada
* Testes isolados das implementações externas

## 📦 Principais funcionalidades

### 👤 Usuários

Gerenciamento de usuários do sistema com diferentes níveis de acesso:

* Administradores
* Entregadores

Cada usuário possui permissões específicas de acordo com sua função.

### 🔐 Autenticação e autorização

A API utiliza autenticação baseada em **JWT**.

A autorização é implementada utilizando **RBAC**, permitindo restringir determinadas operações de acordo com o papel do usuário autenticado.

Exemplo:

```text
ADMIN
 ├── Gerenciar usuários
 ├── Gerenciar entregadores
 ├── Gerenciar destinatários
 └── Gerenciar encomendas

DELIVERY_PERSON
 ├── Visualizar suas encomendas
 ├── Retirar encomendas
 ├── Entregar encomendas
 └── Devolver encomendas
```

A autenticação e as permissões são controladas através de **Guards** e regras de autorização aplicadas às rotas.

## 📦 Gerenciamento de encomendas

O sistema implementa o ciclo de vida completo de uma encomenda.

Entre as operações disponíveis estão:

* Criação de encomendas
* Associação de encomendas a entregadores
* Consulta de encomendas
* Consulta de encomendas por destinatário
* Consulta de encomendas por entregador
* Filtragem por status
* Filtragem por bairro
* Retirada de encomendas
* Entrega de encomendas
* Devolução de encomendas
* Atualização da localização da entrega
* Confirmação da entrega através de fotografia

### 🔄 Ciclo da encomenda

Uma encomenda pode passar por diferentes estados durante seu ciclo de vida:

```text
PENDING
   ↓
PICKED_UP
   ↓
DELIVERED
```

Em situações de devolução:

```text
PENDING
   ↓
PICKED_UP
   ↓
RETURNED
```

As transições de estado são controladas pelas regras de negócio da aplicação.

## 📸 Confirmação de entrega

Para confirmar uma entrega, o sistema exige o envio de uma **fotografia da entrega**.

O fluxo de upload utiliza:

```text
Cliente
   ↓
NestJS
   ↓
Multer
   ↓
Storage Service
   ↓
Cloudflare R2
```

O armazenamento utiliza a **API compatível com Amazon S3**, permitindo realizar o upload dos arquivos para o Cloudflare R2 através do padrão S3.

Essa abordagem também mantém a implementação de armazenamento desacoplada da regra de negócio, permitindo substituir o provedor futuramente sem alterar os casos de uso.

## 🔔 Domain Events

O projeto utiliza **Domain Events** para desacoplar comportamentos que acontecem como consequência de mudanças no domínio.

Por exemplo, quando o status de uma encomenda é alterado, um evento de domínio pode ser disparado:

```text
Order
  ↓
Status alterado
  ↓
OrderStatusChangedEvent
  ↓
Event Handler / Subscriber
  ↓
SendNotificationUseCase
  ↓
Notificação
```

Dessa forma, a entidade e os casos de uso principais não precisam conhecer diretamente os serviços responsáveis pelas notificações.

Essa abordagem facilita a extensão do sistema e mantém as responsabilidades bem separadas.

## 🧪 Testes

A aplicação possui uma suíte de testes utilizando **Vitest**, cobrindo tanto as regras de negócio quanto o comportamento da API.

### Testes unitários

Utilizados para testar isoladamente componentes e regras do domínio, como:

* Entities
* Value Objects
* Use Cases
* Regras de negócio
* Validações
* Repositórios em memória

### Testes E2E

Os testes E2E verificam o comportamento da aplicação através das rotas HTTP, incluindo:

* Autenticação
* Autorização
* Gerenciamento de usuários
* Gerenciamento de destinatários
* Criação e consulta de encomendas
* Alteração de status
* Permissões de administradores e entregadores
* Upload de arquivos
* Regras relacionadas à entrega

Exemplo de execução:

```bash
npm run test
```

Para os testes E2E:

```bash
npm run test:e2e
```

## 🗂️ Organização da aplicação

A aplicação utiliza **módulos** para separar os diferentes contextos e responsabilidades do sistema.

Cada módulo possui seus próprios componentes, como:

```text
Module
 ├── Controllers
 ├── Services / Use Cases
 ├── Repositories
 └── Providers
```

Os **Controllers** ficam responsáveis pela comunicação HTTP, enquanto os **Services/Use Cases** concentram a execução dos casos de uso da aplicação.

As regras de negócio permanecem dentro da camada de domínio sempre que possível.

## 🛡️ Validação com Zod

A entrada de dados da API é validada utilizando **Zod**.

Isso permite validar:

* Body
* Query parameters
* Route parameters
* Dados necessários para execução dos casos de uso

Exemplo conceitual:

```typescript
const schema = z.object({
  name: z.string().min(3),
  email: z.email(),
})
```

A validação evita que dados inválidos avancem para as camadas responsáveis pelas regras de negócio.

## 🐳 Docker

O projeto utiliza **Docker** para facilitar a configuração do ambiente de desenvolvimento e execução dos serviços necessários, como o PostgreSQL.

Exemplo:

```bash
docker compose up -d
```

## ⚙️ Configuração

Clone o projeto:

```bash
git clone <repository-url>
```

Entre no diretório:

```bash
cd fast-feet
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Configure as informações necessárias para:

* Banco de dados
* JWT
* Cloudflare R2
* Credenciais de armazenamento

Depois, execute a aplicação:

```bash
npm run start:dev
```

## 📋 Principais regras de negócio

O projeto possui regras específicas para garantir a integridade do fluxo de uma transportadora.

Entre elas:

* Usuários possuem diferentes papéis e permissões.
* Administradores possuem permissões administrativas sobre os recursos do sistema.
* Entregadores podem acessar apenas operações permitidas para seu papel.
* Um entregador não pode acessar encomendas pertencentes a outro entregador.
* A encomenda possui um ciclo de status controlado.
* Determinadas operações só podem ser executadas em estados específicos da encomenda.
* A entrega exige uma fotografia para ser confirmada.
* A fotografia enviada é armazenada externamente.
* Alterações relevantes no domínio podem disparar Domain Events.
* Dados recebidos pela API são validados antes de chegar às regras de negócio.

## 🎯 Objetivos do projeto

O Fast Feet foi desenvolvido com foco não apenas na implementação das funcionalidades, mas também na aplicação de conceitos de arquitetura e engenharia de software.

Principais objetivos:

* Praticar **NestJS** em uma aplicação realista
* Aplicar **Clean Architecture**
* Aplicar conceitos de **DDD**
* Trabalhar com **Domain Events**
* Implementar autenticação e autorização com **JWT + RBAC**
* Desenvolver APIs REST
* Trabalhar com upload e armazenamento de arquivos
* Implementar testes unitários e E2E
* Trabalhar com PostgreSQL e Prisma
* Aplicar princípios de desacoplamento e inversão de dependências

## 📚 Conceitos praticados

* Clean Architecture
* Domain-Driven Design
* SOLID
* Dependency Injection
* Repository Pattern
* Use Cases
* Entities
* Value Objects
* Domain Events
* Event Handlers / Subscribers
* RBAC
* JWT Authentication
* Guards
* REST API
* Testes Unitários
* Testes E2E
* File Upload
* Cloud Storage
* PostgreSQL
* Prisma
* Docker
* ESM

## 👨‍💻 Sobre o projeto

O **Fast Feet** é um projeto desenvolvido para aprofundar conhecimentos em desenvolvimento backend com **Node.js e NestJS**, explorando desde a construção de APIs REST até conceitos mais avançados de arquitetura, domínio, autorização, eventos e testes.

O projeto busca representar um cenário próximo ao de uma aplicação real de logística, utilizando regras de negócio para controlar o gerenciamento e a entrega de encomendas.
