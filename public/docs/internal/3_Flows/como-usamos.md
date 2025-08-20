Aqui está seu texto corrigido e levemente padronizado para melhor clareza e gramática:

---

# 🛠️ Como usamos

## WhatsApp

### Criação do JSON

1. Crie um flow no WhatsApp Business.
2. Adicione os componentes necessários.
3. Publique o flow.

### Chamado de API

Tomas escrever (aqui você pode detalhar o que o Tomas deve escrever).

#### Sinch

(Aqui insira instruções específicas, se houver.)

#### Smarters

(Aqui insira instruções específicas, se houver.)

## Web

Para usar na web, precisamos do JSON criado no WhatsApp Business.  
Salve-o no seu computador no formato `.json`.

## Subir o JSON

1. Acesse: [https://in.bot/inbot-admin?action=files&bot_id=${BOT_ID}](https://in.bot/inbot-admin?action=files&bot_id=${BOT_ID})
2. Clique em `Adicionar arquivo`.
3. Selecione o arquivo `.json` que você salvou.
4. Clique em `Subir`.
5. Depois, ele fornecerá um link, por exemplo: `https://files.in.bot/upload/${BOT_ID}$/flow.json`
6. Copie o link e vá para a ficha do **INICIAR FLOWS**.
7. Em seguida, insira este código:

```html
<script>
  initWhatsAppFlowsWidget({
    skeletonUrl: "https://files.in.bot/upload/${BOT_ID}$/flow.json",
    firstFicha: "PRIMERA_TELA_FLOW",
    payloadNext: "Frase de abertura",
  });
</script>
```

E é isso!

Agora o código vai utilizar as mesmas fichas que foram criadas para o WhatsApp.
