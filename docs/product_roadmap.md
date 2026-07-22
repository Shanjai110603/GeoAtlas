# GeoAtlas — Master Product Requirements Document & Roadmap

## 1. Project Vision

**GeoAtlas** is an **open-source, community-driven Geographic Intelligence Platform** that combines mapping, geographic knowledge, GIS analysis, collaboration, and AI into a single modular ecosystem.

It is **not intended to compete directly with Google Maps or OpenStreetMap**, but rather to sit above them as a unified platform that integrates multiple open datasets into a structured **Geographic Knowledge Graph**.

The long-term objective is to create the **"Wikipedia + GitHub + VS Code + ArcGIS + AI" for geography**, where every place on Earth can be explored, analyzed, edited, compared, and queried.

---

## 2. Core Philosophy

- **Completely Open Source**: 100% open-source codebase with zero mandatory vendor lock-in or licensing costs.
- **Community Driven**: Built for and powered by global contributors with peer review and moderation.
- **BYOD (Bring Your Own Data) Friendly**: Easily connect custom GeoJSON, Shapefiles, or PostGIS databases.
- **API First**: REST and GraphQL endpoints power Web, Mobile, Desktop, CLI, and third-party extensions.
- **AI Native**: Built-in NLP query understanding, image OCR, automated duplicate detection, and translation.
- **Privacy Respecting**: No user tracking or behavioral profiling; robust data security across all platforms.
- **Modular & Extensible**: Modular plugin architecture so individual features evolve independently.

---

## 3. Primary Goals

1. Model every location on Earth across all administrative and physical levels.
2. Support country-specific administrative hierarchies (e.g. India: State → District → Taluk → Panchayat → Village; Japan: Prefecture → Municipality → Ward; Germany: Bundesland → Kreis → Gemeinde).
3. Provide structured geographic intelligence via connected Knowledge Graph nodes.
4. Enable community contributions backed by a transparent trust and moderation framework.
5. Provide open developer APIs, GIS spatial analysis tools, and multi-modal routing.
6. Enable natural language AI querying over spatial and demographic metrics.

---

## 4. Scope of Geographic Coverage

```text
Earth
 └─ Continents
     └─ Subcontinents / Regions
         └─ Countries
             └─ States / Prefectures / Bundesländer
                 └─ Counties / Districts / Kreise
                     └─ Municipalities / Taluks / Tehsils
                         └─ Cities / Towns / Panchayats / Villages
                             └─ Neighborhoods / Wards
                                 └─ Postal Codes
                                     └─ Roads & Streets
                                         └─ Buildings & POIs
                                             └─ Businesses, Hospitals, Schools
```

---

## 5. Geographic Knowledge Graph & Location Pages

Every entity maintains explicit spatial and structural relationships.

### Example Graph Relationship:
`Udumalpet` *(City)* → `belongs_to` → `Tiruppur District` → `belongs_to` → `Tamil Nadu` → `belongs_to` → `India`
`Udumalpet` → `contains` → `Schools`, `Hospitals`, `Businesses`, `Roads`, `Postal Codes`, `Rivers`

### Information Stored per Location:
- **Identity**: Official name, Native names (e.g., அபோலோ / Noto Sans Tamil font support), Alternate names, Historical names.
- **Geography**: Coordinates, Elevation, Surface area, Boundary geometry, Land cover, Climate classification.
- **Demographics**: Population, Density, Growth rate, Languages, Literacy rates.
- **Administrative**: Country code, Admin level number, Local term, Hierarchy closure tree.
- **Infrastructure**: Roads, Airports, Ports, Railway stations, Transit stops.
- **Public Services & Business**: Hospitals, Schools, Police stations, Businesses with ratings, reviews, and presigned storefront photos.
- **History & Culture**: Historical timeline, Heritage markers, Local festivals.

---

## 6. Trust, Moderation & Reputation Model

### Trust Tier Model
```text
Official Government Data (Highest Confidence)
 └─ Verified Organizations (NGOs, Universities)
     └─ Trusted Contributors (High reputation score)
         └─ New Contributors (Requires Peer / Moderator Review)
```

### Verification & Auditability:
Every edit tracks: `Source`, `Timestamp`, `Author ID`, `Version Diff`, `Confidence Score`.

### Reputation System:
- Contributors earn XP and unlock badges for accepted edits, photo uploads, reviews, and data validations.
- Higher reputation unlocks trusted editor status, automated edit approvals, and moderator review rights.

---

## 7. Open Data Sources & Attribution

GeoAtlas prioritizes zero-cost open datasets:

| Dataset | Purpose | License |
|---|---|---|
| **OpenStreetMap** | Roads, buildings, POIs, physical features | ODbL |
| **GeoNames** | Place names, cities, alternate names | CC-BY 4.0 |
| **Natural Earth** | Countries, coastlines, physical geography | Public Domain |
| **geoBoundaries** | Authoritative administrative boundaries | CC-BY 4.0 |
| **Wikidata** | Structured entity metadata & taxonomy | CC0 |
| **World Bank / UN Data** | Economic & demographic indicators | CC-BY 4.0 |
| **NASA / NOAA / OpenAQ** | Environmental, satellite, weather & AQI data | Open Data |

---

## 8. Open-Source Projects to Learn From

- **Mapping**: MapLibre GL JS, Leaflet, OpenLayers
- **GIS**: QGIS, Turf.js, Uber H3
- **Editing**: OpenStreetMap iD Editor, StreetComplete
- **Routing**: OSRM, GraphHopper, OpenTripPlanner
- **Knowledge**: Wikipedia, Wikidata, GeoNames
- **Community & Data**: OpenStreetMap, Natural Earth, geoBoundaries, World Bank

---

## 9. Modular Feature Breakdown (38 Modules) & Roadmap

All platform capabilities are organized into 38 independent modules:

```text
Phase 1–3 (Completed & Tested):
 - Core PostGIS Spatial DB, Fastify REST & GraphQL API Engine
 - Next.js 14 SSR Web Client (MapLibre, Search, Compare, Moderation Queue)
 - Android Expo Native App (expo-secure-store, expo-sqlite 24h offline cache)
 - Windows Electron Native App (keytar Credential Manager, contextBridge IPC)
 - Shared @geoatlas/core Workspace Package

Phase 4: Map Creator & True Size Tools (Modules 10, 11, 27)
 - True Size Mercator distortion correction overlay
 - MapChart style region painting & legend editor
 - Export PNG, SVG, PDF, GeoJSON, KML, GPX

Phase 5: Gamification & Extended Community Features (Modules 6, 7, 29)
 - XP, level progression, badges, leaderboards
 - Push notification dispatch for edit approvals

Phase 6: Advanced GIS & Environmental Analysis (Modules 12, 15, 16)
 - Buffer, union, intersect, clip, dissolve, viewshed, watershed
 - Live weather radar, AQI, wildfire/earthquake alerts

Phase 7: AI Geographic Assistant & Natural Language Engine (Module 8)
 - Natural language spatial querying ("Hospitals within 10 km")
 - Image OCR & automated duplicate entity detection

Phase 8: Enterprise Workspaces & Plugin Ecosystem (Modules 35, 36, 37)
 - Private organization workspaces, SSO, audit logging
 - Extensible plugin system & ETL pipeline scheduler
```
