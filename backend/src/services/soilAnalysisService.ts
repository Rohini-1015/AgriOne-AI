import { SoilAnalysisInput, SoilAnalysisOutput } from '../types';

export class SoilAnalysisService {
  public static analyze(input: SoilAnalysisInput): SoilAnalysisOutput {
    let score = 100;
    const deficiencies: string[] = [];
    const fertilizerGuidanceEn: string[] = [];
    const fertilizerGuidanceTa: string[] = [];
    const improvementTipsEn: string[] = [];
    const improvementTipsTa: string[] = [];

    // 1. pH Evaluation (Optimal 6.5 - 7.5)
    let phStatus: 'Acidic' | 'Neutral' | 'Alkaline' = 'Neutral';
    let phGuidance = 'Soil pH is in the optimal neutral range for maximum nutrient availability.';
    if (input.ph < 6.0) {
      phStatus = 'Acidic';
      score -= 15;
      deficiencies.push('High Soil Acidity (pH below 6.0 inhibits phosphorus and calcium uptake)');
      phGuidance = 'Apply Agricultural Lime (Calcium Carbonate) @ 200 - 400 kg/acre to neutralize acidity.';
      fertilizerGuidanceEn.push('Apply Agricultural Lime or Dolomite to correct acidic soil reaction.');
      fertilizerGuidanceTa.push('அமிலத்தன்மையைத் தணிக்க ஏக்கருக்கு 200-400 கிலோ விவசாய சுண்ணாம்பு இடவும்.');
      improvementTipsEn.push('Avoid using acid-forming chemical fertilizers like Ammonium Sulphate.');
      improvementTipsTa.push('அம்மோனியம் சல்பேட் போன்ற அமில உரங்களை இடுவதைத் தவிர்க்கவும்.');
    } else if (input.ph > 8.0) {
      phStatus = 'Alkaline';
      score -= 15;
      deficiencies.push('High Soil Alkalinity / Salinity (pH above 8.0 limits iron, zinc, and manganese uptake)');
      phGuidance = 'Apply Agricultural Gypsum @ 500 kg/acre with deep plowing and adequate field leaching.';
      fertilizerGuidanceEn.push('Apply Gypsum and sulfur amendments to displace excess sodium ions.');
      fertilizerGuidanceTa.push('காரத்தன்மையை குறைக்க ஏக்கருக்கு 500 கிலோ ஜிப்சம் உரம் இட்டு நிலத்தை உழவு செய்யவும்.');
      improvementTipsEn.push('Ensure proper drainage and leach soil with quality irrigation water.');
      improvementTipsTa.push('நிலத்தில் நல்ல வடிகால் வசதி அமைத்து அதிக உப்புகளை வெளியேற்றவும்.');
    }

    // 2. Available Nitrogen (N) (kg/ha): Low < 200, Optimal 200 - 350, High > 350
    let nStatus: 'Deficient' | 'Sufficient' | 'Excess' = 'Sufficient';
    let nGuidance = 'Available nitrogen level is within optimal agronomic thresholds.';
    if (input.nitrogen < 180) {
      nStatus = 'Deficient';
      score -= 15;
      deficiencies.push('Nitrogen Deficiency: Leaf chlorosis, stunted vegetative growth, low tillering');
      nGuidance = 'Apply 45-60 kg Urea/acre in 3 split doses (basal, active tillering, flowering).';
      fertilizerGuidanceEn.push('Incorporate Urea or Ammonium Phosphate in split applications to reduce leaching.');
      fertilizerGuidanceTa.push('ஏக்கருக்கு 45-60 கிலோ யூரியாவை மூன்று தவணைகளாக பிரித்து இடவும்.');
      improvementTipsEn.push('Incorporate legume green manures (Sunnhemp or Sesbania) before seasonal planting.');
      improvementTipsTa.push('தக்கைப்பூண்டு அல்லது சணப்பை போன்ற பசுந்தாள் உரப்பயிர்களை பயிரிட்டு மடக்கி உழவும்.');
    } else if (input.nitrogen > 380) {
      nStatus = 'Excess';
      score -= 8;
      deficiencies.push('Excess Nitrogen: Predisposes plants to fungal blast, lodging, and sap-sucking pests');
      nGuidance = 'Halt all nitrogen applications; balance with potassium fertilization.';
      fertilizerGuidanceEn.push('Suspend nitrogenous fertilizers. Apply MOP (Muriate of Potash) to balance growth.');
      fertilizerGuidanceTa.push('தழைச்சத்து உரங்களை நிறுத்தி சாம்பல் சத்து உரமான பொட்டாஷ் இடவும்.');
    }

    // 3. Available Phosphorus (P) (kg/ha): Low < 18, Optimal 18 - 35, High > 35
    let pStatus: 'Deficient' | 'Sufficient' | 'Excess' = 'Sufficient';
    let pGuidance = 'Available phosphorus level supports strong root development and energy transfer.';
    if (input.phosphorus < 16) {
      pStatus = 'Deficient';
      score -= 15;
      deficiencies.push('Phosphorus Deficiency: Restricted root elongation, dark purplish leaf discoloration');
      pGuidance = 'Apply Di-Ammonium Phosphate (DAP) @ 50 kg/acre or Single Super Phosphate (SSP) @ 100 kg/acre as basal dose.';
      fertilizerGuidanceEn.push('Apply SSP or DAP at sowing time near the root zone for rapid establishment.');
      fertilizerGuidanceTa.push('விதைக்கும் போது அடிஉரமாக டிஏபி 50 கிலோ அல்லது சூப்பர் பாஸ்பேட் 100 கிலோ இடவும்.');
      improvementTipsEn.push('Inoculate seeds with Phosphobacteria / PSB biofertilizer (2 kg/acre) to solubilize soil-fixed phosphorus.');
      improvementTipsTa.push('மண்ணில் உள்ள பாஸ்பரஸை பயிர்களுக்கு கிடைக்கச் செய்ய பாஸ்போபாக்டீரியா 2 கிலோ இடவும்.');
    } else if (input.phosphorus > 45) {
      pStatus = 'Excess';
      score -= 5;
      pGuidance = 'High phosphorus reserves. Reduce phosphate fertilizers to avoid zinc antagonism.';
    }

    // 4. Available Potassium (K) (kg/ha): Low < 140, Optimal 140 - 280, High > 280
    let kStatus: 'Deficient' | 'Sufficient' | 'Excess' = 'Sufficient';
    let kGuidance = 'Potassium level provides excellent drought tolerance, disease resistance, and fruit filling.';
    if (input.potassium < 130) {
      kStatus = 'Deficient';
      score -= 15;
      deficiencies.push('Potassium Deficiency: Leaf margin scorching, weak straw strength, poor grain filling');
      kGuidance = 'Apply Muriate of Potash (MOP) @ 30-40 kg/acre in two split doses during vegetative and panicle stages.';
      fertilizerGuidanceEn.push('Top-dress MOP along with nitrogen to maximize grain weight and starch quality.');
      fertilizerGuidanceTa.push('பயிர் தூர் கட்டும் மற்றும் பூக்கும் நிலைகளில் பொட்டாஷ் 30-40 கிலோ இடவும்.');
    }

    // 5. Organic Carbon (%) - Indicator of biological health (Low < 0.5%, Medium 0.5 - 0.75%, High > 0.75%)
    let ocStatus: 'Low' | 'Medium' | 'High' = 'Medium';
    let ocGuidance = 'Good organic carbon level fostering beneficial soil microbiology.';
    if (input.organicCarbon < 0.45) {
      ocStatus = 'Low';
      score -= 15;
      deficiencies.push('Low Soil Organic Carbon (<0.45%): Poor soil moisture retention and low microbial biomass');
      ocGuidance = 'Apply Farmyard Manure (FYM) @ 5 tons/acre or Vermicompost @ 2 tons/acre annually.';
      improvementTipsEn.push('Apply well-decomposed cow dung manure or vermicompost to revitalize micro-flora.');
      improvementTipsTa.push('ஏக்கருக்கு 5 டன் மக்கிய தொழு உரம் அல்லது 2 டன் மண்புழு உரம் இட்டு மண்ணின் வளத்தை பெருக்கவும்.');
    } else if (input.organicCarbon > 0.8) {
      ocStatus = 'High';
      score += 5;
    }

    // 6. Moisture & Physical Texture
    if (input.moisture < 15) {
      score -= 8;
      deficiencies.push('Low Soil Moisture (<15%): Crop entering moisture stress phase');
      improvementTipsEn.push('Adopt drip irrigation and mulch with crop residues to conserve root zone moisture.');
      improvementTipsTa.push('ஈரப்பதத்தை பாதுகாக்க சொட்டு நீர் பாசனம் அமைத்து வைக்கோல் நிலப்போர்வை இடவும்.');
    }

    // Final Health Score
    const finalScore = Math.max(25, Math.min(98, score));
    let rating: 'Poor' | 'Moderate' | 'Good' | 'Optimal' = 'Good';
    if (finalScore >= 85) rating = 'Optimal';
    else if (finalScore >= 70) rating = 'Good';
    else if (finalScore >= 50) rating = 'Moderate';
    else rating = 'Poor';

    // Suggested Crops
    const suggestedCrops = ['Paddy', 'Hybrid Tomato', 'Turmeric', 'Cotton', 'Black Gram', 'Banana'];

    return {
      healthScore: finalScore,
      rating,
      nutrientStatus: {
        nitrogen: { level: input.nitrogen, status: nStatus, guidance: nGuidance },
        phosphorus: { level: input.phosphorus, status: pStatus, guidance: pGuidance },
        potassium: { level: input.potassium, status: kStatus, guidance: kGuidance },
        organicCarbon: { level: input.organicCarbon, status: ocStatus, guidance: ocGuidance },
        ph: { level: input.ph, status: phStatus, guidance: phGuidance },
      },
      deficiencies: deficiencies.length > 0 ? deficiencies : ['No severe nutrient deficiencies identified. Soil is well balanced.'],
      suggestedCrops,
      fertilizerGuidanceEn,
      fertilizerGuidanceTa,
      improvementTipsEn,
      improvementTipsTa,
    };
  }
}
