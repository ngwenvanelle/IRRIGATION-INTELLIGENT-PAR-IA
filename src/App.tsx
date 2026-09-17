import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MainDecisionCard } from './components/MainDecisionCard';
import { SoilAndSensorsCard } from './components/SoilAndSensorsCard';
import { WeatherCard } from './components/WeatherCard';
import { CropProfileCard } from './components/CropProfileCard';
import { HistoryAndWaterSaved } from './components/HistoryAndWaterSaved';
import { SingleHtmlExportModal } from './components/SingleHtmlExportModal';

import {
  CropProfile,
  SoilObservation,
  IoTSensorData,
  WeatherDay,
  IrrigationHistoryEntry,
  LanguageCode,
} from './types';
import { PRESET_REGIONS, CROPS_DATABASE } from './data/agronomyData';
import { computeIrrigationDecision } from './utils/agronomyCalculations';
import { fetchLiveWeather, FALLBACK_WEATHER_DAYS } from './utils/weatherService';
import { Sprout, FileCode, CheckCircle2, Waves, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'agro_irrig_ia_v1';

export default function App() {
  // 1. Mode : Sans capteurs (Observation terrain) vs Avec capteurs IoT
  const [useIoTMode, setUseIoTMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_iot_mode`);
    return saved ? JSON.parse(saved) : false; // Par défaut sans capteur pour accessibilité
  });

  // 2. Langue
  const [lang, setLang] = useState<LanguageCode>('fr');

  // 3. Statut en ligne
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine ?? true);

  // 4. Modal export HTML unique
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // 5. Profil de la parcelle / culture
  const [cropProfile, setCropProfile] = useState<CropProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_crop`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'p1',
      name: 'Parcelle Nord - Principale',
      cropType: 'mais',
      cropNameFr: 'Maïs',
      stage: 'floraison', // Stade critique en exemple
      areaHa: 0.5, // 5000 m² (exploitation type)
      plantingDate: '2026-06-15',
      soilType: 'argileux', // Cas d'usage de la fiche technique
      irrigationSystem: 'goutte_a_goutte',
      systemFlowRateM3h: 8.0,
    };
  });

  // 6. Observation terrain du sol (Fiche technique PDF)
  const [soilObs, setSoilObs] = useState<SoilObservation>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_soil_obs`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      color: 'rouge_ocre', // Sol ferralitique/latéritique de la fiche technique
      structure: 'mottes_compactes',
      apparentMoisture: 'frais',
      crustPresence: false,
      estimatedMoisturePercent: 55,
    };
  });

  // 7. Données capteurs IoT
  const [iotData, setIotData] = useState<IoTSensorData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_iot_data`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      moistureTop10cm: 42,
      moistureDeep30cm: 46,
      soilTemperatureC: 25.4,
      waterTensionKpa: 42,
      batteryLevel: 94,
      lastSync: '15:10',
      isLiveSimulated: true,
      history24h: [
        { time: '00:00', moisture: 48, temp: 22 },
        { time: '06:00', moisture: 47, temp: 21 },
        { time: '12:00', moisture: 44, temp: 28 },
        { time: '18:00', moisture: 42, temp: 26 },
      ],
    };
  });

  // 8. Données météo
  const [currentRegion, setCurrentRegion] = useState(PRESET_REGIONS[1]); // Yaoundé / Cameroun (zone tropicale latéritique)
  const [todayWeather, setTodayWeather] = useState<WeatherDay>(FALLBACK_WEATHER_DAYS[0]);
  const [forecast, setForecast] = useState<WeatherDay[]>(FALLBACK_WEATHER_DAYS.slice(1));
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // 9. Historique des arrosages
  const [history, setHistory] = useState<IrrigationHistoryEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_history`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'h1',
        date: 'Hier matin',
        waterAppliedMm: 12,
        volumeM3: 60,
        durationMinutes: 45,
        notes: 'Arrosage ciblé avant la montée de température',
        waterSavedM3: 35,
      },
    ];
  });

  // Écouteur statut réseau (online/offline)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Chargement de la météo pour la région active
  useEffect(() => {
    let isCancelled = false;
    async function loadWeather() {
      setIsLoadingWeather(true);
      const data = await fetchLiveWeather(currentRegion.lat, currentRegion.lon);
      if (!isCancelled) {
        setTodayWeather(data.today);
        setForecast(data.forecast);
        setIsLoadingWeather(false);
      }
    }
    loadWeather();
    return () => {
      isCancelled = true;
    };
  }, [currentRegion]);

  // Sauvegardes locales automatiques
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_iot_mode`, JSON.stringify(useIoTMode));
  }, [useIoTMode]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_crop`, JSON.stringify(cropProfile));
  }, [cropProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_soil_obs`, JSON.stringify(soilObs));
  }, [soilObs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_iot_data`, JSON.stringify(iotData));
  }, [iotData]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
  }, [history]);

  // Calcul du moteur décisionnel prédictif
  const recommendation = useMemo(() => {
    return computeIrrigationDecision(
      cropProfile,
      todayWeather,
      forecast,
      useIoTMode,
      soilObs,
      iotData
    );
  }, [cropProfile, todayWeather, forecast, useIoTMode, soilObs, iotData]);

  // Calcul du volume total d'eau économisé cumulé
  const totalWaterSavedLiters = useMemo(() => {
    const fromHistory = history.reduce((acc, h) => acc + h.waterSavedM3 * 1000, 0);
    return fromHistory + recommendation.savingsLitersVsFixedCalendar;
  }, [history, recommendation.savingsLitersVsFixedCalendar]);

  // Gestion des actions
  const handleLogIrrigation = (volumeM3: number, minutes: number) => {
    const newEntry: IrrigationHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      waterAppliedMm: recommendation.recommendedWaterMm,
      volumeM3: volumeM3 || 10,
      durationMinutes: minutes || 30,
      notes: 'Arrosage consigné suite à la recommandation IA',
      waterSavedM3: Math.round(recommendation.savingsLitersVsFixedCalendar / 1000),
    };

    setHistory([newEntry, ...history]);

    // Réhydratation après arrosage
    if (useIoTMode) {
      setIotData((prev) => ({
        ...prev,
        moistureTop10cm: 72,
        moistureDeep30cm: 75,
        waterTensionKpa: 18,
      }));
    } else {
      setSoilObs((prev) => ({
        ...prev,
        apparentMoisture: 'frais',
      }));
    }
  };

  const handleUpdateCrop = (updated: Partial<CropProfile>) => {
    setCropProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateSoilObs = (updated: Partial<SoilObservation>) => {
    setSoilObs((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateIoT = (updated: Partial<IoTSensorData>) => {
    setIotData((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectRegion = (region: typeof PRESET_REGIONS[0]) => {
    setCurrentRegion(region);
    // Adapte la culture et le sol par défaut pour la région si pertinent
    if (region.defaultCrop && !localStorage.getItem(`${STORAGE_KEY}_crop`)) {
      setCropProfile((prev) => ({
        ...prev,
        cropType: region.defaultCrop,
        cropNameFr: CROPS_DATABASE[region.defaultCrop].nameFr,
        soilType: region.defaultSoil,
      }));
    }
  };

  const handleUseGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentRegion({
            name: `Position locale (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            defaultCrop: cropProfile.cropType,
            defaultSoil: cropProfile.soilType,
          });
        },
        (err) => {
          console.warn('Erreur géolocalisation:', err);
          alert('Impossible de récupérer la position GPS. Sélection manuelle conservée.');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col antialiased">
      {/* 1. En-tête de l'application */}
      <Header
        useIoTMode={useIoTMode}
        onToggleMode={setUseIoTMode}
        lang={lang}
        onChangeLang={setLang}
        isOnline={isOnline}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* 2. Contenu principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Bannière explicative du mode actif */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {useIoTMode ? 'Mode IoT Connecté' : 'Mode Sans Matériel IoT'}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {useIoTMode ? 'Sondes de sol en temps réel' : 'Basé sur observation visuelle du sol & météo'}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {useIoTMode
                ? 'Données de télémétrie en temps réel (10cm & 30cm) croisées avec la demande d’évapotranspiration.'
                : 'Conçu pour les petits exploitants sans investissement matériel : vos yeux et votre smartphone suffisent.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition"
              title="Obtenir la version 1 seul fichier HTML autonome"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-600" />
              <span>Exporter en HTML unique</span>
            </button>
          </div>
        </div>

        {/* 3. Carte Majeure de Décision (Le Tableau de Bord Principal) */}
        <MainDecisionCard
          recommendation={recommendation}
          crop={cropProfile}
          lang={lang}
          onLogIrrigation={handleLogIrrigation}
        />

        {/* 4. Grille centrale : Culture & Sol */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CropProfileCard
            crop={cropProfile}
            onUpdateCrop={handleUpdateCrop}
          />
          <SoilAndSensorsCard
            useIoTMode={useIoTMode}
            soilObs={soilObs}
            onUpdateSoilObs={handleUpdateSoilObs}
            iotData={iotData}
            onUpdateIoTData={handleUpdateIoT}
            soilType={cropProfile.soilType}
          />
        </div>

        {/* 5. Prévisions Météo & Évapotranspiration ET0 */}
        <WeatherCard
          todayWeather={todayWeather}
          forecast={forecast}
          currentLocationName={currentRegion.name}
          onSelectRegion={handleSelectRegion}
          onUseGps={handleUseGps}
          isLoadingWeather={isLoadingWeather}
          etcTodayMm={recommendation.etcMm}
        />

        {/* 6. Historique & Bilan Eau Économisée */}
        <HistoryAndWaterSaved
          history={history}
          onClearHistory={() => setHistory([])}
          totalWaterSavedLiters={totalWaterSavedLiters}
        />
      </main>

      {/* 7. Pied de page */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-stone-700">Irrigation Intelligente IA</span>
            <span>• Optimisation de l'eau agricole & zéro gaspillage</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-emerald-700 font-bold hover:underline"
            >
              Télécharger le fichier HTML unique autonome (.html)
            </button>
            <span>Modèle agronomique FAO Penman-Monteith & Kc</span>
          </div>
        </div>
      </footer>

      {/* 8. Modal de téléchargement / copie du fichier HTML autonome unique */}
      <SingleHtmlExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
