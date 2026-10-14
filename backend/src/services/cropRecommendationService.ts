import { CropRecommendationInput, CropRecommendationOutput } from '../types';

interface CropKnowledge {
  nameEn: string;
  nameTa: string;
  category: string;
  preferredSoilTypes: string[];
  phRange: [number, number];
  nitrogenRange: [number, number];
  phosphorusRange: [number, number];
  potassiumRange: [number, number];
  tempRange: [number, number];
  rainfallRange: [number, number];
  seasons: string[];
  growingPeriodDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  importantNutrients: string;
  commonDiseases: string[];
  estimatedMarketPotential: string;
  cultivationGuidanceEn: string;
  cultivationGuidanceTa: string;
  expectedYieldPerAcre: string;
}

const CROP_DATABASE: CropKnowledge[] = [
  {
    nameEn: 'Paddy / Rice (BPT 5204 / CR 1009)',
    nameTa: 'நெல் (சாம்பா / குறுவை)',
    category: 'Grains',
    preferredSoilTypes: ['Alluvial', 'Clay', 'Clay Loam'],
    phRange: [5.5, 7.5],
    nitrogenRange: [180, 280],
    phosphorusRange: [20, 50],
    potassiumRange: [150, 250],
    tempRange: [22, 36],
    rainfallRange: [900, 1800],
    seasons: ['Kharif', 'Rabi', 'Samba', 'Kuruvai', 'Year-round'],
    growingPeriodDays: 135,
    waterRequirement: 'High',
    importantNutrients: 'N: 120-150 kg, P2O5: 50 kg, K2O: 50 kg + Zinc Sulphate 25 kg/ha',
    commonDiseases: ['Blast (Pyricularia oryzae)', 'Bacterial Leaf Blight', 'Sheath Rot', 'Stem Borer'],
    estimatedMarketPotential: 'High (₹2,300 - ₹2,700 / Quintal; MSP guaranteed)',
    cultivationGuidanceEn: 'Puddle soil thoroughly. Transplant 21-25 day old seedlings at 20x15 cm spacing. Maintain 2-5 cm standing water until 10 days before harvest. Top-dress nitrogen at tillering and panicle initiation.',
    cultivationGuidanceTa: 'மண்ணை நன்கு உழுது சேறாக்கவும். 21-25 நாள் நாற்றுகளை 20x15 செ.மீ இடைவெளியில் நடவு செய்யவும். தூர் கட்டும் மற்றும் கதிர் வரும் பருவத்தில் தழைச்சத்து உரங்களை இடவும்.',
    expectedYieldPerAcre: '2.4 - 3.0 Tons',
  },
  {
    nameEn: 'Hybrid Tomato (Shivam / Abhinav)',
    nameTa: 'தக்காளி (வீரிய ஒட்டு)',
    category: 'Vegetables',
    preferredSoilTypes: ['Red Loam', 'Sandy Loam', 'Black', 'Alluvial'],
    phRange: [6.0, 7.2],
    nitrogenRange: [150, 250],
    phosphorusRange: [30, 60],
    potassiumRange: [160, 280],
    tempRange: [18, 32],
    rainfallRange: [400, 800],
    seasons: ['Rabi', 'Zaid', 'Kharif', 'Year-round'],
    growingPeriodDays: 110,
    waterRequirement: 'Medium',
    importantNutrients: 'High Potassium (K) requirement for firm fruit; N: 150 kg, P: 100 kg, K: 150 kg/ha',
    commonDiseases: ['Early Blight (Alternaria solani)', 'Tomato Leaf Curl Virus (TLCV)', 'Bacterial Wilt', 'Fruit Borer'],
    estimatedMarketPotential: 'Very High (₹1,500 - ₹3,500 / Quintal depending on season)',
    cultivationGuidanceEn: 'Stake plants on trellises at 60x45 cm. Adopt drip fertigation. Spray Boron and Calcium nitrate during flowering to prevent blossom end rot and fruit cracking.',
    cultivationGuidanceTa: 'செடிகளை கம்பி அல்லது குச்சிகளால் கட்டவும். சொட்டு நீர் பாசனம் மூலம் உரமிடுவது சிறந்தது. பூக்கும் பருவத்தில் போரான் தெளிப்பது காய் வெடிப்பைத் தடுக்கும்.',
    expectedYieldPerAcre: '12 - 18 Tons',
  },
  {
    nameEn: 'Turmeric (Salem / Erode Local)',
    nameTa: 'மஞ்சள் (ஈரோடு / சேலம் ரகம்)',
    category: 'Spices',
    preferredSoilTypes: ['Sandy Loam', 'Clay Loam', 'Red Loam', 'Alluvial'],
    phRange: [6.0, 7.5],
    nitrogenRange: [160, 260],
    phosphorusRange: [30, 60],
    potassiumRange: [180, 300],
    tempRange: [20, 35],
    rainfallRange: [700, 1400],
    seasons: ['Kharif', 'Monsoon', 'Year-round'],
    growingPeriodDays: 240,
    waterRequirement: 'Medium',
    importantNutrients: 'Heavy feeder: FYM 25 t/ha, N: 125 kg, P2O5: 60 kg, K2O: 90 kg/ha',
    commonDiseases: ['Rhizome Rot (Pythium aphanidermatum)', 'Leaf Spot (Colletotrichum capsici)', 'Shoot Borer'],
    estimatedMarketPotential: 'High (₹12,000 - ₹15,500 / Quintal)',
    cultivationGuidanceEn: 'Plant healthy mother or finger rhizomes on ridges and furrows. Apply heavy organic mulch (straw/leaves). Ensure excellent drainage to prevent rhizome rot.',
    cultivationGuidanceTa: 'பார் மற்றும் சால் அமைத்து ஆரோக்கியமான வித்து கிழங்குகளை நடவு செய்யவும். கிழங்கு அழுகல் நோயைத் தடுக்க வடிகால் வசதி மிகவும் அவசியம்.',
    expectedYieldPerAcre: '8 - 10 Tons (Raw)',
  },
  {
    nameEn: 'Bt Cotton (Long Staple)',
    nameTa: 'பருத்தி (நீண்ட இழை)',
    category: 'CashCrop',
    preferredSoilTypes: ['Black', 'Deep Loamy', 'Alluvial'],
    phRange: [6.5, 8.2],
    nitrogenRange: [140, 240],
    phosphorusRange: [25, 55],
    potassiumRange: [140, 240],
    tempRange: [22, 38],
    rainfallRange: [500, 1000],
    seasons: ['Kharif', 'Year-round'],
    growingPeriodDays: 160,
    waterRequirement: 'Medium',
    importantNutrients: 'N: 120 kg, P2O5: 60 kg, K2O: 60 kg/ha + Magnesium Sulphate & Boron foliar spray',
    commonDiseases: ['Cotton Leaf Curl Virus', 'Alternaria Leaf Spot', 'Root Rot', 'Bollworm Complex'],
    estimatedMarketPotential: 'High (₹7,000 - ₹8,500 / Quintal)',
    cultivationGuidanceEn: 'Sow on ridges at 90x60 cm. Nipper apical buds at 80-90 days to stimulate sympodial branch development and boll formation. Maintain weed-free environment up to 60 days.',
    cultivationGuidanceTa: '90x60 செ.மீ இடைவெளியில் விதைகளை விதைக்கவும். 80-90 நாட்களில் நுனி தண்டு கிள்ளுதல் பக்கவாட்டு கிளைகளை அதிகரிக்க உதவும்.',
    expectedYieldPerAcre: '1.2 - 1.6 Tons',
  },
  {
    nameEn: 'Robusta Banana (Tissue Culture)',
    nameTa: 'வாழை (ரோபஸ்டா / ஜி9)',
    category: 'Fruits',
    preferredSoilTypes: ['Alluvial', 'Clay Loam', 'Red Loam'],
    phRange: [6.0, 7.8],
    nitrogenRange: [180, 300],
    phosphorusRange: [30, 70],
    potassiumRange: [200, 350],
    tempRange: [20, 38],
    rainfallRange: [800, 1600],
    seasons: ['Year-round'],
    growingPeriodDays: 330,
    waterRequirement: 'High',
    importantNutrients: 'Very high Potassium requirement: N: 200g, P: 60g, K: 300g per plant in split applications',
    commonDiseases: ['Panama Wilt (Fusarium)', 'Sigatoka Leaf Spot', 'Banana Bunchy Top Virus (BBTV)'],
    estimatedMarketPotential: 'Very High (₹280 - ₹400 / Bunch; High year-round domestic demand)',
    cultivationGuidanceEn: 'Plant tissue-culture suckers in 1.8x1.8m pits enriched with vermicompost and neem cake. De-sucker regularly leaving only one follower ratoon. Provide strong bamboo propping.',
    cultivationGuidanceTa: 'திசு வளர்ப்பு கன்றுகளை 1.8x1.8 மீ இடைவெளியில் நடவு செய்யவும். பக்கக் கன்றுகளை அவ்வப்போது நீக்கவும். குலை தள்ளியதும் முட்டு கொடுக்க வேண்டும்.',
    expectedYieldPerAcre: '30 - 38 Tons',
  },
  {
    nameEn: 'Black Gram / Urad (VBN 8 / 11)',
    nameTa: 'உளுந்து (வம்பன் 8)',
    category: 'Pulses',
    preferredSoilTypes: ['Black', 'Alluvial', 'Red Sandy Loam'],
    phRange: [6.2, 7.8],
    nitrogenRange: [100, 200],
    phosphorusRange: [20, 45],
    potassiumRange: [100, 200],
    tempRange: [25, 36],
    rainfallRange: [350, 650],
    seasons: ['Rabi', 'Kharif', 'Rice Fallow', 'Summer'],
    growingPeriodDays: 70,
    waterRequirement: 'Low',
    importantNutrients: 'Atmospheric Nitrogen fixing; requires basal DAP: 50 kg/ha + Rhizobium seed treatment',
    commonDiseases: ['Yellow Mosaic Virus (MYMV)', 'Powdery Mildew', 'Root Rot'],
    estimatedMarketPotential: 'High (₹7,500 - ₹9,000 / Quintal; fast 70-day cash crop)',
    cultivationGuidanceEn: 'Excellent as rice fallow pulse without land preparation, or direct sowing at 30x10 cm. Foliar spray 2% DAP at flower initiation and pod development stages.',
    cultivationGuidanceTa: 'நெல் தரிசு பயிராக அல்லது நேரடி விதைப்பாக 30x10 செ.மீ இடைவெளியில் விதைக்கவும். பூக்கும் பருவத்தில் 2% டிஏபி தெளிப்பது காய்கள் அதிகம் பிடிக்க உதவும்.',
    expectedYieldPerAcre: '400 - 600 Kg',
  },
  {
    nameEn: 'Sugarcane (Co 86032 / Co 0212)',
    nameTa: 'கரும்பு (கோ 86032)',
    category: 'CashCrop',
    preferredSoilTypes: ['Alluvial', 'Deep Clay Loam', 'Black'],
    phRange: [6.5, 8.0],
    nitrogenRange: [180, 280],
    phosphorusRange: [30, 60],
    potassiumRange: [160, 280],
    tempRange: [20, 38],
    rainfallRange: [1000, 1600],
    seasons: ['Year-round', 'Spring', 'Autumn'],
    growingPeriodDays: 360,
    waterRequirement: 'High',
    importantNutrients: 'N: 275 kg, P2O5: 65 kg, K2O: 115 kg/ha',
    commonDiseases: ['Red Rot (Colletotrichum falcatum)', 'Smut', 'Early Shoot Borer'],
    estimatedMarketPotential: 'Stable (₹3,150 - ₹3,400 / Ton via sugar mills)',
    cultivationGuidanceEn: 'Adopt wider row spacing (5 feet) for pit method or single bud chip planting. Earthing up at 90 and 150 days prevents lodging.',
    cultivationGuidanceTa: '5 அடி அகல பார் முறையில் நடவு செய்யவும். 90 மற்றும் 150 ஆம் நாட்களில் மண் அணைப்பது கரும்பு சாய்வதைத் தடுக்கும்.',
    expectedYieldPerAcre: '45 - 60 Tons',
  },
  {
    nameEn: 'Maize / Corn (Pioneer / NK 6240)',
    nameTa: 'மக்காச்சோளம் (வீரிய ரகம்)',
    category: 'Grains',
    preferredSoilTypes: ['Sandy Loam', 'Alluvial', 'Red Loam'],
    phRange: [5.8, 7.5],
    nitrogenRange: [160, 260],
    phosphorusRange: [25, 55],
    potassiumRange: [140, 220],
    tempRange: [20, 35],
    rainfallRange: [500, 900],
    seasons: ['Kharif', 'Rabi', 'Year-round'],
    growingPeriodDays: 105,
    waterRequirement: 'Medium',
    importantNutrients: 'N: 135 kg, P2O5: 62.5 kg, K2O: 50 kg + Zinc Sulphate 37.5 kg/ha',
    commonDiseases: ['Fall Armyworm (Spodoptera frugiperda)', 'Turcicum Leaf Blight', 'Downy Mildew'],
    estimatedMarketPotential: 'Medium-High (₹2,100 - ₹2,500 / Quintal; high poultry feed demand)',
    cultivationGuidanceEn: 'Sow at 60x20 cm. Critical water stages are tasseling and silking. Install pheromone traps for Fall Armyworm monitoring.',
    cultivationGuidanceTa: '60x20 செ.மீ இடைவெளியில் விதைக்கவும். ஆண் பூ மற்றும் பெண் பூ வரும் நிலைகளில் பாசனம் மிகவும் அவசியம். படைப்புழு கண்காணிப்புக்கு இனக்கவர்ச்சி பொறிகளை வைக்கவும்.',
    expectedYieldPerAcre: '3.0 - 4.2 Tons',
  }
];

