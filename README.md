<div align="center">
  <h1>NutriDiet</h1>
</div>

<p align="center">
  <img src="https://img.shields.io/github/languages/code-size/yuriBaza23/nutriDiet"/>
  <img src="https://img.shields.io/github/last-commit/yuriBaza23/nutriDiet"/>
  <img src="https://img.shields.io/github/license/yuriBaza23/nutriDiet"/>
  <img src="https://wakatime.com/badge/github/yuriBaza23/NutriDiet.svg"/>
</p>

----

## Sumário
- [ Descrição do projeto ](#description)
- [ Arquitetura do sistema ](#system-architecture)
- [ Interface de serviço ](#service-interface)
- [ Executando a aplicação ](#-how-to-run-)
- [ Estrutura de pastas ](#-client-directory-explained-)
- [ Dependências do projeto ](#-project-dependencies-)
- [ Perguntas e respostas ](#-qa-)
- [ Documentação ](#-useful-documentation-)
- [ Licensa ](#license)

## Descrição do projeto <a name="description"></a>
**NutriDiet** é uma aplicação que permite que um paciente e um nutricionista possam se comunicar de forma mais eficiente, onde o paciente pode fornecer dados sobre suas preferências alimentares e o nutricionista pode fornecer uma dieta personalizada para o paciente.

Essa comunicação ocorre por meio de videochamadas, onde o nutricionista pode fazer uma consulta com o paciente e o paciente pode tirar dúvidas com o nutricionista.

A visão do cardápio é feita instantâneamente para ambos e pode ser baixado no dispositivo por meio de um QR Code.

O objetivo desse projeto é, além de facilitar a comunicação entre nutricionista e paciente, aprender sobre os desafios de um sistema distribuído, envolvendo `concorrência`, `consistência`, `disponibilidade` e outros.

## Arquitetura do sistema <a name="system-architecture"></a>
O sistema é composto por `cliente`, `servidor`, `banco de dados`, `servidor em nuvem` e `serviço de videochamada`.
- Cliente: Será criado a partir do framework `NextJS` na versão 13, onde será responsável pela interface do usuário e requisições ao servidor. Tal interface lidará com rotas dinâmicas, onde o usuário poderá acessar a página de login, cadastro, perfil, cardápio, etc. Ainda, conterá a visualização do cardápio, onde o usuário poderá baixar o cardápio em PDF por meio de um QR Code. Essa mesma tela conterá a vídeochamada entre os envolvidos. O detalhamento sobre essas funcionalidades podem ser vistas na sessão `Interface de serviço`. O cliente se comunucará com o servidor em núvem por meio de um *service worker* e com demais serviços por meio de requisições HTTP. A obtenção de dados em tempo real será feita por meio de `websockets` e a vídeo chamada será feita por meio de `webRTC`.
- Servidor: Será feito em `NodeJS` com a utilização do framework `NestJS`. Seu funcionamento ocorre através de rotas que acessam arquivos de serviço, que por sua vez acessam o banco de dados. O servidor se comunica com o banco de dados por meio de `ORM` e com demais serviços por meio de requisições HTTP. A obtenção de dados em tempo real será feita por meio de `websockets`.
- Banco de dados: Será feito em `PostgreSQL` e será acessado por meio de `ORM`.
- Servidor em nuvem: Será utilizado o serviço de notificações `Cloud Messaging` do `Firebase` para notificar o cliente sobre novas mensagens. Esse servidor pode ser acessado pelo cliente através do *Service Worker* e pelo servidor internamente por requisições http.
- Serviço de videochamada: Será utilizado o protocolo `WebRTC` para a comunicação entre os envolvidos.

<img
  alt="Arquitetura do sistema"
  style="width: 100%;"
  src="./assets/architecture.png"
/>

## Interface de serviço <a name="service-interface"></a>
A interface de serviço é composta pelos seguintes serviços:

#### Login
- POST /auth
  - Descrição: Rota usada para autenticar um usuário
  - Body: { email: string, password: string }
  - Resposta: 
    - 200: { user: IUser, token: string }
    - 401: { message: string }
    - 500: { message: string }
<br/>
- GET /auth/history
  - Descrição: Rota usada para obter o histórico de login de um usuário
  - Header: { Authorization: string }
  - Resposta: 
    - 200: { history: ILoginHistory[] }
    - 401: { message: string }
    - 500: { message: string }

#### Usuário (paciente ou nutricionista)
- POST /user
  - Descrição: Rota usada para cadastrar um usuário. O parâmetro `type` está diretamente ligado as permissões do usuário
  - Body: { name: string, email: string, password: string, type: string }
  - Resposta: 
    - 200: { user: IUser }
    - 400: { message: string }
    - 500: { message: string }
<br/>
- GET /user/:id
  - Descrição: Rota usada para obter os dados de um usuário
  - Header: { Authorization: string }
  - Params: { id: string }
  - Resposta:
    - 200: { user: IUser }
    - 403: { message: string }
    - 500: { message: string }
<br/>
- PUT /user
  - Descrição: Rota usada para atualizar os dados de um usuário
  - Header: { Authorization: string }
  - Body: { name: string, email: string, password: string }
  - Resposta:
    - 200: { user: IUser }
    - 403: { message: string }
    - 500: { message: string }
<br/>
- DELETE /user
  - Descrição: Rota usada para deletar um usuário
  - Header: { Authorization: string }
  - Resposta:
    - 200: { user: IUser }
    - 403: { message: string }
    - 500: { message: string }
<br/>
- GET /user
  - Descrição: Rota usada para obter os dados de todos os usuários
  - Resposta:
    - 200: { users: IUser[] }
    - 400: { message: string }
    - 500: { message: string }

#### Permissões
- PUT /permission
  - Descrição: Rota usada para atualizar as permissões de um usuário. Essas permissões estão relacionadas ao tipo de usuário e serão usadas para permitir ou não o acesso a determinadas rotas e serviços
  - Header: { Authorization: string }
  - Body: { type: string }
  - Resposta:
    - 200: { permission: IPermission }
    - 400: { message: string }
    - 500: { message: string }
<br/>
- GET /permission
  - Descrição: Rota usada para obter as permissões de um usuário
  - Header: { Authorization: string }
  - Body: { type: string }
  - Resposta:
    - 200: { permission: IPermission }
    - 400: { message: string }
    - 500: { message: string }
    
#### Preferências alimentares
- POST /foodPreference
  - Descrição: Rota usada para cadastrar uma preferência alimentar
<br/>
- GET /foodPreference/:id
  - Descrição: Rota usada para obter uma preferência alimentar
<br/>
- PUT /foodPreference/:id
  - Descrição: Rota usada para atualizar uma preferência alimentar
<br/>
- DELETE /foodPreference
  - Descrição: Rota usada para deletar uma preferência alimentar
<br/>
- GET /foodPreference
  - Descrição: Rota usada para obter as preferências alimentares de todos os usuários

#### Cardápio
- POST /menu
  - Descrição: Rota usada para cadastrar um cardápio
<br/>
- GET /menu/:id
  - Descrição: Rota usada para obter um cardápio
<br/>
- PUT /menu/:id
  - Descrição: Rota usada para atualizar um cardápio
<br/>
- DELETE /menu
  - Descrição: Rota usada para deletar um cardápio
<br/>
- GET /menu
  - Descrição: Rota usada para obter os cardápios de todos os usuários

#### Refeições
- POST /meal
  - Descrição: Rota usada para cadastrar uma refeição
<br/>
- GET /meal/:id
  - Descrição: Rota usada para obter uma refeição
<br/>
- PUT /meal/:id
  - Descrição: Rota usada para atualizar uma refeição
<br/>
- DELETE /meal
  - Descrição: Rota usada para deletar uma refeição

#### Alergias/Intolerâncias
- POST /allergy
  - Descrição: Rota usada para cadastrar uma alergia/intolerância
<br/>
- GET /allergy/:id
  - Descrição: Rota usada para obter uma alergia/intolerância
<br/>
- PUT /allergy/:id
  - Descrição: Rota usada para atualizar uma alergia/intolerância
<br/>
- DELETE /allergy
  - Descrição: Rota usada para deletar uma alergia/intolerância

#### Paciente
- POST /patient
  - Descrição: Rota usada para cadastrar um paciente
<br/>
- GET /patient/:id
  - Descrição: Rota usada para obter um paciente
<br/>
- DELETE /patient
  - Descrição: Rota usada para deletar um paciente

#### Notificações
- POST /push/notification
  - Descrição: Rota usada para enviar uma notificação
<br/>
- POST /push/subscribe
  - Descrição: Rota usada para registrar um token de notificação
<br/>
- GET /push/notification
  - Descrição: Rota usada para obter as notificações de um usuário

#### Vídeo chamada
Rotas a definir