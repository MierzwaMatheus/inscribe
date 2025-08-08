---
title: BD de Eventos
order: 1
description: Documentação do banco de dados de eventos da InBot.
keywords: [bd, eventos, inbot]
---

## Autenticação

### Gerar JWT Token

**POST /api/botId/{botId}/auth/token**

**Segurança:** Público, mas valida botId + accessKey.

**Descrição:** Gera um JWT Token válido a partir da accessKey (fornecida manualmente) e do botId. Use esse token no header Authorization para chamar todos os endpoints protegidos.

**Path Parameters**

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| botId | number | sim | ID do bot |

**Request Body**

```json
{
  "accessKey": "SUA_ACCESS_KEY_AQUI"
}
```

accessKey (string, 32 caracteres): chave fornecida ao cliente.

**Resposta 201**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Erros Comuns Autenticação

| Código | Descrição |
|---|---|
| 403 | Acesso negado (accessKey inválida) |
| 404 | Bot não encontrado |

### Uso do JWT Token nos demais endpoints

Inclua sempre no header:

`Authorization: Bearer <seu_jwt_token>`

```bash
curl -X GET "https://api.inbot.com.br/v2/api/botId/123/eventsDataBase/flowNames" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## FlowNames

### Obter todos os nomes de fluxos

**GET /api/botId/{botId}/eventsDataBase/flowNames**

**Header:** Authorization: Bearer <token>

**Descrição:** Retorna todos os nomes de fluxos (tabelas) disponíveis para o bot informado.

**Path Parameters**

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| botId | number | sim | ID do bot |

**Resposta 200**

```json
{
  "flows": [
    { "flowName": "flow_atendimento" },
    { "flowName": "flow_feedback" },
    { "flowName": "flow_pagamento" }
  ]
}
```

### Erros Comuns FlowNames

| Código | Descrição |
|---|---|
| 400 | Parâmetros inválidos |
| 404 | Não foram encontrados fluxos para este bot |

## EventsDataBase

### Buscar dados na base de eventos

**GET /api/botId/{botId}/eventsDataBase/search**

**Header:** Authorization: Bearer <token>

**Descrição:** Retorna os dados cadastrados na base de eventos, filtrados por tipo de servidor, intervalo de datas e nome do fluxo.

**Path Parameters**

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| botId | number | sim | ID do bot |

**Query Parameters**

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dbUserBotServerType | string | sim | Tipo de servidor (production, dev ou staging) |
| startDate | date-time | sim | Data/hora inicial (ex.: 2021-01-01T00:00:00Z) |
| endDate | date-time | sim | Data/hora final (ex.: 2021-01-02T00:00:00Z) |
| flowName | string | sim | Nome do fluxo (nome da tabela) |

**Resposta 200**

```json
{
  "variable_is_append": "1",
  "protocol_number": "20240422123456-123-abc",
  "ficha_id": 123456,
  "user_variable_date_insert": "2024-04-22 12:34:56",
  "flow_name": "Fluxo de Teste",
  "flow_step_name": "Pergunta 1",
  "bot_id": 123,
  "user_variable_key_name": "resposta",
  "user_variable_key_value": "Resposta do usuário",
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_variable_id": 12345,
  "user_id": "usuario@dominio.com"
}
```

### Erros Comuns EventsDataBase

| Código | Descrição |
|---|---|
| 400 | Parâmetro inválido |
| 401 | Não autorizado |

### Exemplos de Uso

**1. Listar todos os nomes de fluxos para o bot 123**

```bash
curl -X GET "https://api.inbot.com.br/v2/api/botId/123/eventsDataBase/flowNames" \
-H "Authorization: Bearer <seu_jwt_token>"
```

**2. Buscar eventos para o bot 123 no ambiente production**

```bash
curl -X GET "https://api.inbot.com.br/v2/api/botId/123/eventsDataBase/search?dbUserBotServerType=production&startDate=2025-01-01T00:00:00Z&endDate=2025-01-07T23:59:59Z&flowName=fluxo_exemplo" \
-H "Authorization: Bearer <seu_jwt_token>"
```

