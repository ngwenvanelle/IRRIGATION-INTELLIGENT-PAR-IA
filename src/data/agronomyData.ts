import { CropType, PhenologicalStage, SoilType, IrrigationSystem } from '../types';

export interface CropInfo {
  id: CropType;
  nameFr: string;
  nameEn: string;
  nameWo: string; // Wolof
  icon: string;
  kcStages: Record<PhenologicalStage, number>;
  rootDepthM: number;
  criticalMoistureThreshold: number; // % seuil de déclenchement
}

export const CROPS_DATABASE: Record<CropType, CropInfo> = {
  mais: {
    id: 'mais',
    nameFr: 'Maïs',
    nameEn: 'Maize / Corn',
    nameWo: 'Mboq',
    icon: '🌽',
    kcStages: {
      germination: 0.40,
      croissance: 0.80,
      floraison: 1.20,
      fructification: 1.15,
      maturation: 0.60,
    },
    rootDepthM: 0.8,
    criticalMoistureThreshold: 45,
  },
  tomate: {
    id: 'tomate',
    nameFr: 'Tomate',
    nameEn: 'Tomato',
    nameWo: 'Bataas',
    icon: '🍅',
    kcStages: {
      germination: 0.45,
      croissance: 0.75,
      floraison: 1.15,
      fructification: 1.10,
      maturation: 0.70,
    },
    rootDepthM: 0.6,
    criticalMoistureThreshold: 50,
  },
  pomme_de_terre: {
    id: 'pomme_de_terre',
    nameFr: 'Pomme de terre',
    nameEn: 'Potato',
    nameWo: 'Pompiteer',
    icon: '🥔',
    kcStages: {
      germination: 0.50,
      croissance: 0.75,
      floraison: 1.15,
      fructification: 1.05,
      maturation: 0.75,
    },
    rootDepthM: 0.5,
    criticalMoistureThreshold: 55,
  },
  ble: {
    id: 'ble',
    nameFr: 'Blé / Céréale',
    nameEn: 'Wheat',
    nameWo: 'Dugub',
    icon: '🌾',
    kcStages: {
      germination: 0.35,
      croissance: 0.70,
      floraison: 1.15,
      fructification: 1.05,
      maturation: 0.40,
    },
    rootDepthM: 0.9,
    criticalMoistureThreshold: 40,
  },
  riz: {
    id: 'riz',
    nameFr: 'Riz',
    nameEn: 'Rice',
    nameWo: 'Ceeb',
    icon: '🍚',
    kcStages: {
      germination: 1.05,
      croissance: 1.10,
      floraison: 1.20,
      fructification: 1.15,
      maturation: 0.90,
    },
    rootDepthM: 0.4,
    criticalMoistureThreshold: 70,
  },
  haricot: {
    id: 'haricot',
    nameFr: 'Haricot / Niébé',
    nameEn: 'Bean / Cowpea',
    nameWo: 'Ñebe',
    icon: '🫘',
    kcStages: {
      germination: 0.40,
      croissance: 0.70,
      floraison: 1.10,
      fructification: 1.05,
      maturation: 0.35,
    },
    rootDepthM: 0.5,
    criticalMoistureThreshold: 45,
  },
  oignon: {
    id: 'oignon',
    nameFr: 'Oignon',
    nameEn: 'Onion',
    nameWo: 'Sooble',
    icon: '🧅',
    kcStages: {
      germination: 0.50,
      croissance: 0.70,
      floraison: 1.05,
      fructification: 1.05,
      maturation: 0.75,
    },
    rootDepthM: 0.35,
    criticalMoistureThreshold: 55,
  },
  arachide: {
    id: 'arachide',
    nameFr: 'Arachide',
    nameEn: 'Peanut / Groundnut',
    nameWo: 'Gerte',
    icon: '🥜',
    kcStages: {
      germination: 0.40,
      croissance: 0.70,
      floraison: 1.10,
      fructification: 1.00,
      maturation: 0.55,
    },
    rootDepthM: 0.6,
    criticalMoistureThreshold: 40,
  },
  manioc: {
    id: 'manioc',
    nameFr: 'Manioc',
    nameEn: 'Cassava',
    nameWo: 'Ñambi',
    icon: '🌱',
    kcStages: {
      germination: 0.30,
      croissance: 0.60,
      floraison: 0.80,
      fructification: 0.80,
      maturation: 0.50,
    },
    rootDepthM: 0.8,
    criticalMoistureThreshold: 35,
  },
  coton: {
    id: 'coton',
    nameFr: 'Coton',
    nameEn: 'Cotton',
    nameWo: 'Wutten',
    icon: '☁️',
    kcStages: {
      germination: 0.35,
      croissance: 0.75,
      floraison: 1.20,
      fructification: 1.10,
      maturation: 0.65,
    },
    rootDepthM: 1.0,
    criticalMoistureThreshold: 45,
  },
  marichage: {
    id: 'marichage',
    nameFr: 'Maraîchage divers',
    nameEn: 'Market Gardening',
    nameWo: 'Toolu xaañ',
    icon: '🥬',
    kcStages: {
      germination: 0.50,
      croissance: 0.75,
      floraison: 1.05,
      fructification: 1.00,
      maturation: 0.80,
    },
    rootDepthM: 0.4,
    criticalMoistureThreshold: 55,
  },
  arbres_fruitiers: {
    id: 'arbres_fruitiers',
    nameFr: 'Arbres fruitiers / Agrumes',
    nameEn: 'Fruit Trees / Citrus',
    nameWo: 'Garab guy meññ',
    icon: '🍊',
    kcStages: {
      germination: 0.60,
      croissance: 0.70,
      floraison: 0.85,
      fructification: 0.80,
      maturation: 0.65,
    },
    rootDepthM: 1.2,
    criticalMoistureThreshold: 45,
  },
};

