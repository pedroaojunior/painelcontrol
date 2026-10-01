# 🎛️ Painel de Controle de Automação Residencial (n8n)

Um painel de controle web moderno, rápido e responsivo projetado para acionar automações do **n8n** diretamente pelo smartphone ou computador (localmente ou via GitHub Pages).

---

## ⚙️ Configuração Automática do Webhook (`config.js` / `config.json`)

Para que a aplicação carregue o link do webhook do seu n8n automaticamente ao abrir a página (sem precisar digitar na tela), edite o arquivo **`config.js`**:

```javascript
window.N8N_CONFIG = {
  WEBHOOK_URL: "https://seu-n8n.com/webhook/controle-alexa"
};
```

> 💡 **Nota:** Substitua `"https://seu-n8n.com/webhook/controle-alexa"` pela URL real do seu webhook do n8n.
> 
> Você também pode optar por usar o arquivo **`config.json`** com o mesmo valor:
> ```json
> {
>   "WEBHOOK_URL": "https://seu-n8n.com/webhook/controle-alexa"
> }
> ```

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
   - `config.js`
   - `config.json`
   - `style.css`
   - `script.js`
3. No GitHub, acesse **Settings** > **Pages**.
4. Em **Branch**, selecione `main` (ou `master`) e clique em **Save**.
5. O seu painel lerá a URL configurada no `config.js` e estará pronto para usar!

---

## 🏠 Testando Localmente

Basta abrir o arquivo `index.html` no seu navegador ou rodar com o *Live Server* do VS Code.
