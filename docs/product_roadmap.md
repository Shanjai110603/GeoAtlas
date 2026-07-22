# GeoAtlas — Master Product Requirements Document, Reference Library & Roadmap

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

## 3. Positioning Matrix vs Existing Platforms

| Capability | GeoAtlas | Google Maps | OpenStreetMap | Wikipedia | QGIS | MapChart | True Size Of |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Interactive Maps** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Community Editing** | ✅ | Limited | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Geographic Knowledge Graph** | ✅ | Partial | Partial | Partial | ❌ | ❌ | ❌ |
| **Administrative Hierarchy** | ✅ | Partial | ✅ | Partial | ✅ | ✅ | Countries only |
| **GIS Analysis** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **AI Geographic Search** | ✅ | Limited | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Custom Map Creation** | ✅ | Limited | ❌ | ❌ | Limited | ✅ | ❌ |
| **Open APIs** | ✅ | Paid | Partial | Yes | Plugins | ❌ | ❌ |
| **Offline / Self-hosting** | ✅ | ❌ | ✅ | Partial | ✅ | ❌ | ❌ |
| **Community Reputation** | ✅ | ❌ | Partial | ✅ | ❌ | ❌ | ❌ |
| **Open Source** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |

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

## 5. Curated Reference Library & Open Ecosystem

### Open Geographic Data Sources
| Dataset | Purpose | License / Link |
|---|---|---|
| **OpenStreetMap** | Roads, POIs, buildings, physical features | [OpenStreetMap](https://www.openstreetmap.org) (ODbL) |
| **GeoNames** | Cities, villages, place names | [GeoNames](https://www.geonames.org) (CC-BY 4.0) |
| **Natural Earth** | Countries, coastlines, physical geography | [Natural Earth](https://www.naturalearthdata.com) (Public Domain) |
| **geoBoundaries** | Authoritative administrative boundaries | [geoBoundaries](https://www.geoboundaries.org) (CC-BY 4.0) |
| **Wikidata / Wikipedia** | Structured metadata & encyclopedic context | [Wikidata](https://www.wikidata.org) (CC0) / [Wikipedia](https://www.wikipedia.org) |
| **OpenAddresses** | Street address datasets | [OpenAddresses](https://openaddresses.io) |

### Statistics, Weather & Live Data
- **Global Statistics**: [World Bank Data](https://data.worldbank.org), [Our World in Data](https://ourworldindata.org), [UN Data](https://data.un.org), [OECD Data](https://data.oecd.org)
- **Weather & Environment**: [NASA Earthdata](https://www.earthdata.nasa.gov), [Copernicus](https://www.copernicus.eu), [NOAA](https://www.noaa.gov), [USGS](https://www.usgs.gov), [OpenAQ](https://openaq.org), [GBIF](https://www.gbif.org)
- **Live Tracking & Remote Sensing**: [OpenSky Network](https://opensky-network.org), [USGS Earthquake Map](https://earthquake.usgs.gov), [MarineTraffic](https://www.marinetraffic.com)

### Open GIS, Routing & Graphics Software
- **Map Rendering**: [MapLibre GL JS](https://maplibre.org), [Leaflet](https://leafletjs.com), [OpenLayers](https://openlayers.org)
- **GIS Engines & Spatial Analytics**: [QGIS](https://qgis.org), [GeoServer](https://geoserver.org), [PostGIS](https://postgis.net), [Turf.js](https://turfjs.org), [Uber H3](https://h3geo.org), [GDAL](https://gdal.org)
- **Multi-Modal Routing**: [OSRM](https://project-osrm.org), [GraphHopper](https://www.graphhopper.com), [OpenTripPlanner](https://www.opentripplanner.org), [Valhalla](https://valhalla.github.io/valhalla)
- **Community Editing**: [iD Editor](https://github.com/openstreetmap/iD), [StreetComplete](https://github.com/streetcomplete/StreetComplete), [JOSM](https://josm.openstreetmap.de)
- **Photos & Street Imagery**: [Mapillary](https://www.mapillary.com), [Panoramax](https://panoramax.fr), [Wikimedia Commons](https://commons.wikimedia.org)

### Research Foundations
- **WorldKG**: *A World-Scale Geographic Knowledge Graph* ([arXiv:2109.10036](https://arxiv.org/abs/2109.10036))
- **GeoVectors**: *Embeddings for global geographic entities linked to Wikidata* ([arXiv:2108.13092](https://arxiv.org/abs/2108.13092))

---

## 6. Modular Feature Breakdown (38 Modules) & Roadmap

```text
Phases 1–3 (Completed & Tested):
 - Core PostGIS Spatial DB, Fastify REST & GraphQL API Engine
 - Next.js 14 SSR Web Client (MapLibre, Search, Compare, Moderation Queue)
 - Android Expo Native App (expo-secure-store, expo-sqlite 24h offline cache)
 - Windows Electron Native App (keytar Credential Manager, contextBridge IPC)
 - Shared @geoatlas/core Workspace Package

Phase 4 (Completed & Tested):
 - True Size Mercator distortion correction overlay with direct map shape drag
 - MapCreator Studio (region painting, legend editor, PNG/SVG/GeoJSON/CSV export)
 - Import/Export Suite

Phase 5: Gamification & Extended Community Features (Modules 6, 7, 29)
 - XP, level progression, badges, leaderboards (inspired by Stack Overflow & Pokémon GO Wayfarer)
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
