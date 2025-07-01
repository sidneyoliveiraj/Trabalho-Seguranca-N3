# Trabalho-Segurança-N3 – Assinatura Digital

## Descrição

Sistema de gestão de relatórios de despesas, utilizando **Assinaturas Digitais** para garantir autenticidade, integridade e não repúdio dos documentos, conforme a disciplina Segurança da Informação (Prof. Claudinei Dias – N3).

---

## Funcionalidades

- **Login seguro** com autenticação JWT e senha criptografada
- **CRUD de Funcionários**
- **Cadastro de Relatórios de Despesas**
- **Aprovação/Rejeição de Relatórios**
- **Assinatura Digital de Relatórios**
- **Verificação de Assinatura Digital**
- **Notificação por E-mail** ao assinar relatório
- **Controle de Acesso por Cargo** (RBAC)

---

## Tecnologias Utilizadas

- **Frontend**: Next.js (React), Material-UI, Tailwind CSS
- **Backend**: Node.js + Express
- **Banco de Dados**: MongoDB Atlas
- **Criptografia**: Node.js Crypto, JWT
- **E-mail**: Nodemailer

---

## Como rodar o projeto

1. **Clone o repositório**
    ```bash
    git clone https://github.com/seuusuario/Trabalho-Seguranca-N3.git
    ```

2. **Instale as dependências**
    - Backend:
        ```bash
        cd backend
        npm install
        ```
    - Frontend:
        ```bash
        cd ../frontend
        npm install
        ```

3. **Configure o `.env` na pasta backend**
    ```
    MONGODB_URI=sua_string_do_mongodb
    JWT_SECRET=uma_chave_segura
    EMAIL_USER=seu_email@gmail.com
    EMAIL_PASS=sua_senha_de_app
    ```

4. **Inicie o backend**
    ```bash
    cd backend
    npm start
    # ou
    node server.js
    ```

5. **Inicie o frontend**
    ```bash
    cd ../frontend
    npm run dev
    ```

O sistema vai abrir em: [http://localhost:3000](http://localhost:3000)

---

## Telas/Caminhos

- `/login` – Login do usuário
- `/dashboard` – Painel Principal
- `/employees` – CRUD de Funcionários
- `/submitExpense` – Envio de Relatórios
- `/pendingExpenses` – Aprovação pelo gerente
- `/signExpense` – Assinar digitalmente
- `/signedExpenses` – Relatórios assinados
- `/verifySignature` – Verificar autenticidade

---

## Autores

- Sidney Cardoso de Oliveira Junior
- Leonardo Nascimento

**Professor:** Claudinei Dias (Ney)  
**Disciplina:** Segurança da Informação – N3  
**Católica SC**
