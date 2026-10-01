# 🎛️ Painel de Controle de Automação Residencial (n8n)

Um painel de controle web moderno, rápido e responsivo projetado para acionar automações do **n8n** diretamente pelo smartphone ou computador (localmente ou via GitHub Pages).

---

## 📱 Botões e Ações Mapeadas no n8n

O painel foi adaptado para se comunicar exatamente com a estrutura do fluxo de trabalho JSON fornecido:

| Dispositivo / Botão | Ação no Painel | Payload JSON Enviado para o n8n | Regra no Node `Switch` |
| :--- | :--- | :--- | :--- |
| **Portão (Abrir)** | Click | `{"dispositivo": "portao", "action": "abrir"}` | `$json.body.dispositivo == "portao"` (Dispara Voice Monkey Portão) |
| **Portão (Fechar)** | Click | `{"dispositivo": "portao", "action": "fechar"}` | `$json.body.dispositivo == "portao"` (Dispara Voice Monkey Portão) |
| **Luz do Quarto (Ligar)** | Click | `{"dispositivo": "quarto", "action": "ligar"}` | `$json.body.dispositivo == "quarto"` (Dispara Voice Monkey Quarto) |
| **Luz do Quarto (Desligar)** | Click | `{"dispositivo": "quarto", "action": "desligar"}` | `$json.body.dispositivo == "quarto"` (Dispara Voice Monkey Quarto) |
| **Ar Condicionado (Ligar)** | Click | `{"action": "ar_ligar"}` | `$json.body.action == "ar_ligar"` (Executa fluxo Tuya Ligar Ar) |
| **Ar Condicionado (Desligar)** | Click | `{"action": "ar_desligar"}` | `$json.body.action == "ar_desligar"` (Executa fluxo Tuya Desligar Ar) |

---

## 🚀 Como Usar no GitHub Pages

1. Crie um novo repositório no seu **GitHub** (ex: `painel-n8n`).
2. Envie os arquivos do projeto para o repositório:
   - `index.html`
   - `style.css`
   - `script.js`
3. No GitHub, acesse **Settings** > **Pages**.
4. Em **Branch**, selecione `main` (ou `master`) e clique em **Save**.
5. Em alguns instantes, o seu painel estará online no link fornecido pelo GitHub (ex: `https://seu-usuario.github.io/painel-n8n/`).

---

## ⚙️ Configuração da URL do n8n

1. Ao abrir o painel pela primeira vez no celular ou computador, clique no ícone de **Engrenagem ⚙️** no canto superior direito.
2. Cole a URL de produção do seu webhook do n8n (exemplo: `https://seu-n8n.com/webhook/controle-alexa`).
3. Clique em **Salvar URL**. 
4. A URL fica salva no navegador (`localStorage`), portanto não é necessário configurá-la novamente ao fechar a página.

---

## 🏠 Testando Localmente

Para rodar localmente no seu computador, basta abrir o arquivo `index.html` em qualquer navegador ou utilizar uma extensão como o *Live Server* do VS Code.
