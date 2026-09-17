export type CropType = 
  | 'mais' 
  | 'tomate' 
  | 'ble' 
  | 'pomme_de_terre' 
  | 'riz' 
  | 'haricot' 
  | 'oignon' 
  | 'arachide' 
  | 'manioc' 
  | 'coton' 
  | 'marichage' 
  | 'arbres_fruitiers';

export type PhenologicalStage = 
  | 'germination' 
  | 'croissance' 
  | 'floraison' 
  | 'fructification' 
  | 'maturation';

export type SoilType = 
  | 'argileux' 
  | 'argilo_limoneux' 
  | 'limoneux' 
  | 'sablo_limoneux' 
  | 'sableux';

export type IrrigationSystem = 
  | 'goutte_a_goutte' 
  | 'aspersion' 
  | 'micro_aspersion' 
  | 'gravitaire';

export type IrrigationUrgency = 'none' | 'soon' | 'urgent';

export interface CropProfile {
  id: string;
  name: string;
  cropType: CropType;
  cropNameFr: string;
  stage: PhenologicalStage;
  areaHa: number;
  plantingDate: string;
  soilType: SoilType;
  irrigationSystem: IrrigationSystem;
  systemFlowRateM3h: number; // Débit du système en m3/h
  emitterSpacingM?: number;
}

export interface SoilObservation {
  color: 'rouge_ocre' | 'brun_fonce' | 'brun_clair' | 'jaune_sable';
  structure: 'mottes_compactes' | 'mottes_friables' | 'sableux_fluide';
  apparentMoisture: 'tres_sec' | 'sec' | 'frais' | 'tres_humide';
  crustPresence: boolean;
  estimatedMoisturePercent: number; // 0-100
}

export interface IoTSensorData {
  moistureTop10cm: number; // %
  moistureDeep30cm: number; // %
  soilTemperatureC: number;
  waterTensionKpa: number; // centibars/kPa
  batteryLevel: number;
  lastSync: string;
  isLiveSimulated: boolean;
  history24h: { time: string; moisture: number; temp: number }[];
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  tempCurrent: number;
  humidityPercent: number;
  windSpeedKmH: number;
  solarRadiationMj: number;
  precipitationMm: number;
  precipitationProbability: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy';
  et0Mm: number; // Evapotranspiration de référence
}

export interface IrrigationRecommendation {
  status: IrrigationUrgency;
  headline: string;
  simpleExplanation: string;
  detailedAgronomicReason: string;
  recommendedTime: string;
  recommendedDurationMinutes: number;
  recommendedWaterMm: number;
  recommendedVolumeM3: number;
  recommendedVolumeLiters: number;
  etcMm: number; // Evapotranspiration de la culture (ET0 * Kc)
  waterDeficitMm: number;
  savingsLitersVsFixedCalendar: number;
  riskAlerts: string[];
}

export interface IrrigationHistoryEntry {
  id: string;
  date: string;
  waterAppliedMm: number;
  volumeM3: number;
  durationMinutes: number;
  notes: string;
  waterSavedM3: number;
}

export type LanguageCode = 'fr' | 'en' | 'wo';
