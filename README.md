# GeoAtlas — Core Spatial & Geographic Knowledge Backend (Phase 1)

GeoAtlas is a global geographic knowledge platform built on PostgreSQL/PostGIS, Python Data Ingestion Pipelines, Node.js + TypeScript Fastify REST + GraphQL API, Meilisearch, MinIO Object Storage, OSRM Routing, and Community Moderation Engine.

---

## Architecture Stack

- **Database**: PostgreSQL 15 + PostGIS 3.3 (Spatial GiST/GIN indices, `admin_hierarchy_closure` table with automated insert/re-parenting triggers).
- **Ingestion Pipelines**: Python 3.11 (`services/ingestion/`) with modular pipelines for Natural Earth, geoBoundaries, GeoNames, OpenStreetMap PBF extracts, OSRM preprocessor (`osrm-extract`, `osrm-partition`, `osrm-customize`), Wikidata, and World Bank indicators.
- **API Engine**: Node.js + TypeScript Fastify API (`services/api/`) with REST (`/v1/...`) endpoints and Apollo GraphQL Server (`/graphql`) schema.
- **Search Engine**: Meilisearch search indexer with DB fallbacks.
- **Geocoding Service**: Nominatim geocoding & reverse-geocoding proxy with LRU caching.
- **Object Storage**: MinIO S3-compatible storage for business directory photos and review images.
- **Routing Engine**: OSRM HTTP proxy service for spatial routing.
- **Trust & Moderation**: RBAC Trust Tier system (`new`, `trusted`, `verified_org`, `official`, `moderator`) with auto-approval thresholds and moderator edit merging.
- **Licensing & Attribution**: Automatic ODbL (OpenStreetMap) and CC-BY-SA / CC-BY 4.0 attribution headers injected into all API responses.

---

## Directory Layout

```text
GeoAtlas/
├── docker-compose.yml              # PostgreSQL+PostGIS, Redis, Meilisearch, MinIO
├── .env.example                    # Environment settings template
├── db/
│   ├── init.sql                    # Main database schema, spatial indices & tables
│   └── closure_triggers.sql        # Re-parenting & closure table maintenance triggers
├── services/
│   ├── ingestion/                  # Python Data Ingestion Suite
│   │   ├── main.py                 # Ingestion CLI runner
│   │   ├── base_pipeline.py        # Abstract Base Pipeline class with attribution & audit logs
│   │   ├── db.py                   # Python DB pool & pipeline audit log helper
│   │   └── pipelines/              # Source-specific ingestion modules
│   │       ├── natural_earth.py
│   │       ├── geoboundaries.py
│   │       ├── geonames.py
│   │       ├── osm_pbf.py
│   │       ├── osrm_preprocessor.py
│   │       ├── wikidata.py
│   │       └── worldbank.py
│   └── api/                        # Fastify REST + GraphQL API Engine
│       ├── package.json
│       ├── src/
│       │   ├── index.ts            # Server entry point & Fastify plugins
│       │   ├── config.ts           # Config & environment variables
│       │   ├── db/                 # Postgres connection pool & PostGIS queries
│       │   ├── services/           # Storage, Search, Geocoding, GIS, Auth, Moderation
│       │   ├── routes/             # REST API routes (/v1/...)
│       │   └── graphql/            # Apollo GraphQL schema & resolvers
└── tests/                          # Integration & Concurrent Load Testing Suite
    ├── jest.config.js
    └── integration/
        ├── database.test.ts
        ├── search_and_geocode.test.ts
        ├── moderation_flow.test.ts
        └── load_test.test.ts
```

---

## Quickstart & Local Setup

### 1. Launch Services Infrastructure
```bash
docker-compose up -d
```

### 2. Run Data Ingestion Pipelines (Validation Region: India / Tamil Nadu)
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

The REST API will be listening on `http://localhost:3000/v1/...` and the GraphQL playground at `http://localhost:3000/graphql`.

### 4. Run Integration & Concurrent Load Tests
```bash
cd services/api
npm test
```

---

## Key API Endpoints (`/v1/...`)

- `GET /v1/search?q=...&type=...` — Full-text and entity search
- `GET /v1/geocode?address=...` — Geocoding address lookup
- `GET /v1/reverse-geocode?lat=...&lng=...` — Coordinates reverse geocoding
- `GET /v1/admin/{id}` — Admin unit detail & children
- `GET /v1/admin/{id}/hierarchy` — Closure table multi-level ancestor chain
- `GET /v1/entities/{id}` — Entity detail
- `GET /v1/entities?near=lat,lng&radius=meters` — Spatial radius lookup
- `GET /v1/compare?ids=id1,id2` — Spatial unit area & metric comparison
- `GET /v1/statistics/{admin_id}` — Demographic & entity counts
- `GET /v1/business/{id}` — Business directory detail & reviews
- `POST /v1/business/{id}/photos` — Upload business photo to MinIO storage
- `POST /v1/contributions` — Submit contribution / edit
- `POST /v1/contributions/{id}/review` — Approve/reject pending edit (Moderators)
- `GET /v1/route?from=lat,lng&to=lat,lng` — Spatial routing proxy
- `POST /v1/auth/signup` & `POST /v1/auth/login` — Authentication & JWT tokens
