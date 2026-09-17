import { CropProfile, SoilObservation, IoTSensorData, WeatherDay, IrrigationRecommendation, IrrigationUrgency } from '../types';
import { CROPS_DATABASE, SOIL_DATABASE, IRRIGATION_SYSTEMS } from '../data/agronomyData';

/**
 * Calcul simplifié de l'évapotranspiration de référence ET0 (mm/jour)
 * Basé sur l'équation de Hargreaves modifiée pour météo standard :
 * ET0 = 0.0023 * (Tmean + 17.8) * sqrt(Tmax - Tmin) * Ra
 */
export function calculateET0(tempMax: number, tempMin: number, solarRadMj: number = 20): number {
  const tMean = (tempMax + tempMin) / 2;
  const tDelta = Math.max(1, tempMax - tempMin);
  // Estimation en mm/jour (typiquement 3.5 à 7.5 mm en zone chaude)
  const et0 = 0.0023 * (tMean + 17.8) * Math.sqrt(tDelta) * (solarRadMj * 0.408);
  return Math.min(10.5, Math.max(1.8, Number(et0.toFixed(1))));
}

/**
 * Calcule l'humidité estimée à partir de l'observation visuelle du sol
 * (Conforme au cas d'usage de la fiche technique : couleur du sol, mottes et labour)
 */
export function estimateMoistureFromObservation(obs: SoilObservation): number {
  let baseMoisture = 40;
  
  switch (obs.apparentMoisture) {
    case 'tres_sec':
      baseMoisture = 15;
      break;
    case 'sec':
      baseMoisture = 28;
      break;
    case 'frais':
      baseMoisture = 55;
      break;
    case 'tres_humide':
      baseMoisture = 82;
      break;
  }

  // Modulateurs liés à la structure et la couleur
  if (obs.structure === 'mottes_compactes') {
    // Argilo-limoneux retenant bien l'eau
    baseMoisture += 4;
  } else if (obs.structure === 'sableux_fluide') {
    // Sol sableux draine vite
    baseMoisture -= 6;
  }

  if (obs.color === 'rouge_ocre') {
    // Sol ferralitique/latéritique riche en fer (fiche technique)
    baseMoisture += 2;
  }

  return Math.max(5, Math.min(95, baseMoisture));
}

/**
 * Moteur décisionnel prédictif d'irrigation
 */
