import React, { useState } from 'react';
import { CropProfile, CropType, PhenologicalStage, SoilType, IrrigationSystem } from '../types';
import { CROPS_DATABASE, STAGES_LABELS, SOIL_DATABASE, IRRIGATION_SYSTEMS } from '../data/agronomyData';
import { Sprout, Settings2, Sliders, Check } from 'lucide-react';

interface CropProfileCardProps {
  crop: CropProfile;
  onUpdateCrop: (updated: Partial<CropProfile>) => void;
}

export const CropProfileCard: React.FC<CropProfileCardProps> = ({ crop, onUpdateCrop }) => {
  const [isEditing, setIsEditing] = useState(false);

  const cropInfo = CROPS_DATABASE[crop.cropType] || CROPS_DATABASE.mais;
  const stageInfo = STAGES_LABELS[crop.stage] || STAGES_LABELS.floraison;
  const soilInfo = SOIL_DATABASE[crop.soilType] || SOIL_DATABASE.argilo_limoneux;
  const systemInfo = IRRIGATION_SYSTEMS[crop.irrigationSystem] || IRRIGATION_SYSTEMS.goutte_a_goutte;

  const currentKc = cropInfo.kcStages[crop.stage] ?? 0.8;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold">
            {cropInfo.icon}
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <span>{crop.name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {crop.areaHa} ha
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Culture : {cropInfo.nameFr} • Stade : {stageInfo.fr}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Settings2 className="w-3.5 h-3.5 text-stone-600" />}
          <span>{isEditing ? 'Valider les réglages' : 'Modifier la parcelle'}</span>
        </button>
      </div>

      {/* Résumé visuel des paramètres agronomiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Stade et Kc */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 block uppercase">Stade & Kc</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-xl font-extrabold text-stone-900">Kc = {currentKc}</span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium block truncate">
            {stageInfo.fr}
          </span>
        </div>

        {/* Système d'arrosage & Efficience */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 block uppercase">Système & Efficience</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-xl font-extrabold text-emerald-700">
              {Math.round(systemInfo.efficiency * 100)}%
            </span>
            <span className="text-xs text-stone-500 font-medium">efficience</span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium block truncate">
            {systemInfo.nameFr}
          </span>
        </div>

        {/* Débit de la station */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 block uppercase">Débit du système</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-xl font-extrabold text-stone-900">
              {crop.systemFlowRateM3h} m³/h
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium block">
            Pour {crop.areaHa} hectare(s)
          </span>
        </div>

        {/* Type de sol déclaré */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 block uppercase">Nature du sol</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-lg font-bold text-stone-900 truncate">
              {soilInfo.nameFr.split('(')[0]}
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium block truncate">
            Drainage {soilInfo.drainageRate}
          </span>
        </div>
      </div>

      {/* Jauge d'avancement phénologique */}
      <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700">Cycle phénologique : {stageInfo.fr}</span>
          <span className="font-extrabold text-emerald-700">{stageInfo.progress}% du cycle</span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${stageInfo.progress}%` }}
          />
        </div>
        <p className="text-[11px] text-stone-500 italic">
          💡 {stageInfo.description}
        </p>
      </div>

      {/* Formulaire de modification en accordéon si isEditing est actif */}
      {isEditing && (
        <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-stone-50/80 p-4 rounded-2xl">
          {/* Culture */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Type de culture
            </label>
            <select
              value={crop.cropType}
              onChange={(e) => {
                const selected = e.target.value as CropType;
                onUpdateCrop({
                  cropType: selected,
                  cropNameFr: CROPS_DATABASE[selected].nameFr,
                });
              }}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              {Object.values(CROPS_DATABASE).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Stade */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Stade de développement
            </label>
            <select
              value={crop.stage}
              onChange={(e) => onUpdateCrop({ stage: e.target.value as PhenologicalStage })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="germination">1. Germination / Levée</option>
              <option value="croissance">2. Croissance végétative</option>
              <option value="floraison">3. Floraison (Très sensible)</option>
              <option value="fructification">4. Fructification / Grains</option>
              <option value="maturation">5. Maturation / Récolte</option>
            </select>
          </div>

          {/* Superficie */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Superficie de la parcelle (ha)
            </label>
            <input
              type="number"
              min="0.05"
              step="0.1"
              value={crop.areaHa}
              onChange={(e) => onUpdateCrop({ areaHa: Math.max(0.01, parseFloat(e.target.value) || 0.1) })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          {/* Système d'arrosage */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Méthode d'irrigation
            </label>
            <select
              value={crop.irrigationSystem}
              onChange={(e) => onUpdateCrop({ irrigationSystem: e.target.value as IrrigationSystem })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="goutte_a_goutte">Goutte-à-goutte (Efficience 90%)</option>
              <option value="aspersion">Aspersion classique (Efficience 75%)</option>
              <option value="micro_aspersion">Micro-aspersion (Efficience 85%)</option>
              <option value="gravitaire">Gravitaire / Raies (Efficience 55%)</option>
            </select>
          </div>

          {/* Débit pompe */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Débit du réseau (m³/heure)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={crop.systemFlowRateM3h}
              onChange={(e) => onUpdateCrop({ systemFlowRateM3h: Math.max(0.5, parseFloat(e.target.value) || 5) })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          {/* Type de sol */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Texture du sol dominante
            </label>
            <select
              value={crop.soilType}
              onChange={(e) => onUpdateCrop({ soilType: e.target.value as SoilType })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="argileux">Argileux / Latéritique (Forte rétention)</option>
              <option value="argilo_limoneux">Argilo-limoneux (Équilibré profond)</option>
              <option value="limoneux">Limoneux</option>
              <option value="sablo_limoneux">Sablo-limoneux</option>
              <option value="sableux">Sableux (Faible rétention)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