export class CropRecommendationService {
  public static recommend(input: CropRecommendationInput): CropRecommendationOutput[] {
    const scoredCrops = CROP_DATABASE.map(crop => {
      let score = 50; // Base score

      // 1. Soil Type Match (Weight: 20 points)
      const soilMatches = crop.preferredSoilTypes.some(
        s => s.toLowerCase().includes(input.soilType.toLowerCase()) || input.soilType.toLowerCase().includes(s.toLowerCase())
      );
      if (soilMatches) score += 20;
      else score += 5;

      // 2. pH Suitability (Weight: 15 points)
      if (input.soilPh >= crop.phRange[0] && input.soilPh <= crop.phRange[1]) {
        score += 15;
      } else {
        const phDiff = Math.min(Math.abs(input.soilPh - crop.phRange[0]), Math.abs(input.soilPh - crop.phRange[1]));
        score += Math.max(0, 15 - phDiff * 8);
      }

      // 3. Temperature Match (Weight: 15 points)
      if (input.temperature >= crop.tempRange[0] && input.temperature <= crop.tempRange[1]) {
        score += 15;
      } else {
        score += 5;
      }

      // 4. Irrigation & Water Requirement (Weight: 15 points)
      const isIrrigated = ['Drip', 'Sprinkler', 'Canal', 'Borewell'].some(ir =>
        input.irrigation.toLowerCase().includes(ir.toLowerCase())
      );
      if (crop.waterRequirement === 'High') {
        if (isIrrigated || input.rainfall > 1000) score += 15;
        else score -= 15;
      } else if (crop.waterRequirement === 'Medium') {
        score += 12;
      } else {
        score += 15; // Low water requirement is resilient
      }

      // 5. NPK Compatibility (Weight: 15 points)
      let npkPoints = 0;
      if (input.nitrogen >= crop.nitrogenRange[0] && input.nitrogen <= crop.nitrogenRange[1]) npkPoints += 5;
      if (input.phosphorus >= crop.phosphorusRange[0] && input.phosphorus <= crop.phosphorusRange[1]) npkPoints += 5;
      if (input.potassium >= crop.potassiumRange[0] && input.potassium <= crop.potassiumRange[1]) npkPoints += 5;
      score += npkPoints;

      // 6. Crop Rotation / Previous Crop Bonus (Weight: 10 points)
      if (input.previousCrop) {
        const prev = input.previousCrop.toLowerCase();
        // Rotation benefits: Legumes before grains, grains before pulses
        if (prev.includes('gram') || prev.includes('pulse') || prev.includes('legume')) {
          if (crop.category === 'Grains' || crop.category === 'CashCrop') score += 10;
        } else if (prev.includes('paddy') || prev.includes('rice')) {
          if (crop.category === 'Pulses' || crop.nameEn.includes('Black Gram')) score += 10;
        }
      }

      // Clamp score to 98 max
      const finalScore = Math.min(98, Math.max(35, Math.round(score)));

      return {
        cropNameEn: crop.nameEn,
        cropNameTa: crop.nameTa,
        suitabilityScore: finalScore,
        growingPeriodDays: crop.growingPeriodDays,
        waterRequirement: crop.waterRequirement,
        importantNutrients: crop.importantNutrients,
        commonDiseases: crop.commonDiseases,
        estimatedMarketPotential: crop.estimatedMarketPotential,
        cultivationGuidanceEn: crop.cultivationGuidanceEn,
        cultivationGuidanceTa: crop.cultivationGuidanceTa,
        expectedYieldPerAcre: crop.expectedYieldPerAcre,
      };
    });

    // Sort by suitability score descending
    scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return scoredCrops.slice(0, 5);
  }
}
