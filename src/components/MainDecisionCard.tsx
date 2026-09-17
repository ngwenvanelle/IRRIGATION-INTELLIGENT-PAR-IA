import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle, Clock, Droplets, AlertTriangle, Sparkles, ShieldCheck, Waves } from 'lucide-react';
import { IrrigationRecommendation, LanguageCode, CropProfile } from '../types';

interface MainDecisionCardProps {
  recommendation: IrrigationRecommendation;
  crop: CropProfile;
  lang: LanguageCode;
  onLogIrrigation: (volumeM3: number, minutes: number) => void;
}

export const MainDecisionCard: React.FC<MainDecisionCardProps> = ({
  recommendation,
  crop,
  lang,
  onLogIrrigation,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  // Synthèse vocale accessible
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `
      Recommandation d'irrigation pour la parcelle de ${crop.cropNameFr}. 
      Statut : ${recommendation.headline}. 
      ${recommendation.simpleExplanation} 
      Moment conseillé : ${recommendation.recommendedTime}. 
      ${recommendation.recommendedWaterMm > 0 
        ? `Durée recommandée : ${recommendation.recommendedDurationMinutes} minutes, pour un volume de ${recommendation.recommendedVolumeM3} mètres cubes d'eau.` 
        : "Aucun apport d'eau n'est nécessaire aujourd'hui."
      }
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'en' ? 'en-US' : 'fr-FR';
    utterance.rate = 0.95; // débit légèrement ralenti pour une clarté optimale sur le terrain

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleConfirmIrrigation = () => {
    onLogIrrigation(recommendation.recommendedVolumeM3, recommendation.recommendedDurationMinutes);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 3000);
  };

  // Styles selon urgence
  const getThemeStyles = () => {
    switch (recommendation.status) {
      case 'urgent':
        return {
          container: 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-400/80 shadow-rose-950/10',
          badge: 'bg-rose-600 text-white shadow-rose-200',
          accentText: 'text-rose-700',
          headline: 'text-rose-950',
          borderSubtle: 'border-rose-200',
          subCard: 'bg-rose-500/10 border-rose-200/80',
          btnAction: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
          statusLabel: 'IRRIGATION URGENTE',
        };
      case 'soon':
        return {
          container: 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-400/80 shadow-amber-950/10',
          badge: 'bg-amber-600 text-white shadow-amber-200',
          accentText: 'text-amber-800',
          headline: 'text-amber-950',
          borderSubtle: 'border-amber-200',
          subCard: 'bg-amber-500/10 border-amber-200/80',
          btnAction: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30',
          icon: <Clock className="w-5 h-5 text-amber-600" />,
          statusLabel: 'IRRIGATION BIENTÔT CONSEILLÉE',
        };
      case 'none':
      default:
        return {
          container: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 border-emerald-400/80 shadow-emerald-950/10',
          badge: 'bg-emerald-600 text-white shadow-emerald-200',
          accentText: 'text-emerald-800',
          headline: 'text-emerald-950',
          borderSubtle: 'border-emerald-200',
          subCard: 'bg-emerald-500/10 border-emerald-200/80',
          btnAction: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/30',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
          statusLabel: "PAS D'IRRIGATION NÉCESSAIRE",
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div id="main-decision-card" className={`rounded-3xl p-6 sm:p-8 border-2 shadow-xl transition-all ${theme.container}`}>
      {/* Barre supérieure : Badge statut & Synthèse vocale */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${theme.badge}`}>
            {theme.icon}
            {theme.statusLabel}
          </span>
          <span className="text-xs font-semibold text-stone-500 bg-white/80 px-2.5 py-1 rounded-full border border-stone-200">
            Parcelle : {crop.areaHa} ha • {crop.cropNameFr}
          </span>
        </div>

        {/* Bouton Audio pour faible littératie ou usage terrain */}
        <button
          id="btn-speech-recommendation"
          onClick={handleSpeak}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
            isPlayingAudio
              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
          title="Écouter la recommandation à voix haute"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-700" />
              <span>Arrêter la lecture</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>Écouter le conseil vocal</span>
            </>
          )}
        </button>
      </div>

      {/* Titre et Explication Simple en 1 phrase (exigence forte du cahier des charges) */}
      <div className="space-y-2 mb-6">
        <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.headline}`}>
          {recommendation.headline}
        </h2>
        <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed max-w-3xl">
          {recommendation.simpleExplanation}
        </p>
      </div>

      {/* Grille des 3 métriques clés d'action : Quand, Combien de temps, En quelle quantité */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        {/* 1. Quand irriguer */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            Quand irriguer
          </span>
          <div>
            <span className="text-lg font-extrabold text-stone-900 block leading-tight">
              {recommendation.recommendedTime}
            </span>
            <span className="text-[11px] text-stone-500">
              {recommendation.status !== 'none' ? "Pour éviter les pertes d'évaporation" : "Réserve du sol suffisante"}
            </span>
          </div>
        </div>

        {/* 2. Combien de temps */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-1">
            <Waves className="w-3.5 h-3.5 text-stone-400" />
            Durée d'arrosage
          </span>
          <div>
            <span className="text-lg font-extrabold text-stone-900 block leading-tight">
              {recommendation.recommendedDurationMinutes > 0
                ? `${recommendation.recommendedDurationMinutes} minutes`
                : '0 min (Arrosage suspendu)'}
            </span>
            <span className="text-[11px] text-stone-500">
              Calibré sur le débit ({crop.systemFlowRateM3h} m³/h)
            </span>
          </div>
        </div>

        {/* 3. Quelle quantité */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-1">
            <Droplets className="w-3.5 h-3.5 text-emerald-600" />
            Quantité d'eau
          </span>
          <div>
            <span className="text-lg font-extrabold text-emerald-700 block leading-tight">
              {recommendation.recommendedWaterMm > 0
                ? `${recommendation.recommendedWaterMm} mm (${recommendation.recommendedVolumeM3} m³)`
                : '0 mm (0 m³)'}
            </span>
            <span className="text-[11px] text-stone-500">
              {recommendation.recommendedVolumeLiters > 0
                ? `Soit ${recommendation.recommendedVolumeLiters.toLocaleString()} Litres sur la parcelle`
                : 'Préservation des nappes phréatiques'}
            </span>
          </div>
        </div>
      </div>

      {/* Barre d'action et bilan économique / eau économisée */}
      <div className="pt-4 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-stone-900 block">
              Économie estimée vs calendrier fixe aveugle :
            </span>
            <span className="text-emerald-700 font-extrabold">
              ~{recommendation.savingsLitersVsFixedCalendar.toLocaleString()} Litres préservés aujourd'hui
            </span>
          </div>
        </div>

        {/* Bouton pour marquer arrosé */}
        <div className="flex items-center gap-2">
          <button
            id="btn-mark-as-irrigated"
            onClick={handleConfirmIrrigation}
            disabled={justLogged}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 ${
              justLogged
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{justLogged ? '✓ Arrosage consigné !' : 'Marquer comme irrigué'}</span>
          </button>
        </div>
      </div>

      {/* Alertes spécifiques si présentes */}
      {recommendation.riskAlerts && recommendation.riskAlerts.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {recommendation.riskAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs bg-amber-100/80 text-amber-900 px-3.5 py-2 rounded-xl border border-amber-200"
            >
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
