import React from 'react';
import { Droplet, Cpu, Eye, Download, Wifi, WifiOff, FileCode, Sprout } from 'lucide-react';
import { LanguageCode } from '../types';

interface HeaderProps {
  useIoTMode: boolean;
  onToggleMode: (useIoT: boolean) => void;
  lang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  isOnline: boolean;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  useIoTMode,
  onToggleMode,
  lang,
  onChangeLang,
  isOnline,
  onOpenExportModal,
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg border-b border-emerald-800/80 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Titre */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950/40 text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                Irrigation Intelligente <span className="text-emerald-400 font-black text-sm px-1.5 py-0.5 bg-emerald-950/80 rounded border border-emerald-700/50">IA</span>
              </h1>
              {/* Statut connectivité */}
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isOnline ? 'bg-emerald-800/80 text-emerald-200' : 'bg-amber-900/80 text-amber-200'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3 text-emerald-300" /> : <WifiOff className="w-3 h-3 text-amber-300" />}
                <span className="hidden sm:inline">{isOnline ? 'Connecté' : 'Cache Hors-Ligne'}</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 hidden sm:block">
              Optimisation prédictive • Météo & Évapotranspiration • Multi-terrains
            </p>
          </div>
        </div>

        {/* Contrôles de navigation et actions */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Bascule Mode Sans Capteur / Mode IoT */}
          <div className="flex items-center bg-emerald-950/70 p-1 rounded-xl border border-emerald-800/60 shadow-inner">
            <button
              id="btn-mode-sans-capteur"
              onClick={() => onToggleMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !useIoTMode
                  ? 'bg-emerald-500 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
              title="Mode dégradé pour petits exploitants sans matériel IoT"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Sans capteurs</span>
            </button>
            <button
              id="btn-mode-iot"
              onClick={() => onToggleMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                useIoTMode
                  ? 'bg-emerald-500 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
              title="Mode connecté avec sondes d'humidité et température du sol"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Capteurs IoT</span>
            </button>
          </div>

          {/* Sélecteur de langue */}
          <div className="flex items-center bg-emerald-950/70 rounded-xl px-2 py-1 border border-emerald-800/60">
            <select
              value={lang}
              onChange={(e) => onChangeLang(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-bold text-emerald-100 focus:outline-none cursor-pointer"
              title="Changer de langue"
            >
              <option value="fr" className="bg-stone-900 text-white">FR</option>
              <option value="en" className="bg-stone-900 text-white">EN</option>
              <option value="wo" className="bg-stone-900 text-white">WO (Wolof)</option>
            </select>
          </div>

          {/* Bouton pour télécharger ou exporter le HTML autonome unique */}
          <button
            id="btn-open-single-html-modal"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md transition-all active:scale-95"
            title="Générer et télécharger le code en un seul fichier HTML complet"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="font-extrabold">Fichier HTML Unique</span>
          </button>
        </div>
      </div>
    </header>
  );
};