export function computeIrrigationDecision(
  crop: CropProfile,
  weatherToday: WeatherDay,
  forecast: WeatherDay[],
  useIoTMode: boolean,
  soilObs: SoilObservation,
  iotData: IoTSensorData
): IrrigationRecommendation {
  const cropInfo = CROPS_DATABASE[crop.cropType] || CROPS_DATABASE.mais;
  const soilInfo = SOIL_DATABASE[crop.soilType] || SOIL_DATABASE.argilo_limoneux;
  const systemInfo = IRRIGATION_SYSTEMS[crop.irrigationSystem] || IRRIGATION_SYSTEMS.goutte_a_goutte;

  // 1. Kc et ETc
  const kc = cropInfo.kcStages[crop.stage] ?? 0.8;
  const et0 = weatherToday.et0Mm > 0 ? weatherToday.et0Mm : calculateET0(weatherToday.tempMax, weatherToday.tempMin, weatherToday.solarRadiationMj);
  const etc = Number((et0 * kc).toFixed(1)); // mm de besoin journalier

  // 2. Humidité actuelle selon le mode (capteurs ou déclaration terrain)
  const currentMoisture = useIoTMode 
    ? Number(((iotData.moistureTop10cm * 0.4) + (iotData.moistureDeep30cm * 0.6)).toFixed(1))
    : estimateMoistureFromObservation(soilObs);

  // 3. Précipitations prévues à court terme (48h)
  const rainToday = weatherToday.precipitationMm;
  const rainTomorrow = forecast[0]?.precipitationMm || 0;
  const rainDay2 = forecast[1]?.precipitationMm || 0;
  const upcomingRain48h = rainToday + rainTomorrow + (rainDay2 * 0.5);

  // 4. Seuil critique de la culture
  const threshold = cropInfo.criticalMoistureThreshold;
  const deficitBelowThreshold = Math.max(0, threshold - currentMoisture);

  // 5. Alertes spéciales
  const alerts: string[] = [];
  if (weatherToday.tempMax >= 34) {
    alerts.push(`Vague de forte chaleur (${weatherToday.tempMax}°C) : risque accru d'évapotranspiration.`);
  }
  if (upcomingRain48h >= 10) {
    alerts.push(`Pluie importante prévue sous 48h (~${upcomingRain48h.toFixed(0)} mm) : préservez les réserves.`);
  }
  if (crop.stage === 'floraison') {
    alerts.push(`Stade de floraison très sensible : le stress hydrique peut réduire le rendement de 30% à 50%.`);
  }
  if (crop.soilType === 'argileux' && currentMoisture > 75) {
    alerts.push(`Sol argileux / latéritique à drainage lent : attention au risque d'asphyxie des racines.`);
  }

  // 6. Détermination du statut (Vert / Orange / Rouge)
  let status: IrrigationUrgency = 'none';
  let headline = "Pas d'irrigation nécessaire";
  let simpleExplanation = "L'humidité du sol est suffisante pour la culture.";
  let detailedAgronomicReason = "";
  let recommendedTime = "Non requis aujourd'hui";
  let waterToApplyMm = 0;

  // Cas 1 : Pluie imminente suffisante
  if (upcomingRain48h >= (etc * 1.6)) {
    status = 'none';
    headline = "Pas d'irrigation requise (Pluie imminente)";
    simpleExplanation = `Une pluie de ~${upcomingRain48h.toFixed(0)} mm est prévue sous 48h. Inutile d'irriguer, économisez l'eau.`;
    detailedAgronomicReason = `Les précipitations annoncées (${upcomingRain48h.toFixed(0)} mm) couvrent largement l'évapotranspiration prévue (${etc} mm/j).`;
    recommendedTime = "Suspendu (surveiller la pluie)";
  } 
  // Cas 2 : Humidité déjà très haute
  else if (currentMoisture >= threshold + 12) {
    status = 'none';
    headline = "Pas d'irrigation aujourd'hui";
    simpleExplanation = `Le sol est bien pourvu en eau (${currentMoisture}% d'humidité). Aucun apport nécessaire.`;
    detailedAgronomicReason = `L'humidité actuelle (${currentMoisture}%) dépasse le seuil critique de ${threshold}%. Le réservoir utile du sol est à son niveau optimal.`;
    recommendedTime = "Prochaine évaluation demain matin";
  }
  // Cas 3 : Sol sous le seuil critique ou température extrême = URGENT (Rouge)
  else if (currentMoisture <= threshold - 8 || (currentMoisture <= threshold && weatherToday.tempMax >= 33)) {
    status = 'urgent';
    headline = "Irrigation urgente recommandée";
    simpleExplanation = `Sol sous le seuil critique (${currentMoisture}% vs seuil ${threshold}%) et forte consommation d'eau.`;
    detailedAgronomicReason = `Déficit hydrique sévère détecté. Au stade ${crop.stage} du ${cropInfo.nameFr}, le stress hydrique pénaliserait la production.`;
    recommendedTime = "Ce soir après 18h30 ou demain à l'aube (06h00)";
    waterToApplyMm = Math.max(12, Number(((threshold - currentMoisture) * 0.4 + etc * 1.5).toFixed(1)));
  }
  // Cas 4 : Irrigation recommandée bientôt (Orange)
  else {
    status = 'soon';
    headline = "Irrigation recommandée bientôt";
    simpleExplanation = `L'humidité approche du seuil limite (${currentMoisture}%). Prévoir un arrosage sous 24 à 48h.`;
    detailedAgronomicReason = `Consommation journalière ETc estimée à ${etc} mm/j. Sans apport ou pluie, le sol sera asséché d'ici 2 jours.`;
    recommendedTime = "Demain matin avant 08h00";
    waterToApplyMm = Math.max(8, Number(((threshold - currentMoisture) * 0.3 + etc).toFixed(1)));
  }

  // 7. Prise en compte de l'efficience du système d'irrigation
  // Ex: 10 mm nécessaires avec goutte-à-goutte (90% efficience) = 11.1 mm réels
  // avec aspersion (75%) = 13.3 mm réels
  // avec gravitaire (55%) = 18.2 mm réels
  const grossWaterMm = waterToApplyMm > 0 ? Number((waterToApplyMm / systemInfo.efficiency).toFixed(1)) : 0;

  // Calcul des volumes :
  // 1 mm = 10 m³ / ha = 10 000 Litres / ha
  const areaHa = Math.max(0.01, crop.areaHa);
  const recommendedVolumeM3 = Number((grossWaterMm * 10 * areaHa).toFixed(1));
  const recommendedVolumeLiters = Math.round(recommendedVolumeM3 * 1000);

  // Durée d'arrosage :
  // Débit total du système = crop.systemFlowRateM3h (m³/h)
  const systemFlow = Math.max(0.5, crop.systemFlowRateM3h || (systemInfo.typicalFlowM3hPerHa * areaHa));
  const durationHours = recommendedVolumeM3 / systemFlow;
  const recommendedDurationMinutes = waterToApplyMm > 0 ? Math.round(durationHours * 60) : 0;

  // Économie d'eau vs calendrier fixe (qui arroserait tous les jours ou tous les 2 jours de manière aveugle)
  // Calendrier fixe typique : 25 mm tous les 3 jours soit ~8.3 mm/jour aveugle
  const fixedCalendarDailyM3 = 8.3 * 10 * areaHa;
  const smartDailyWaterM3 = recommendedVolumeM3;
  const savingsM3 = status === 'none' ? fixedCalendarDailyM3 : Math.max(0, fixedCalendarDailyM3 - smartDailyWaterM3);
  const savingsLitersVsFixedCalendar = Math.round(savingsM3 * 1000);

  return {
    status,
    headline,
    simpleExplanation,
    detailedAgronomicReason,
    recommendedTime,
    recommendedDurationMinutes,
    recommendedWaterMm: grossWaterMm,
    recommendedVolumeM3,
    recommendedVolumeLiters,
    etcMm: etc,
    waterDeficitMm: deficitBelowThreshold,
    savingsLitersVsFixedCalendar,
    riskAlerts: alerts,
  };
}