export const STAGES_LABELS: Record<PhenologicalStage, { fr: string; en: string; wo: string; description: string; progress: number }> = {
  germination: {
    fr: 'Germination / Levée',
    en: 'Germination / Emergence',
    wo: 'Mboñ / Ñor',
    description: 'Besoins en eau modérés en surface, sol à garder humide mais sans engorgement.',
    progress: 15,
  },
  croissance: {
    fr: 'Croissance végétative',
    en: 'Vegetative Growth',
    wo: 'Magne / Magg',
    description: 'Développement du feuillage et des racines, consommation d\'eau en forte hausse.',
    progress: 40,
  },
  floraison: {
    fr: 'Floraison',
    en: 'Flowering',
    wo: 'Takk / Tóor-tóor',
    description: 'Période critique de sensibilité au stress hydrique : tout manque d\'eau affecte le rendement.',
    progress: 65,
  },
  fructification: {
    fr: 'Fructification / Remplissage',
    en: 'Fruiting / Grain filling',
    wo: 'Meññ / Ñoral',
    description: 'Besoins en eau maximaux pour le grossissement des fruits ou grains.',
    progress: 85,
  },
  maturation: {
    fr: 'Maturation / Récolte',
    en: 'Maturation / Harvest',
    wo: 'Ñor / Goob',
    description: 'Diminuer progressivement l\'irrigation pour favoriser le mûrissement et éviter le pourrissement.',
    progress: 100,
  },
};

export interface SoilInfo {
  id: SoilType;
  nameFr: string;
  nameEn: string;
  fieldCapacityMmPerM: number; // Capacité au champ en mm d'eau par mètre de sol
  wiltingPointMmPerM: number; // Point de flétrissement permanent
  waterRetentionDescription: string;
  drainageRate: 'lent' | 'moyen' | 'rapide';
  recommendedFrequency: string;
}

