import React from 'react';
import { SoilObservation, IoTSensorData, SoilType } from '../types';
import { SOIL_DATABASE } from '../data/agronomyData';
import { Eye, Cpu, Layers, Thermometer, Droplet, RefreshCw, Info, HelpCircle } from 'lucide-react';

interface SoilAndSensorsCardProps {
  useIoTMode: boolean;
  soilObs: SoilObservation;
  onUpdateSoilObs: (obs: Partial<SoilObservation>) => void;
  iotData: IoTSensorData;
  onUpdateIoTData: (data: Partial<IoTSensorData>) => void;
  soilType: SoilType;
}

export const SoilAndSensorsCard: React.FC<SoilAndSensorsCardProps> = ({
  useIoTMode,
  soilObs,
  onUpdateSoilObs,
  iotData,
  onUpdateIoTData,
  soilType,
}) => {
  const soilInfo = SOIL_DATABASE[soilType] || SOIL_DATABASE.argilo_limoneux;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
      {/* En-tête du composant */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            {useIoTMode ? <Cpu className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">
              {useIoTMode ? 'Capteurs IoT & Humidité en temps réel' : 'Observation Terrain du Sol (Mode Manuel)'}
            </h3>
            <p className="text-xs text-stone-500">
              {useIoTMode 
                ? 'Données de télémesure sol 10cm et 30cm'
                : 'Conforme à la fiche technique agronomique de terrain'}
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          useIoTMode 
            ? 'bg-blue-100 text-blue-900 border border-blue-200' 
            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
        }`}>
          {useIoTMode ? '📡 Mode Avec Capteurs IoT' : '🌾 Mode Sans Capteurs (Visuel)'}
        </span>
      </div>

      {/* 1. PANNEAU MODE SANS CAPTEURS (FICHE TECHNIQUE VISUELLE) */}
      {!useIoTMode && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Estimation sans matériel électronique : </span>
              Renseignez ce que vous observez directement sur votre parcelle (couleur, mottes après labour, humidité au toucher). L'IA traduit ces indices visuels en capacité de rétention hydrique.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Couleur du sol */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Couleur du sol observée
              </label>
              <select
                value={soilObs.color}
                onChange={(e) => onUpdateSoilObs({ color: e.target.value as SoilObservation['color'] })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="rouge_ocre">Brun-rougeâtre à ocre (Ferralitique / Latéritique - fiche technique)</option>
                <option value="brun_fonce">Brun foncé à noir (Riche en matière organique / Humifère)</option>
                <option value="brun_clair">Brun clair à beige (Limoneux équilibré)</option>
                <option value="jaune_sable">Jaune clair / Blanc (Sableux / Alluvions fluviales)</option>
              </select>
            </div>

            {/* Structure & mottes */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Texture apparente des mottes (labour)
              </label>
              <select
                value={soilObs.structure}
                onChange={(e) => onUpdateSoilObs({ structure: e.target.value as SoilObservation['structure'] })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="mottes_compactes">Mottes compactes se détachant en blocs (Forte argile)</option>
                <option value="mottes_friables">Mottes souples et friables (Argilo-limoneux ameubli)</option>
                <option value="sableux_fluide">Sol pulvérulent, grains de sable libres</option>
              </select>
            </div>

            {/* Humidité visible */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Humidité visible et toucher
              </label>
              <select
                value={soilObs.apparentMoisture}
                onChange={(e) => onUpdateSoilObs({ apparentMoisture: e.target.value as SoilObservation['apparentMoisture'] })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="tres_humide">Sol très humide / sombre adhérant aux outils (80%)</option>
                <option value="frais">Sol frais en profondeur, s'émiette en boule humide (55%)</option>
                <option value="sec">Sol sec en surface, poussiéreux, s'effrite (28%)</option>
                <option value="tres_sec">Sol très sec, crevasses de retrait visibles (15%)</option>
              </select>
            </div>

            {/* Diagnostic agronomique automatique */}
            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-600 block mb-1">
                  Impact agronomique déduit :
                </span>
                <p className="text-xs text-stone-800 font-medium">
                  {soilInfo.waterRetentionDescription}
                </p>
              </div>
              <div className="mt-2 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                Fréquence conseillée : {soilInfo.recommendedFrequency}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PANNEAU MODE AVEC CAPTEURS IOT */}
      {useIoTMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs bg-blue-50 text-blue-950 p-3 rounded-2xl border border-blue-200">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              Sondes LoRaWAN / 3G actives (Station Parcelle #1)
            </span>
            <span className="text-stone-500 font-medium">
              Dernière synchro : il y a 8 min
            </span>
          </div>

          {/* Grille des 4 indicateurs IoT */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] font-bold text-stone-500 block uppercase">Humidité 10 cm</span>
              <span className="text-2xl font-black text-stone-900 block my-1">
                {iotData.moistureTop10cm}%
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Zone superficielle</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] font-bold text-stone-500 block uppercase">Humidité 30 cm</span>
              <span className="text-2xl font-black text-emerald-700 block my-1">
                {iotData.moistureDeep30cm}%
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Zone racinaire pivot</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] font-bold text-stone-500 block uppercase">Température sol</span>
              <span className="text-2xl font-black text-stone-900 block my-1">
                {iotData.soilTemperatureC}°C
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Optimale (22-28°C)</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] font-bold text-stone-500 block uppercase">Tension (kPa)</span>
              <span className="text-2xl font-black text-stone-900 block my-1">
                {iotData.waterTensionKpa}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {iotData.waterTensionKpa > 50 ? 'Sol stressé' : 'Sol confortable'}
              </span>
            </div>
          </div>

          {/* Simulateur de test IoT rapide pour la démonstration (conforme PDF) */}
          <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                Simulateur de télémétrie IoT (pour démonstration)
              </span>
              <span className="text-[11px] font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                Moyenne : {Math.round((iotData.moistureTop10cm + iotData.moistureDeep30cm) / 2)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-500">Sec</span>
              <input
                type="range"
                min="10"
                max="85"
                value={iotData.moistureTop10cm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateIoTData({
                    moistureTop10cm: val,
                    moistureDeep30cm: Math.min(95, Math.max(12, Math.round(val * 1.1))),
                    waterTensionKpa: Math.round(Math.max(10, 100 - val * 1.1)),
                  });
                }}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-xs font-bold text-stone-500">Saturé</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onUpdateIoTData({ moistureTop10cm: 22, moistureDeep30cm: 26, waterTensionKpa: 72 })}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
              >
                Simuler Sol Sec (Stress hydrique)
              </button>
              <button
                type="button"
                onClick={() => onUpdateIoTData({ moistureTop10cm: 44, moistureDeep30cm: 48, waterTensionKpa: 38 })}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
              >
                Simuler Seuil Intermédiaire
              </button>
              <button
                type="button"
                onClick={() => onUpdateIoTData({ moistureTop10cm: 72, moistureDeep30cm: 78, waterTensionKpa: 15 })}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              >
                Simuler Sol Hydraté après pluie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
