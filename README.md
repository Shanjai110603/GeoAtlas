# GeoAtlas — Open Geographic Intelligence Platform

GeoAtlas is an **open-source, community-driven Geographic Intelligence Platform** that integrates mapping, spatial data, administrative knowledge, GIS analysis, collaboration, and AI into a single modular ecosystem.

> **Positioning**: GeoAtlas sits above baseline mapping providers, synthesizing open spatial data into a unified **Geographic Knowledge Graph** — the *"Wikipedia + GitHub + VS Code + ArcGIS + AI"* for global geography.

---

## 1. Core Philosophy & Principles

- **Completely Open Source & Zero Mandatory License Costs**: Built on open standards, open-source software, and open data.
- **BYOD (Bring Your Own Data) & API-First**: Modular REST and GraphQL APIs powering Web, Mobile, Desktop, and CLI clients.
- **AI-Native & Privacy-Respecting**: Natural language geographic querying, automated duplicate detection, and robust user data privacy.
- **Connected Knowledge Graph**: Every geographic entity—countries, districts, cities, villages, roads, rivers, buildings, businesses—is interconnected with explicit spatial and hierarchical relationships.
- **Strong Trust & Provenance Moderation**: Tiered reputation model (Official → Verified Org → Trusted Editor → New Contributor) with automated diff checks, source attribution, and moderator approval queues.

---

## 2. Complete Scope of Geographic Coverage

GeoAtlas models geography at every administrative and spatial level, preserving country-specific terminology:

```text
Earth
 └─ Continents (e.g. Asia, Europe)
     └─ Subregions / Regions
         └─ Countries (e.g. India, Japan, Germany, USA)
             └─ States / Prefectures / Bundesländer
                 └─ Districts / Counties / Kreise
                     └─ Taluks / Tehsils / Municipalities / Wards
                         └─ Cities / Towns / Panchayats / Villages
                             └─ Neighborhoods / Wards
                                 └─ Postal Codes
                                     └─ Streets & Roads
                                         └─ Buildings & Points of Interest (POIs)
                                             └─ Businesses, Hospitals, Schools
```

---

## 3. Architecture & Monorepo Layout

```text
GeoAtlas/
├── packages/
│   └── core/                       # Shared @geoatlas/core workspace package (Types, API client, Schemas)
├── web/                            # Phase 2 Web Client (Next.js 14 SSR, MapLibre GL JS, TanStack Query, Recharts)
├── mobile/                         # Phase 3 Android Client (Expo / React Native, MapLibre RN, expo-secure-store, SQLite cache)
├── desktop/                        # Phase 3 Windows Client (Electron, TypeScript, keytar / Windows Credential Manager)
├── services/
│   ├── api/                        # Node.js + TypeScript Fastify REST (/v1/...) & GraphQL API Engine
│   └── ingestion/                  # Python 3.11 Data Ingestion Suite (Natural Earth, geoBoundaries, GeoNames, OSM PBF)
├── db/                             # PostgreSQL 15 + PostGIS 3.3 schemas & recursive closure table triggers
├── docker-compose.yml              # PostGIS, Redis, Meilisearch, MinIO, OSRM, Martin Tile Server
└── docs/                           # Architecture specs, master PRD, and product roadmap
```

---

## 4. Open Data Sources & Licensing Integration

GeoAtlas synthesizes open datasets into a single graph with automated licensing and ODbL / CC-BY attribution injection:

| Dataset | Primary Purpose | License |
|---|---|---|
| **OpenStreetMap** | Roads, buildings, POIs, physical infrastructure | ODbL |
| **GeoNames** | Place names, cities, alternate & native names | CC-BY 4.0 |
| **Natural Earth** | Global coastlines, physical geography, country shapes | Public Domain |
| **geoBoundaries** | Authoritative multi-level administrative boundaries | CC-BY 4.0 |
| **Wikidata** | Structured entity metadata, Wikidata IDs, P31 types | CC0 |
| **World Bank** | Economic indicators, GDP, demographic statistics | CC-BY 4.0 |
| **UN Data / NASA / NOAA** | Population statistics, climate, satellite & environmental data | Open Data |

---

## 5. Quickstart & Local Execution

### Prerequisites
- Node.js 18+ & npm 10+
- Python 3.11+
- Docker & Docker Compose

### 1. Launch Infrastructure Services
```bash
docker-compose up -d
```
*Starts PostgreSQL/PostGIS (`:5432`), Redis (`:6379`), Meilisearch (`:7700`), MinIO (`:9000`), OSRM (`:5000`), and Martin Tile Server (`:3001`).*

### 2. Run Data Ingestion Suite (Validation Region: India / Tamil Nadu)
```bash
cd services/ingestion
pip install -r requirements.txt
python main.py --source all
```

### 3. Run API Engine
```bash
cd services/api
npm install
npm run dev
```
*REST API will listen on `http://localhost:3000/v1/...` and GraphQL playground at `http://localhost:3000/graphql`.*

### 4. Run Web Client
```bash
cd web
npm install
npm run dev
```
*Web application will be live at `http://localhost:4000`.*

### 5. Run Android Mobile Client
```bash
cd mobile
npm install
npx expo start
```

### 6. Run Windows Desktop Client
```bash
cd desktop
npm install
npm run build
npm start
```

---

## 6. Testing

```bash
# Run web & shared core unit test suite
cd web
npm run test:unit

# Run backend API integration test suite
cd services/api
npm test
```

---

## 7. Master Modular Roadmap Summary (38 Modules)

- **Phases 1–3 (Completed)**: Core PostGIS backend, Fastify REST/GraphQL API, Next.js 14 SSR web client, Android Expo app, Windows Electron app, `@geoatlas/core` workspace package.
- **Phase 4 (Next)**: True Size Distortion Engine (Module 10) & Map Creator (Module 11 - region painting, PNG/SVG/PDF export).
- **Phase 5**: Gamification & Reputation System (Module 7 - XP, badges, leaderboards, push notifications).
- **Phase 6**: Advanced GIS Tools & Environmental Intelligence (Modules 12, 15, 16 - buffer, intersect, viewshed, weather, AQI).
- **Phase 7**: AI Geographic Assistant & Natural Language Engine (Module 8 - NLP queries, image OCR, auto-summaries).
- **Phase 8**: Enterprise Workspaces & Plugin Ecosystem (Modules 35, 36, 37).

*For the complete PRD and 38-module feature breakdown, see [`docs/product_roadmap.md`](file:///c:/Users/shanj/OneDrive/Desktop/GeoAtlas/docs/product_roadmap.md).*
