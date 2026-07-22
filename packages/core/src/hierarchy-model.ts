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

export const INTERNATIONAL_SCRIPT_TERMS: Record<string, Record<string, string>> = {
  // --- EUROPEAN LANGUAGES ---
  de: {
    state: 'Bundesland (State)',
    district: 'Regierungsbezirk / Landkreis (District)',
    municipality: 'Gemeindeverband / Amt',
    city: 'Gemeinde / Stadt (City/Town)',
    neighborhood: 'Stadtteil / Ortsteil',
    postalCode: 'Postleitzahl PLZ',
    street: 'Straße (Street)',
  },
  fr: {
    state: 'Région (Region)',
    district: 'Département (Department)',
    municipality: 'Arrondissement / Canton',
    city: 'Commune (City/Town)',
    neighborhood: 'Quartier (Neighborhood)',
    postalCode: 'Code Postal',
    street: 'Rue / Avenue (Street/Road)',
  },
  es: {
    state: 'Comunidad Autónoma (State/Region)',
    district: 'Provincia (Province)',
    municipality: 'Comarca / Municipio',
    city: 'Municipio / Ciudad (City/Town)',
    neighborhood: 'Barrio / Colonia',
    postalCode: 'Código Postal',
    street: 'Calle / Avenida (Street/Road)',
  },
  it: {
    state: 'Regione (Region)',
    district: 'Provincia (Province)',
    municipality: 'Circondario / Mandamento',
    city: 'Comune (City/Town)',
    neighborhood: 'Quartiere / Rione',
    postalCode: 'Codice di Avviamento Postale CAP',
    street: 'Via / Corso (Street/Road)',
  },
  ru: {
    state: 'Область / Край / Республика (State/Region)',
    district: 'Район (District)',
    municipality: 'Городское поселение',
    city: 'Город / Село (City/Village)',
    neighborhood: 'Микрорайон / Kвартал',
    postalCode: 'Почтовый Индекс',
    street: 'Улица / Проспект (Street/Avenue)',
  },

  // --- AMERICAS ---
  pt_BR: {
    state: 'Estado (State)',
    district: 'Mesorregião / Microrregião',
    municipality: 'Município (Municipality)',
    city: 'Cidade / Distrito (City)',
    neighborhood: 'Bairro (Neighborhood)',
    postalCode: 'Código de Endereçamento Postal CEP',
    street: 'Rua / Avenida (Street/Avenue)',
  },

  // --- MIDDLE EAST & AFRICA ---
  ar: {
    state: 'منطقة (Mintaqah / Region)',
    district: 'محافظة (Muhafazah / Governorate)',
    municipality: 'مركز / قضاء (Marakiz/Qada)',
    city: 'مدينة / قرية (Madinah/Qaryah)',
    neighborhood: 'حي / محلة (Hayy/Neighborhood)',
    postalCode: 'الرمز البريدي (Postal Code)',
    street: 'شارع / طريق (Shari/Road)',
  },
  sw: {
    state: 'Jimbo (Province)',
    district: 'Wilaya (District)',
    municipality: 'Tarafa (Division)',
    city: 'Kata / Mtaa (Ward/Town)',
    neighborhood: 'Kijiji / Mtaa (Village/Street)',
    postalCode: 'Anwani ya Posta',
    street: 'Njia / Barabara (Road/Street)',
  },

  // --- ASIAN LANGUAGES ---
  zh: {
    state: '省 / 自治区 (Province)',
    district: '地级市 / 州 (Prefecture City)',
    municipality: '县 / 区 (County/District)',
    city: '乡 / 镇 / 街道 (Township/Sub-district)',
    neighborhood: '村 / 社区 (Village/Community)',
    postalCode: '邮政编码 (Postal Code)',
    street: '路 / 街 (Road/Street)',
  },
  ja: {
    state: '都道府県 (Prefecture)',
    district: '郡 / 支庁 (District/Subprefecture)',
    municipality: '市区町村 (Municipality)',
    city: '町 / 字 (District/Aza)',
    neighborhood: '丁目 (Chōme)',
    postalCode: '郵便番号 (Yūbinbangō)',
    street: '街 / 番地 (Banchi)',
  },
  ko: {
    state: '특별시 / 도 (Province)',
    district: '시 / 군 / 구 (City/District)',
    municipality: '읍 / 면 / 동 (Town/Neighborhood)',
    city: '리 (Ri / Village)',
    neighborhood: '통 / 반 (Block)',
    postalCode: '우편번호 (Postal Code)',
    street: '도로 (Doro / Street)',
  },
  th: {
    state: 'จังหวัด (Province)',
    district: 'อำเภอ / เขต (District)',
    municipality: 'ตำบล / แขวง (Sub-district)',
    city: 'หมู่บ้าน (Village)',
    neighborhood: 'ซอย (Soi Sub-street)',
    postalCode: 'รหัสไปรษณีย์ (Postal Code)',
    street: 'ถนน (Thanon / Street)',
  },

  // --- INDIAN REGIONAL LANGUAGES ---
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
  {
    countryCode: 'IN',
    countryName: 'India',
    continent: 'Asia',
    nativeScriptTerms: INTERNATIONAL_SCRIPT_TERMS,
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
    countryCode: 'DE',
    countryName: 'Germany',
    continent: 'Europe',
    nativeScriptTerms: INTERNATIONAL_SCRIPT_TERMS,
    level0: 'Earth',
    level1: 'Europe',
    level2: 'Western Europe',
    level3: 'Country (Germany)',
    level4: 'Bundesland (e.g. Bayern)',
    level5: 'Regierungsbezirk / Landkreis (e.g. Oberbayern)',
    level6: 'Gemeindeverband / Amt',
    level7: 'Gemeinde / Stadt (e.g. München)',
    level8: 'Stadtteil (e.g. Schwabing)',
    level9: 'Postleitzahl PLZ (e.g. 80331)',
    level10: 'Straße (e.g. Leopoldstraße)',
    level11: 'Gebäude & POI (e.g. BMW Welt)',
    level12: 'Geschäft / Schule',
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    continent: 'Europe',
    nativeScriptTerms: INTERNATIONAL_SCRIPT_TERMS,
    level0: 'Earth',
    level1: 'Europe',
    level2: 'Western Europe',
    level3: 'Country (France)',
    level4: 'Région (e.g. Île-de-France)',
    level5: 'Département (e.g. Paris)',
    level6: 'Arrondissement / Canton',
    level7: 'Commune (e.g. Paris)',
    level8: 'Quartier (e.g. Le Marais)',
    level9: 'Code Postal (e.g. 75004)',
    level10: 'Rue / Avenue (e.g. Rue de Rivoli)',
    level11: 'Bâtiment & POI (e.g. Musée du Louvre)',
    level12: 'Commerce / École',
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    continent: 'South America',
    nativeScriptTerms: INTERNATIONAL_SCRIPT_TERMS,
    level0: 'Earth',
    level1: 'South America',
    level2: 'South America',
    level3: 'Country (Brazil)',
    level4: 'Estado (e.g. São Paulo)',
    level5: 'Mesorregião / Microrregião',
    level6: 'Município (e.g. São Paulo)',
    level7: 'Distrito / Cidade',
    level8: 'Bairro (e.g. Jardins)',
    level9: 'CEP (e.g. 01415-000)',
    level10: 'Rua / Avenida (e.g. Avenida Paulista)',
    level11: 'Edifício & POI (e.g. MASP Museum)',
    level12: 'Negócio / Loja',
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
    nativeScriptTerms: INTERNATIONAL_SCRIPT_TERMS,
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
