import React from 'react';
import { WeatherDay } from '../types';
import { CloudRain, Sun, Cloud, Wind, Thermometer, Droplet, Compass, MapPin, Sparkles } from 'lucide-react';
import { PRESET_REGIONS } from '../data/agronomyData';

interface WeatherCardProps {
  todayWeather: WeatherDay;
  forecast: WeatherDay[];
  currentLocationName: string;
  onSelectRegion: (region: typeof PRESET_REGIONS[0]) => void;
  onUseGps: () => void;
  isLoadingWeather: boolean;
  etcTodayMm: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  todayWeather,
  forecast,
  currentLocationName,
  onSelectRegion,
  onUseGps,
  isLoadingWeather,
  etcTodayMm,
}) => {
  const getWeatherIcon = (cond: WeatherDay['condition']) => {
    switch (cond) {
      case 'rainy':
      case 'stormy':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'partly_cloudy':
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-stone-500" />;
      case 'sunny':
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 space-y-5">
      {/* En-tête météo & sélecteur de région */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-1.5">
              <span>Prévisions Météorologiques & Évapotranspiration</span>
            </h3>
            <p className="text-xs text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              {currentLocationName} {isLoadingWeather && '(Actualisation...)'}
            </p>
          </div>
        </div>

        {/* Sélecteur de zone géographique */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              const reg = PRESET_REGIONS.find(r => r.name === e.target.value);
              if (reg) onSelectRegion(reg);
            }}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
          >
            {PRESET_REGIONS.map((r) => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
          <button
            onClick={onUseGps}
            title="Utiliser ma position GPS"
            className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conditions du jour & Évapotranspiration */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Température */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-stone-400" />
            Température
          </span>
          <div className="my-1">
            <span className="text-2xl font-black text-stone-900">
              {todayWeather.tempCurrent}°C
            </span>
            <span className="text-[11px] text-stone-500 ml-1.5 font-medium">
              (Min {todayWeather.tempMin}° / Max {todayWeather.tempMax}°)
            </span>
          </div>
          <span className="text-[10px] text-stone-400">Air ambiant</span>
        </div>

        {/* Pluie aujourd'hui */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            Précipitations
          </span>
          <div className="my-1">
            <span className="text-2xl font-black text-blue-700">
              {todayWeather.precipitationMm} mm
            </span>
            <span className="text-[11px] text-stone-500 ml-1.5 font-medium">
              ({todayWeather.precipitationProbability}% prob.)
            </span>
          </div>
          <span className="text-[10px] text-stone-400">
            {todayWeather.precipitationMm > 5 ? 'Pluie utile déduite du besoin' : 'Aucune pluie significative'}
          </span>
        </div>

        {/* Évapotranspiration référence ET0 */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Évapotranspiration ET0
          </span>
          <div className="my-1">
            <span className="text-2xl font-black text-amber-800">
              {todayWeather.et0Mm} mm/j
            </span>
          </div>
          <span className="text-[10px] text-stone-500">Demande climatique de référence</span>
        </div>

        {/* Besoin réel de la plante ETc = ET0 * Kc */}
        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-emerald-700" />
            Consommation plante (ETc)
          </span>
          <div className="my-1">
            <span className="text-2xl font-black text-emerald-800">
              {etcTodayMm} mm/j
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">ET0 × coefficient cultural Kc</span>
        </div>
      </div>

      {/* Prévisions 4 jours suivants pour anticiper */}
      <div>
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2.5">
          Anticipation météo sur les 4 prochains jours
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {forecast.map((fDay, idx) => (
            <div
              key={idx}
              className="bg-stone-50/90 rounded-2xl p-3 border border-stone-200 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  {fDay.dayName}
                </span>
                <span className="text-[11px] text-stone-500">
                  {fDay.tempMin}° à {fDay.tempMax}°C
                </span>
                <div className="text-[10px] font-semibold text-blue-700 mt-0.5">
                  Pluie : {fDay.precipitationMm} mm
                </div>
              </div>
              <div className="flex flex-col items-center">
                {getWeatherIcon(fDay.condition)}
                <span className="text-[10px] text-stone-400 mt-1">
                  ET0 {fDay.et0Mm}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
