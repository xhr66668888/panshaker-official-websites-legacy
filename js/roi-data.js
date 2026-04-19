const ROI_DATA = {
  national_fallback: {
    monthly_full_cost: 6200,
    monthly_base: 4400
  },
  metros: [
    { name: "San Francisco Bay Area", zip_prefixes: ["940", "941", "944", "945", "946", "947", "948", "949", "950", "951"], monthly_full_cost: 9500 },
    { name: "Los Angeles / Orange County", zip_prefixes: ["900", "901", "902", "903", "904", "905", "906", "907", "908", "910", "911", "912", "913", "914", "915", "916", "917", "918", "922", "926", "927", "928"], monthly_full_cost: 8600 },
    { name: "San Diego", zip_prefixes: ["919", "920", "921"], monthly_full_cost: 8000 },
    { name: "Sacramento", zip_prefixes: ["942", "956", "957", "958"], monthly_full_cost: 7200 },
    { name: "New York City", zip_prefixes: ["100", "101", "102", "103", "104", "111", "112", "113", "114", "116"], monthly_full_cost: 9200 },
    { name: "Long Island", zip_prefixes: ["115", "117", "118", "119"], monthly_full_cost: 8200 },
    { name: "New Jersey (North)", zip_prefixes: ["070", "071", "072", "073", "074", "075", "076", "077"], monthly_full_cost: 8000 },
    { name: "Boston Metro", zip_prefixes: ["021", "022", "024", "025"], monthly_full_cost: 8000 },
    { name: "Philadelphia Metro", zip_prefixes: ["190", "191"], monthly_full_cost: 6800 },
    { name: "Washington DC Metro", zip_prefixes: ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "220", "221", "222"], monthly_full_cost: 7600 },
    { name: "Seattle Metro", zip_prefixes: ["980", "981", "982", "983", "984"], monthly_full_cost: 8000 },
    { name: "Portland Metro", zip_prefixes: ["970", "971", "972"], monthly_full_cost: 7000 },
    { name: "Chicago Metro", zip_prefixes: ["600", "601", "602", "603", "604", "605", "606"], monthly_full_cost: 6800 },
    { name: "Houston", zip_prefixes: ["770", "771", "772", "773", "774", "775"], monthly_full_cost: 6200 },
    { name: "Dallas / Fort Worth", zip_prefixes: ["750", "751", "752", "753", "754", "760", "761", "762"], monthly_full_cost: 6200 },
    { name: "Austin", zip_prefixes: ["787", "788", "789"], monthly_full_cost: 6500 },
    { name: "Miami Metro", zip_prefixes: ["330", "331", "332", "333"], monthly_full_cost: 6500 },
    { name: "Orlando", zip_prefixes: ["327", "328", "329"], monthly_full_cost: 5800 },
    { name: "Atlanta Metro", zip_prefixes: ["300", "301", "302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312"], monthly_full_cost: 6200 },
    { name: "Phoenix Metro", zip_prefixes: ["850", "851", "852", "853"], monthly_full_cost: 6200 },
    { name: "Las Vegas", zip_prefixes: ["889", "890", "891"], monthly_full_cost: 6600 },
    { name: "Denver Metro", zip_prefixes: ["800", "801", "802"], monthly_full_cost: 6800 },
    { name: "Minneapolis Metro", zip_prefixes: ["550", "551", "553", "554", "555"], monthly_full_cost: 6400 },
    { name: "Detroit Metro", zip_prefixes: ["480", "481", "482", "483"], monthly_full_cost: 5800 },
    { name: "St. Louis", zip_prefixes: ["630", "631", "632"], monthly_full_cost: 5400 },
    { name: "Kansas City", zip_prefixes: ["640", "641", "660", "661"], monthly_full_cost: 5400 },
    { name: "Honolulu", zip_prefixes: ["967", "968"], monthly_full_cost: 7800 }
  ],
  state_fallback: {
    "CA": 7800, "NY": 8000, "NJ": 7400, "MA": 7400, "WA": 7200,
    "OR": 6500, "HI": 7400, "IL": 6400, "TX": 6000, "FL": 6200,
    "GA": 6000, "DC": 7600, "MD": 6800, "VA": 6500, "AZ": 6000,
    "NV": 6400, "CO": 6500, "NC": 5800, "PA": 6200, "OH": 5400,
    "MI": 5800, "MN": 6200
  }
};

