# GeoAtlas — 12-Level Worldwide Geographic Hierarchy Model

**Version:** 1.0

This document defines the complete **12-Level Geographic Knowledge Graph Hierarchy** for GeoAtlas across all countries worldwide.

---

## 1. Master 12-Level Hierarchy Tree

```text
Earth (Level 0)
 └─ Continents (Level 1 e.g. Asia, Europe, North America, South America, Africa, Oceania, Antarctica)
     └─ Subregions / Regions (Level 2 e.g. Southern Asia, Western Europe, Northern America)
         └─ Countries (Level 3 - ADM0 e.g. India, Japan, Germany, USA, Brazil, Nigeria, Australia)
             └─ States / Prefectures / Bundesländer (Level 4 - ADM1)
                 └─ Districts / Counties / Kreise (Level 5 - ADM2)
                     └─ Taluks / Tehsils / Municipalities / Wards (Level 6 - ADM3)
                         └─ Cities / Towns / Panchayats / Villages (Level 7 - ADM4)
                             └─ Neighborhoods / Wards (Level 8)
                                 └─ Postal Codes (Level 9)
                                     └─ Streets & Roads (Level 10)
                                         └─ Buildings & Points of Interest (POIs) (Level 11)
                                             └─ Businesses, Hospitals, Schools (Level 12)
```

---

## 2. Country-Specific Administrative Term Mappings

### 🇮🇳 India (IN)
| Level | GeoAtlas Standard | Local Indian Nomenclature | Example |
|---|---|---|---|
| **Level 0** | Earth | Earth | Earth |
| **Level 1** | Continent | Asia | Asia |
| **Level 2** | Subregion | Southern Asia | Southern Asia |
| **Level 3** | Country (ADM0) | India | India |
| **Level 4** | ADM1 | State / Union Territory | Tamil Nadu |
| **Level 5** | ADM2 | District | Chennai District |
| **Level 6** | ADM3 | Taluk / Tehsil / Sub-division | Ambattur Taluk |
| **Level 7** | ADM4 | City / Town / Village / Panchayat | Chennai / Kanchipuram |
| **Level 8** | Neighborhood | Ward / Neighborhood | Anna Nagar |
| **Level 9** | Postal Code | PIN Code (Postal Index Number) | 600040 |
| **Level 10** | Street / Road | Street / Road / Avenue | 2nd Avenue |
| **Level 11** | POI | Building & Point of Interest | Apollo Speciality Hospital |
| **Level 12** | Business | Hospital / Business / Storefront | Apollo Cardiology Wing |

---

### 🇺🇸 United States (US)
| Level | GeoAtlas Standard | US Local Nomenclature | Example |
|---|---|---|---|
| **Level 0** | Earth | Earth | Earth |
| **Level 1** | Continent | North America | North America |
| **Level 2** | Subregion | Northern America | Northern America |
| **Level 3** | Country (ADM0) | United States | United States |
| **Level 4** | ADM1 | State | California |
| **Level 5** | ADM2 | County | Los Angeles County |
| **Level 6** | ADM3 | Township / Municipality | City of Los Angeles |
| **Level 7** | ADM4 | City / Town / Incorporated Village | Los Angeles |
| **Level 8** | Neighborhood | Neighborhood / District | Hollywood |
| **Level 9** | Postal Code | ZIP Code | 90028 |
| **Level 10** | Street / Road | Street / Boulevard / Avenue | Sunset Boulevard |
| **Level 11** | POI | Building & Point of Interest | TCL Chinese Theatre |
| **Level 12** | Business | Business / Hospital / School | IMAX Box Office |

---

### 🇩🇪 Germany (DE)
| Level | GeoAtlas Standard | German Nomenclature | Example |
|---|---|---|---|
| **Level 0** | Earth | Erde | Erde |
| **Level 1** | Continent | Europa | Europa |
| **Level 2** | Subregion | Westeuropa | Westeuropa |
| **Level 3** | Country (ADM0) | Deutschland | Deutschland |
| **Level 4** | ADM1 | Bundesland | Bayern |
| **Level 5** | ADM2 | Regierungsbezirk / Landkreis | Oberbayern |
| **Level 6** | ADM3 | Gemeindeverband / Amt | München Stadt |
| **Level 7** | ADM4 | Gemeinde / Stadt | München |
| **Level 8** | Neighborhood | Stadtteil / Ortsteil | Schwabing |
| **Level 9** | Postal Code | Postleitzahl (PLZ) | 80331 |
| **Level 10** | Street / Road | Straße | Leopoldstraße |
| **Level 11** | POI | Gebäude / Point of Interest | BMW Welt |
| **Level 12** | Business | Geschäft / Museum / Schule | BMW Museum Store |

---

### 🇯🇵 Japan (JP)
| Level | GeoAtlas Standard | Japanese Nomenclature | Example |
|---|---|---|---|
| **Level 0** | Earth | Earth | 地球 (Earth) |
| **Level 1** | Continent | Asia | アジア (Asia) |
| **Level 2** | Subregion | Eastern Asia | 東アジア (Eastern Asia) |
| **Level 3** | Country (ADM0) | Japan | 日本 (Japan) |
| **Level 4** | ADM1 | Prefecture (Todōfuken) | 東京都 (Tokyo) |
| **Level 5** | ADM2 | Subprefecture / District (Gun) | 西多摩郡 (Nishitama) |
| **Level 6** | ADM3 | Municipality (Shi / Ku / Machi) | 新宿区 (Shinjuku Ward) |
| **Level 7** | ADM4 | District (Machi / Aza) | 歌舞伎町 (Kabukichō) |
| **Level 8** | Neighborhood | Chōme / Block | 歌舞伎町 1丁目 |
| **Level 9** | Postal Code | Postal Code (Yūbinbangō) | 160-0021 |
| **Level 10** | Street / Road | Street & Block Number (Banchi) | 1-19-1 |
| **Level 11** | POI | Building & Point of Interest | Shinjuku Station |
| **Level 12** | Business | Business / Storefront | Lumine Est Shinjuku |
