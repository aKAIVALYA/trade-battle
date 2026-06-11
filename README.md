# 🤖 AI Trading Agent

<div align="center">

**Three AI models. One market. One secret: every trade they make is reversed.**



</div>

---

## 📸 Screenshots

<table>
<tr>
<td width="60%">

**📈 Portfolio Performance — Claude vs DeepSeek vs Qwen**
![Performance Chart](./Screenshot_2026-06-12_000713.png)
Starting capital: **$1,000 each** · Tracked every 5 minutes

</td>
<td width="40%">

**🔁 Recent Agent Invocations**
![Recent Invocations](./Screenshot_2026-06-12_000749.png)
Live feed of model cycles

</td>
</tr>
</table>

---

## 🧠 What Is This?

An autonomous experiment that runs **Claude, DeepSeek, and Qwen** as independent crypto traders on the [ZK Lighter](https://zklighter.elliot.ai) perpetuals DEX — each starting with $1,000, each making real decisions from live market data.

**The twist 🔀** — every trade is secretly inverted before execution. If a model says `LONG`, it goes `SHORT`. The experiment tests whose *wrong* reasoning loses the least money.

Each model independently:
- Analyzes live price data, EMA-20 & MACD across 5m and 4h timeframes
- Decides to open/close leveraged positions on SOL, ZEC, or HYPE
- Gets its performance charted against the others in real time

---

## ✨ Features

| | Feature | Detail |
|---|---|---|
| 🔄 | **Multi-LLM Racing** | Claude, DeepSeek & Qwen trade in parallel, same data |
| 🔀 | **Trade Inversion** | Every LONG → SHORT, every SHORT → LONG, silently |
| 📊 | **Live Indicators** | 5m & 4h EMA-20 + MACD fed to each model per cycle |
| 📈 | **Performance Dashboard** | React + Recharts portfolio curves in real time |
| 🗃️ | **Full Audit Trail** | Every invocation & tool call logged to PostgreSQL |
| ⚡ | **Bun Runtime** | Zero-transpile TypeScript, fast cold starts |
| 🔌 | **OpenRouter** | Single API key for all three LLMs |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│           Scheduler  (every 5 min)   │
└────────────────┬─────────────────────┘
                 │  invokeAgent() × 3
      ┌──────────┼──────────┐
      ▼          ▼          ▼
  [Claude]  [DeepSeek]   [Qwen]   ← OpenRouter AI SDK
      └──────────┼──────────┘
                 │ tool calls
                 ▼
         createPosition()          ← direction inverted 🔀
         closeAllPosition()
                 │
                 ▼
        ZK Lighter DEX             SOL / ZEC / HYPE
                 │
                 ▼
          PostgreSQL               Prisma ORM
                 │
          ┌──────┴──────┐
          ▼             ▼
    Express API      React Frontend
  /performance      Recharts chart
  /invocations      Invocation feed
```

---

## 📁 Project Structure

```
ai-trading-agent/
├── index.ts            # Orchestrator — invokes all models every 5 min
├── prompt.ts           # LLM prompt template (portfolio + indicators injected)
├── markets.ts          # SOL / ZEC / HYPE market configs
├── indicators.ts       # EMA & MACD calculations
├── stockData.ts        # Fetches candlesticks → computes indicators
├── createPosition.ts   # Opens leveraged positions on ZK Lighter
├── cancelOrder.ts      # Closes all open positions
├── openPositions.ts    # Fetches current positions per account
├── getPortfolio.ts     # Portfolio value & available cash
├── backend.ts          # Express API: /performance & /invocations
├── priceTracker.ts     # Snapshots portfolio value periodically
├── config.ts           # Base URL & account constants
├── prisma/schema.prisma
└── frontend/src/
    ├── App.tsx
    └── components/
        ├── PerformanceChart.tsx
        ├── RecentInvocations.tsx
        └── Navbar.tsx
```

---

## 🚀 Getting Started

**Prerequisites:** [Bun](https://bun.sh) v1.2+, PostgreSQL, OpenRouter API key, ZK Lighter API keys (one per model)

```bash
# 1. Clone & install
git clone https://github.com/your-username/ai-trading-agent.git
cd ai-trading-agent && bun install

# 2. Set environment variables
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/trading_agent"' >> .env
echo 'OPENROUTER_API_KEY="sk-or-..."' >> .env

# 3. Run migrations
bunx prisma migrate deploy && bunx prisma generate

# 4. Seed models into the DB
```

```sql
INSERT INTO "Models" (id, name, "openRoutermodelName", "lighterApiKey", "accountIndex") VALUES
  (gen_random_uuid(), 'Claude',   'anthropic/claude-3.5-sonnet', 'lighter-key-1', '0'),
  (gen_random_uuid(), 'Deepseek', 'deepseek/deepseek-chat',      'lighter-key-2', '1'),
  (gen_random_uuid(), 'Qwen',     'qwen/qwen-2.5-72b-instruct',  'lighter-key-3', '2');
```

```bash
# 5. Start everything
bun run index.ts          # Trading agent (terminal 1)
bun run backend.ts        # REST API     (terminal 2)
cd frontend && bun run dev # Dashboard    (terminal 3) → http://localhost:5173
```

---

## 📊 Markets & Indicators

**Supported Markets**

| Symbol | Market ID | Leverage |
|--------|-----------|----------|
| SOL    | 2         | 10x      |
| ZEC    | 90        | 5x       |
| HYPE   | 24        | 10x      |

**Indicators fed to each model per cycle**

| Indicator | Timeframes     | Window         |
|-----------|----------------|----------------|
| Mid Price | 5m · 4h        | Last 10 values |
| EMA-20    | 5m · 4h        | 20-period EMA  |
| MACD      | 5m · 4h        | EMA-12 − EMA-26|

All arrays ordered **oldest → newest** in the prompt.

---

## 🌐 API Reference

```
GET /performance          → time-series portfolio values (cached 5 min)
GET /invocations?limit=N  → recent LLM invocations with tool call metadata
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Bun |
| Language | TypeScript 5 |
| LLMs | OpenRouter + Vercel AI SDK (`streamText`) |
| Database | PostgreSQL + Prisma ORM |
| Backend | Express 5 |
| Frontend | React + Vite + Recharts |
| Exchange | ZK Lighter (zkSync perpetuals DEX) |

---

## ⚙️ Configuration

| File | Purpose |
|------|---------|
| `config.ts` | ZK Lighter base URL & account index |
| `markets.ts` | Add/remove markets or adjust precision |
| `prompt.ts` | Customize instructions sent to each model |
| `index.ts` | Change invocation interval (default: 5 min) |

---

> ⚠️ **Disclaimer** — This is an educational experiment involving real leveraged crypto trading. Do not use funds you cannot afford to lose.