const REVENUE_RANGES = [
  { mid: 22500 },
  { mid: 45000 },
  { mid: 80000 },
  { mid: 150000 },
  { mid: 250000 }
];

const TIER_CONFIG = {
  1: { name: "快炒 / 快餐", stirFryRatio: 0.95, replaceEfficiency: 0.95, revenuePerRobot: 25000 },
  2: { name: "传统美式中餐", stirFryRatio: 0.85, replaceEfficiency: 0.90, revenuePerRobot: 25000 },
  31: { name: "川菜", stirFryRatio: 0.80, replaceEfficiency: 0.85, revenuePerRobot: 30000 },
  32: { name: "湘菜", stirFryRatio: 0.80, replaceEfficiency: 0.85, revenuePerRobot: 30000 },
  33: { name: "粤菜", stirFryRatio: 0.75, replaceEfficiency: 0.80, revenuePerRobot: 30000 },
  34: { name: "台湾菜", stirFryRatio: 0.75, replaceEfficiency: 0.80, revenuePerRobot: 30000 },
  35: { name: "东北菜", stirFryRatio: 0.75, replaceEfficiency: 0.80, revenuePerRobot: 30000 },
  36: { name: "其他大陆菜系", stirFryRatio: 0.75, replaceEfficiency: 0.80, revenuePerRobot: 30000 },
  4: { name: "综合中餐", stirFryRatio: 0.50, replaceEfficiency: 0.60, revenuePerRobot: 40000 },
  5: { name: "面食为主", stirFryRatio: 0.30, replaceEfficiency: 0.40, revenuePerRobot: 55000 },
  6: { name: "其他", stirFryRatio: 0.10, replaceEfficiency: 0, revenuePerRobot: 0 }
};

// Also basic zip to state mapping for fallback
function getZipState(zipStr) {
  const prefix = parseInt(zipStr.substring(0, 3));
  if (prefix >= 900 && prefix <= 961) return "CA";
  if (prefix >= 100 && prefix <= 149) return "NY";
  if (prefix >= 70 && prefix <= 89) return "NJ";
  if (prefix >= 10 && prefix <= 27) return "MA";
  if (prefix >= 980 && prefix <= 994) return "WA";
  if (prefix >= 970 && prefix <= 979) return "OR";
  if (prefix >= 967 && prefix <= 968) return "HI";
  if (prefix >= 600 && prefix <= 629) return "IL";
  if (prefix >= 750 && prefix <= 799) return "TX";
  if (prefix >= 320 && prefix <= 349) return "FL";
  if (prefix >= 300 && prefix <= 319) return "GA";
  if (prefix >= 200 && prefix <= 205) return "DC";
  if (prefix >= 206 && prefix <= 219) return "MD";
  if (prefix >= 220 && prefix <= 246) return "VA";
  if (prefix >= 850 && prefix <= 865) return "AZ";
  if (prefix >= 889 && prefix <= 898) return "NV";
  if (prefix >= 800 && prefix <= 816) return "CO";
  if (prefix >= 270 && prefix <= 289) return "NC";
  if (prefix >= 150 && prefix <= 196) return "PA";
  if (prefix >= 430 && prefix <= 458) return "OH";
  if (prefix >= 480 && prefix <= 497) return "MI";
  if (prefix >= 550 && prefix <= 567) return "MN";
  return null;
}

function lookupChefSalary(zipCode) {
  const zipStr = String(zipCode).padStart(5, '0');
  const prefix3 = zipStr.substring(0, 3);
  
  // 1. Check Metros
  for (const metro of ROI_DATA.metros) {
    if (metro.zip_prefixes.includes(prefix3)) {
      return { cost: metro.monthly_full_cost, region: metro.name };
    }
  }
  
  // 2. Check State Fallback
  const state = getZipState(zipStr);
  if (state && ROI_DATA.state_fallback[state]) {
    return { cost: ROI_DATA.state_fallback[state], region: state + " 地区" };
  }
  
  // 3. National Fallback
  return { cost: ROI_DATA.national_fallback.monthly_full_cost, region: "全美平均" };
}
