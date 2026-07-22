export interface CountryHierarchyMapping {
  countryCode: string; // ISO 2-letter
  countryName: string;
  level0: string; // Earth
  level1: string; // Continent
  level2: string; // Subregion
  level3: string; // Country (ADM0)
  level4: string; // ADM1 (State / Prefecture / State / Province)
  level5: string; // ADM2 (District / County / District / Department)
  level6: string; // ADM3 (Taluk / Tehsil / Municipality / Sub-district)
  level7: string; // ADM4 (City / Town / Village / Commune)
  level8: string; // Neighborhood / Ward
  level9: string; // Postal Code
  level10: string; // Street / Road
  level11: string; // Building / POI
  level12: string; // Business / Hospital / School
}

export const WORLD_HIERARCHY_MAPPINGS: CountryHierarchyMapping[] = [
  {
    countryCode: 'IN',
    countryName: 'India',
    level0: 'Earth',
    level1: 'Asia',
    level2: 'Southern Asia',
    level3: 'Country (India)',
    level4: 'State / Union Territory (e.g. Tamil Nadu, Maharashtra)',
    level5: 'District (e.g. Chennai, Pune)',
    level6: 'Taluk / Tehsil / Sub-division (e.g. Ambattur, Haveli)',
    level7: 'City / Town / Village / Panchayat (e.g. Chennai, Kanchipuram)',
    level8: 'Neighborhood / Ward (e.g. Anna Nagar, Ward 85)',
    level9: 'Postal Index Number PIN (e.g. 600040)',
    level10: 'Street & Road (e.g. Mount Road, 2nd Avenue)',
    level11: 'Building & Point of Interest (e.g. Apollo Hospital)',
    level12: 'Business / Hospital / School / Storefront',
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    level0: 'Earth',
    level1: 'North America',
    level2: 'Northern America',
    level3: 'Country (United States)',
    level4: 'State (e.g. California, Texas, New York)',
    level5: 'County (e.g. Los Angeles County, Harris County)',
    level6: 'Township / Municipality / City Ward',
    level7: 'City / Town / Incorporated Village (e.g. Los Angeles)',
    level8: 'Neighborhood (e.g. Hollywood, Brooklyn)',
    level9: 'ZIP Code (e.g. 90028)',
    level10: 'Street & Road (e.g. Sunset Boulevard)',
    level11: 'Building & Point of Interest (e.g. TCL Chinese Theatre)',
    level12: 'Business / Hospital / School / Storefront',
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    level0: 'Earth',
    level1: 'Europe',
    level2: 'Western Europe',
    level3: 'Country (Germany)',
    level4: 'Bundesland (e.g. Bayern, Nordrhein-Westfalen)',
    level5: 'Regierungsbezirk / Landkreis / Kreisfreie Stadt (e.g. Oberbayern)',
    level6: 'Gemeindeverband / Amt',
    level7: 'Gemeinde / Stadt (e.g. München)',
    level8: 'Stadtteil / Ortsteil (e.g. Schwabing)',
    level9: 'Postleitzahl PLZ (e.g. 80331)',
    level10: 'Straße (e.g. Leopoldstraße)',
    level11: 'Gebäude & Point of Interest (e.g. BMW Welt)',
    level12: 'Geschäft / Krankenhaus / Schule',
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    level0: 'Earth',
    level1: 'Asia',
    level2: 'Eastern Asia',
    level3: 'Country (Japan)',
    level4: 'Prefecture Todōfuken (e.g. Tokyo, Osaka)',
    level5: 'Subprefecture / District Gun (e.g. Nishitama)',
    level6: 'Municipality City/Ward/Town/Village (e.g. Shinjuku Ward)',
    level7: 'District Machi/Aza',
    level8: 'Chōme / Neighborhood (e.g. Kabukichō 1-chōme)',
    level9: 'Postal Code (e.g. 160-0021)',
    level10: 'Street & Block Number (Banchi / Gō)',
    level11: 'Building & Point of Interest (e.g. Shinjuku Station)',
    level12: 'Business / Hospital / School / Storefront',
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    level0: 'Earth',
    level1: 'Europe',
    level2: 'Northern Europe',
    level3: 'Country (United Kingdom)',
    level4: 'Constituent Country (e.g. England, Scotland, Wales)',
    level5: 'County / Unitary Authority (e.g. Greater London, Yorkshire)',
    level6: 'District / Borough (e.g. City of Westminster)',
    level7: 'City / Town / Civil Parish (e.g. London, Edinburgh)',
    level8: 'Locality / Neighborhood (e.g. Soho, Camden)',
    level9: 'Postcode (e.g. SW1A 1AA)',
    level10: 'Street & Road (e.g. Oxford Street)',
    level11: 'Building & Point of Interest (e.g. Buckingham Palace)',
    level12: 'Business / Hospital / School / Storefront',
  },
];

export function getHierarchyMapping(countryCode: string): CountryHierarchyMapping {
  const upper = countryCode.toUpperCase();
  const found = WORLD_HIERARCHY_MAPPINGS.find((m) => m.countryCode === upper);
  if (found) return found;

  // Default fallback mapping for all other countries
  return {
    countryCode: upper,
    countryName: countryCode,
    level0: 'Earth',
    level1: 'Continent',
    level2: 'Subregion',
    level3: `Country (${upper})`,
    level4: 'State / Province / Region (ADM1)',
    level5: 'District / County / Department (ADM2)',
    level6: 'Taluk / Tehsil / Municipality (ADM3)',
    level7: 'City / Town / Village (ADM4)',
    level8: 'Neighborhood / Ward',
    level9: 'Postal Code',
    level10: 'Street & Road',
    level11: 'Building & Point of Interest (POI)',
    level12: 'Business / Hospital / School / Storefront',
  };
}
