export interface CountryHierarchyMapping {
  countryCode: string; // ISO 2-letter
  countryName: string;
  continent: string;
  nativeScriptTerms?: Record<string, Record<string, string>>; // languageCode -> levelKey -> nativeText
  level0: string; // Earth
  level1: string; // Continent
  level2: string; // Subregion
  level3: string; // Country (ADM0)
  level4: string; // ADM1 (State / Province)
  level5: string; // ADM2 (District / County)
  level6: string; // ADM3 (Taluk / Sub-district)
  level7: string; // ADM4 (City / Town / Village)
  level8: string; // Neighborhood / Ward
  level9: string; // Postal Code
  level10: string; // Street / Road
  level11: string; // Building / POI
  level12: string; // Business / Hospital / School
}

export const INDIAN_REGIONAL_SCRIPT_TERMS: Record<string, Record<string, string>> = {
  hi: {
    state: 'राज्य (State)',
    district: 'जिला (District)',
    taluk: 'तहसील / तालुका (Tehsil/Taluk)',
    city: 'नगर / गांव (City/Village)',
    ward: 'वार्ड / मोहल्ला (Ward/Mohallah)',
    pin: 'पिन कोड (PIN Code)',
    street: 'सड़क (Street)',
  },
  ta: {
    state: 'மாநிலம் (State)',
    district: 'மாவட்டம் (District)',
    taluk: 'வட்டம் / தாலுகா (Taluk)',
    city: 'நகரம் / கிராமம் (City/Village)',
    ward: 'வார்டு / பகுதி (Ward)',
    pin: 'அஞ்சல் குறியீடு (PIN Code)',
    street: 'தெரு / சாலை (Street/Road)',
  },
  te: {
    state: 'రాష్ట్రం (State)',
    district: 'జిల్లా (District)',
    taluk: 'మండలం / తాలూకా (Mandal/Taluk)',
    city: 'నగరం / గ్రామం (City/Village)',
    ward: 'వార్డు (Ward)',
    pin: 'పిన్ కోడ్ (PIN Code)',
    street: 'వీధి / రోడ్డు (Street/Road)',
  },
  kn: {
    state: 'ರಾಜ್ಯ (State)',
    district: 'ಜಿಲ್ಲೆ (District)',
    taluk: 'ತಾಲೂಕು (Taluk)',
    city: 'ನಗರ / ಗ್ರಾಮ (City/Village)',
    ward: 'ವಾರ್ಡ್ (Ward)',
    pin: 'ಅಂಚೆ ಸಂಕೇತ (PIN Code)',
    street: 'ರಸ್ತೆ / ಬೀದಿ (Road/Street)',
  },
  ml: {
    state: 'സംസ്ഥാനം (State)',
    district: 'ജില്ല (District)',
    taluk: 'താലൂക്ക് (Taluk)',
    city: 'നഗരം / ഗ്രാമം (City/Village)',
    ward: 'വാർഡ് (Ward)',
    pin: 'പിൻകോഡ് (PIN Code)',
    street: 'തെരുവ് / റോഡ് (Street/Road)',
  },
  bn: {
    state: 'রাজ্য (State)',
    district: 'জেলা (District)',
    taluk: 'মহকুমা / উপজেলা (Upazila)',
    city: 'শহর / গ্রাম (City/Village)',
    ward: 'ওয়ার্ড (Ward)',
    pin: 'পিন কোড (PIN Code)',
    street: 'রাস্তা (Street)',
  },
  mr: {
    state: 'राज्य (State)',
    district: 'जिल्हा (District)',
    taluk: 'तालुका (Taluk)',
    city: 'शहर / गाव (City/Village)',
    ward: 'प्रभाग / वार्ड (Ward)',
    pin: 'पिन कोड (PIN Code)',
    street: 'रस्ता (Street)',
  },
  gu: {
    state: 'રાજ્ય (State)',
    district: 'જિલ્લો (District)',
    taluk: 'તાલુકો (Taluk)',
    city: 'શહેર / ગામ (City/Village)',
    ward: 'વોર્ડ (Ward)',
    pin: 'પિન કોડ (PIN Code)',
    street: 'શેરી / રસ્તો (Street/Road)',
  },
};

export const WORLD_HIERARCHY_MAPPINGS: CountryHierarchyMapping[] = [
  // --- INDIA ---
  {
    countryCode: 'IN',
    countryName: 'India',
    continent: 'Asia',
    nativeScriptTerms: INDIAN_REGIONAL_SCRIPT_TERMS,
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
    countryCode: 'CN',
    countryName: 'China',
    continent: 'Asia',
    level0: 'Earth',
    level1: 'Asia',
    level2: 'Eastern Asia',
    level3: 'Country (China)',
    level4: 'Province Sheng / Autonomous Region (e.g. Guangdong)',
    level5: 'Prefecture Dishi (e.g. Guangzhou)',
    level6: 'County Xian / District Qu (e.g. Tianhe District)',
    level7: 'Township Xiang / Sub-district Jiedao',
    level8: 'Village Cun / Community Shequ',
    level9: 'Postal Code (e.g. 510000)',
    level10: 'Street Lu / Jie',
    level11: 'Building & POI',
    level12: 'Business / Storefront',
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    continent: 'Asia',
    level0: 'Earth',
    level1: 'Asia',
    level2: 'Eastern Asia',
    level3: 'Country (Japan)',
    level4: 'Prefecture Todōfuken (e.g. Tokyo)',
    level5: 'Subprefecture / District Gun',
    level6: 'Municipality Shi/Ku (e.g. Shinjuku Ward)',
    level7: 'District Machi/Aza',
    level8: 'Chōme / Neighborhood',
    level9: 'Postal Code Yūbinbangō (e.g. 160-0021)',
    level10: 'Street Banchi',
    level11: 'Building & POI',
    level12: 'Business / Storefront',
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    continent: 'North America',
    level0: 'Earth',
    level1: 'North America',
    level2: 'Northern America',
    level3: 'Country (United States)',
    level4: 'State (e.g. California)',
    level5: 'County (e.g. Los Angeles County)',
    level6: 'Township / Municipality',
    level7: 'City / Town (e.g. Los Angeles)',
    level8: 'Neighborhood (e.g. Hollywood)',
    level9: 'ZIP Code (e.g. 90028)',
    level10: 'Street & Road',
    level11: 'Building & POI',
    level12: 'Business / School',
  }
];

export function getHierarchyMapping(countryCode: string): CountryHierarchyMapping {
  const upper = countryCode.toUpperCase();
  const found = WORLD_HIERARCHY_MAPPINGS.find((m) => m.countryCode === upper);
  if (found) return found;

  return {
    countryCode: upper,
    countryName: countryCode,
    continent: 'Worldwide',
    level0: 'Earth',
    level1: 'Continent',
    level2: 'Subregion',
    level3: `Country (${upper})`,
    level4: 'State / Province (ADM1)',
    level5: 'District / County (ADM2)',
    level6: 'Taluk / Tehsil (ADM3)',
    level7: 'City / Town / Village (ADM4)',
    level8: 'Neighborhood / Ward',
    level9: 'Postal Code',
    level10: 'Street & Road',
    level11: 'Building & POI',
    level12: 'Business / Hospital / School',
  };
}
