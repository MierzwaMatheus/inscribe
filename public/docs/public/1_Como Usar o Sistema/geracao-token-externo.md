---
title: Geração de Token Externo
order: 2
description: Aprenda a gerar um token de autenticação externa para seu bot de forma segura.
keywords: [token, jwt, autenticação, api, segurança, bot]
---

## Endpoint

**POST /botId/{botId}/auth/token**

## Descrição

Este endpoint permite gerar um token JWT para autenticação externa do bot.

## Parâmetros

### Path Parameters

*   `botId` (number): ID do bot para o qual o token será gerado

### Body

```json
{
  "accessKey": "string" // Chave de acesso do bot
}
```

## Resposta

```json
{
  "token": "string" // Token JWT gerado
}
```

## Detalhes Técnicos

*   O endpoint utiliza o serviço de autenticação para gerar um token JWT
*   A chave de acesso (accessKey) é validada antes da geração do token
*   O token gerado pode ser usado para autenticação em outras requisições ao sistema

## Exemplo de Uso

### Request

```bash
curl -X POST \
'http://dominio-inbot-homol-ou-prod/v2/api/botId/<bot-id>/auth/token' \
-H 'Content-Type: application/json' \
-d '{
"accessKey": "sua-chave-de-acesso"
}'
```

### Response

```json
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Observações

*   A chave de acesso (accessKey) será provida pela inbot e é única para cada bot id
*   O token gerado tem um tempo de expiração definido
*   Mantenha o token seguro e não o compartilhe com terceiros


