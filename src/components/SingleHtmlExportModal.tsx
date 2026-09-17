import React, { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, Code2, Sparkles, FileCheck } from 'lucide-react';
import { generateStandaloneSingleHtml } from '../utils/singleHtmlGenerator';

interface SingleHtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleHtmlExportModal: React.FC<SingleHtmlExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [htmlCode] = useState(() => generateStandaloneSingleHtml());

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'irrigation_intelligente.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* En-tête modal */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Code2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Code HTML Unique (Standalone)
              </h3>
              <p className="text-xs text-emerald-200">
                1 seul fichier avec HTML, CSS et JavaScript intégrés pour exécution directe dans le navigateur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du modal */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Prêt pour le navigateur sans aucune installation ni serveur</span>
            </div>
            <p>
              Ce fichier HTML autonome intègre l'algorithme prédictif (ET0, coefficients Kc, bilans hydriques), les modes avec et sans capteurs (fiche agronomique de terrain), la synthèse vocale audio et l'interface responsive. Vous pouvez le double-cliquer pour l'ouvrir dans Chrome, Safari, Firefox ou sur un smartphone même hors-connexion.
            </p>
          </div>

          {/* Boutons d'actions rapides */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger irrigation_intelligente.html</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs border transition-all active:scale-95 ${
                copied
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
              <span>{copied ? 'Code copié dans le presse-papier !' : 'Copier tout le code HTML'}</span>
            </button>

            <a
              href="/irrigation_intelligente.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition"
            >
              <ExternalLink className="w-4 h-4 text-stone-600" />
              <span>Ouvrir en direct</span>
            </a>
          </div>

          {/* Aperçu du code source */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              Aperçu du fichier unique ({htmlCode.length} caractères) :
            </span>
            <div className="relative rounded-2xl bg-stone-900 p-4 text-stone-200 text-[11px] font-mono h-60 overflow-y-auto border border-stone-800">
              <pre>{htmlCode}</pre>
            </div>
          </div>
        </div>

        {/* Pied de modal */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