export const SOIL_DATABASE: Record<SoilType, SoilInfo> = {
  argileux: {
    id: 'argileux',
    nameFr: 'Argileux (ou latéritique / ferralitique)',
    nameEn: 'Clay (or Lateritic / Ferralitic)',
    fieldCapacityMmPerM: 180,
    wiltingPointMmPerM: 90,
    waterRetentionDescription: 'Très forte rétention d\'eau, draine lentement. Risque d\'asphyxie racinaire si arrosage trop fréquent.',
    drainageRate: 'lent',
    recommendedFrequency: 'Arrosages espacés et abondants',
  },
  argilo_limoneux: {
    id: 'argilo_limoneux',
    nameFr: 'Argilo-limoneux (sol profond équilibré)',
    nameEn: 'Clay-loam',
    fieldCapacityMmPerM: 160,
    wiltingPointMmPerM: 75,
    waterRetentionDescription: 'Bonne réserve utile, bonne porosité et aération satisfaisante.',
    drainageRate: 'moyen',
    recommendedFrequency: 'Arrosages réguliers tous les 2-3 jours',
  },
  limoneux: {
    id: 'limoneux',
    nameFr: 'Limoneux',
    nameEn: 'Loamy / Silt',
    fieldCapacityMmPerM: 140,
    wiltingPointMmPerM: 65,
    waterRetentionDescription: 'Rétention moyenne, attention au compactage et à la battance.',
    drainageRate: 'moyen',
    recommendedFrequency: 'Arrosages modérés réguliers',
  },
  sablo_limoneux: {
    id: 'sablo_limoneux',
    nameFr: 'Sablo-limoneux',
    nameEn: 'Sandy-loam',
    fieldCapacityMmPerM: 110,
    wiltingPointMmPerM: 45,
    waterRetentionDescription: 'Drainage rapide, capacité de stockage modérée.',
    drainageRate: 'rapide',
    recommendedFrequency: 'Arrosages fréquents en petites quantités',
  },
  sableux: {
    id: 'sableux',
    nameFr: 'Sableux (dunaire / alluvionnaire)',
    nameEn: 'Sandy',
    fieldCapacityMmPerM: 80,
    wiltingPointMmPerM: 30,
    waterRetentionDescription: 'Faible réserve d\'eau, infiltration quasi-immédiate.',
    drainageRate: 'rapide',
    recommendedFrequency: 'Arrosages quotidiens courts (ou fractionnés)',
  },
};

export const IRRIGATION_SYSTEMS: Record<IrrigationSystem, { nameFr: string; nameEn: string; efficiency: number; typicalFlowM3hPerHa: number }> = {
  goutte_a_goutte: {
    nameFr: 'Goutte-à-goutte (Micro-irrigation)',
    nameEn: 'Drip Irrigation',
    efficiency: 0.90, // 90% de l'eau atteint les racines
    typicalFlowM3hPerHa: 15,
  },
  aspersion: {
    nameFr: 'Aspersion (Canons / Sprinklers)',
    nameEn: 'Sprinkler Irrigation',
    efficiency: 0.75, // 75% efficience (évaporation par le vent)
    typicalFlowM3hPerHa: 30,
  },
  micro_aspersion: {
    nameFr: 'Micro-aspersion sous frondaison',
    nameEn: 'Micro-sprinkler',
    efficiency: 0.85,
    typicalFlowM3hPerHa: 20,
  },
  gravitaire: {
    nameFr: 'Gravitaire / Raies / Submersion',
    nameEn: 'Surface / Furrow / Flood',
    efficiency: 0.55, // 55% efficience
    typicalFlowM3hPerHa: 50,
  },
};

export const PRESET_REGIONS = [
  { name: 'Afrique de l\'Ouest (Sénégal - Niayes / Thiès)', lat: 14.79, lon: -16.92, defaultCrop: 'tomate' as CropType, defaultSoil: 'sablo_limoneux' as SoilType },
  { name: 'Afrique Centrale (Cameroun - Yaoundé / Mbalmayo)', lat: 3.84, lon: 11.50, defaultCrop: 'mais' as CropType, defaultSoil: 'argileux' as SoilType },
  { name: 'Côte d\'Ivoire (Abidjan / Bouaké)', lat: 7.69, lon: -5.03, defaultCrop: 'manioc' as CropType, defaultSoil: 'argilo_limoneux' as SoilType },
  { name: 'Sahel (Burkina Faso - Ouagadougou)', lat: 12.37, lon: -1.52, defaultCrop: 'haricot' as CropType, defaultSoil: 'sablo_limoneux' as SoilType },
  { name: 'Afrique du Nord (Maroc - Souss-Massa / Agadir)', lat: 30.42, lon: -9.59, defaultCrop: 'arbres_fruitiers' as CropType, defaultSoil: 'limoneux' as SoilType },
  { name: 'France (Sud / Méditerranée - Montpellier)', lat: 43.61, lon: 3.87, defaultCrop: 'pomme_de_terre' as CropType, defaultSoil: 'argilo_limoneux' as SoilType },
];
