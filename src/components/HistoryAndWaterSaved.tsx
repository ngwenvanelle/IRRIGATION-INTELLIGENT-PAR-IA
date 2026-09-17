import React from 'react';
import { IrrigationHistoryEntry } from '../types';
import { History, TrendingDown, Droplets, Calendar, ShieldCheck, Trash2 } from 'lucide-react';

interface HistoryAndWaterSavedProps {
  history: IrrigationHistoryEntry[];
  onClearHistory: () => void;
  totalWaterSavedLiters: number;
}

export const HistoryAndWaterSaved: React.FC<HistoryAndWaterSavedProps> = ({
  history,
  onClearHistory,
  totalWaterSavedLiters,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Impact Écologique & Historique des Arrosages
            </h3>
            <p className="text-xs text-stone-500">
              Traçabilité des apports d'eau et économies réalisées
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1 transition"
            title="Effacer l'historique local"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {/* Carte Statistique d'Impact Eau Économisée */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-white shrink-0">
            <Droplets className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider block">
              Volume total d'eau préservé
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalWaterSavedLiters.toLocaleString()} <span className="text-lg font-normal text-emerald-200">Litres</span>
            </div>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Comparé à une irrigation sur calendrier fixe systématique
            </p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center border border-white/10 text-xs shrink-0">
          <span className="font-bold block text-emerald-200">Énergie de pompage</span>
          <span className="font-black text-lg text-white">
            ~{Math.round(totalWaterSavedLiters * 0.00035)} kWh
          </span>
          <span className="text-[10px] text-emerald-300 block">économisés</span>
        </div>
      </div>

      {/* Liste des interventions enregistrées */}
      <div>
        <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-stone-400" />
          Derniers arrosages consignés
        </h4>

        {history.length === 0 ? (
          <div className="text-center py-6 bg-stone-50 rounded-2xl border border-stone-200/80 text-stone-500 text-xs">
            <ShieldCheck className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
            Aucun arrosage consigné récemment. Cliquez sur « Marquer comme irrigué » sur le tableau de bord pour alimenter le journal.
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Apport de {entry.volumeM3} m³ ({entry.waterAppliedMm} mm)
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      {entry.date} • Durée : {entry.durationMinutes} min
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  +{entry.waterSavedM3} m³ préservés vs fixe
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
