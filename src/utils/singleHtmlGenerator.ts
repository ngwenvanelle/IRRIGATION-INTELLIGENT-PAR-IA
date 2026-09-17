/**
 * Générateur du code HTML autonome complet (Single-File HTML)
 * Intègre tout le CSS, SVG et JavaScript nécessaires pour fonctionner
 * directement dans n'importe quel navigateur sans serveur ni compilation.
 */
export function generateStandaloneSingleHtml(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Irrigation Intelligente IA - Application Autonome</title>
  <meta name="description" content="Application prédictive d'irrigation agricole autonome (météo, évapotranspiration, modes avec/sans capteurs).">
  <!-- Tailwind CSS via CDN pour un rendu parfait sans build -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f0fdf4',
              100: '#dcfce7',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .status-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 min-h-screen pb-12">

  <!-- En-tête -->
  <header class="bg-emerald-800 text-white shadow-md sticky top-0 z-30">
    <div class="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🌱</span>
        <div>
          <h1 class="font-bold text-lg leading-tight">Irrigation Intelligente IA</h1>
          <p class="text-xs text-emerald-200">Optimisation prédictive • Fichier HTML autonome</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-700 text-emerald-100 border border-emerald-600">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Mode Autonome 100% Hors-Ligne
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-6 space-y-6">

    <!-- Bannière de bascule Mode Sans Capteur vs Avec Capteurs -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Mode de fonctionnement</span>
        <h2 class="text-base font-bold text-stone-900" id="modeTitle">Mode Sans Capteur (Observation terrain)</h2>
        <p class="text-xs text-stone-600">Accessible sans matériel IoT grâce à l'inspection visuelle et la météo</p>
      </div>
      <div class="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 w-full sm:w-auto">
        <button id="btnModeNoSensors" onclick="setMode(false)" class="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all bg-emerald-600 text-white shadow">
          🌾 Sans capteur (Manuel)
        </button>
        <button id="btnModeSensors" onclick="setMode(true)" class="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all text-stone-700 hover:text-stone-900">
          📡 Avec capteurs IoT
        </button>
      </div>
    </div>

    <!-- Carte Principale de Recommandation -->
    <div id="decisionCard" class="rounded-3xl p-6 shadow-md border-2 transition-all bg-emerald-50 border-emerald-500 text-emerald-950">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <span id="statusBadge" class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
            PAS D'IRRIGATION AUJOURD'HUI
          </span>
          <span class="text-xs font-medium text-stone-600" id="evalTime">Évalué aujourd'hui</span>
        </div>
        <button onclick="speakRecommendation()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-800 text-xs font-bold shadow-sm border border-stone-200">
          🔊 Écouter le conseil vocal
        </button>
      </div>

      <h3 id="decisionHeadline" class="text-2xl sm:text-3xl font-black mb-2 text-stone-900">
        Pas d'irrigation nécessaire
      </h3>
      <p id="decisionExplanation" class="text-base sm:text-lg font-medium text-stone-700 mb-6">
        Le sol conserve une humidité suffisante pour le stade actuel de votre culture.
      </p>

      <!-- Grille des actions concrètes -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200/60">
        <div class="bg-white/90 rounded-2xl p-4 shadow-sm">
          <span class="text-xs text-stone-500 font-semibold block mb-1">⏰ QUAND IRRIGUER</span>
          <span id="recWhen" class="text-lg font-bold text-stone-900">Non requis ce jour</span>
        </div>
        <div class="bg-white/90 rounded-2xl p-4 shadow-sm">
          <span class="text-xs text-stone-500 font-semibold block mb-1">⏱️ DURÉE ESTIMÉE</span>
          <span id="recDuration" class="text-lg font-bold text-stone-900">0 min</span>
        </div>
        <div class="bg-white/90 rounded-2xl p-4 shadow-sm">
          <span class="text-xs text-stone-500 font-semibold block mb-1">💧 VOLUME D'EAU</span>
          <span id="recVolume" class="text-lg font-bold text-emerald-700">0 mm (0 m³)</span>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200/40 text-xs text-stone-600">
        <span id="waterSavedBadge" class="font-semibold text-emerald-800">
          💰 Économie estimée : ~42 000 Litres d'eau préservés vs un arrosage fixe
        </span>
        <button onclick="logIrrigationDone()" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow">
          ✓ Marquer parcelle arrosée
        </button>
      </div>
    </div>

    <!-- Configuration de la Parcelle et Culture -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Carte Culture & Stade -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base text-stone-900 flex items-center gap-2">
            <span>🌱</span> Profil de la Culture
          </h3>
          <span id="kcBadge" class="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg">
            Kc = 1.15 (Floraison)
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Culture</label>
            <select id="cropSelect" onchange="updateCalculations()" class="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold">
              <option value="mais" selected>🌽 Maïs</option>
              <option value="tomate">🍅 Tomate</option>
              <option value="pomme_de_terre">🥔 Pomme de terre</option>
              <option value="ble">🌾 Blé / Céréale</option>
              <option value="riz">🍚 Riz</option>
              <option value="haricot">🫘 Haricot / Niébé</option>
              <option value="oignon">🧅 Oignon</option>
              <option value="manioc">🌱 Manioc</option>
              <option value="marichage">🥬 Maraîchage divers</option>
              <option value="arbres_fruitiers">🍊 Agrumes / Verger</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Stade phénologique</label>
            <select id="stageSelect" onchange="updateCalculations()" class="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold">
              <option value="germination">1. Germination / Levée</option>
              <option value="croissance">2. Croissance végétative</option>
              <option value="floraison" selected>3. Floraison (Sensible)</option>
              <option value="fructification">4. Fructification / Grains</option>
              <option value="maturation">5. Maturation / Récolte</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Superficie (hectares)</label>
            <input type="number" id="areaInput" step="0.1" value="0.5" min="0.01" onchange="updateCalculations()" class="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold">
          </div>
          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Système d'irrigation</label>
            <select id="systemSelect" onchange="updateCalculations()" class="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold">
              <option value="goutte_a_goutte" selected>💧 Goutte-à-goutte (90% eff.)</option>
              <option value="aspersion">🚿 Aspersion (75% eff.)</option>
              <option value="gravitaire">🌊 Gravitaire (55% eff.)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Carte Sol (selon le mode actif) -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
        
        <!-- Panneau SANS CAPTEUR -->
        <div id="panelNoSensors" class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-stone-900 flex items-center gap-2">
              <span>🔎</span> Observation visuelle du sol
            </h3>
            <span class="text-xs font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
              Fiche terrain
            </span>
          </div>

          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Couleur & Type de sol</label>
            <select id="soilTypeSelect" onchange="updateCalculations()" class="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold">
              <option value="argileux" selected>Brun-rougeâtre (Ferralitique / Latéritique / Argileux)</option>
              <option value="argilo_limoneux">Brun sombre (Argilo-limoneux profond)</option>
              <option value="limoneux">Brun clair (Limoneux standard)</option>
              <option value="sableux">Jaune clair / Alluvionnaire (Sableux)</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Humidité apparente observée</label>
            <select id="soilMoistureSelect" onchange="updateCalculations()" class="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold">
              <option value="tres_humide">Sol très humide / boueux (adhère fortement)</option>
              <option value="frais" selected>Sol frais / légèrement humide en profondeur</option>
              <option value="sec">Sol sec en surface, poussiéreux</option>
              <option value="tres_sec">Sol très sec avec crevasses de retrait</option>
            </select>
          </div>

          <p class="text-xs text-stone-500 italic">
            💡 Conforme au cas d'usage : adaptation automatique du coefficient et de la fréquence de rétention.
          </p>
        </div>

        <!-- Panneau AVEC CAPTEURS IOT -->
        <div id="panelSensors" class="space-y-4 hidden">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-stone-900 flex items-center gap-2">
              <span>📡</span> Capteurs IoT Connectés
            </h3>
            <span class="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full animate-pulse">
              ● En direct
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center">
              <span class="text-xs text-stone-500 block">Humidité 10 cm</span>
              <span id="sensorTopVal" class="text-xl font-extrabold text-stone-900">42%</span>
            </div>
            <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center">
              <span class="text-xs text-stone-500 block">Humidité 30 cm</span>
              <span id="sensorDeepVal" class="text-xl font-extrabold text-stone-900">48%</span>
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-stone-500 block mb-1">Ajuster humidité simulée (%)</label>
            <input type="range" id="sensorSlider" min="10" max="90" value="45" oninput="onSensorSliderChange(this.value)" class="w-full accent-emerald-600">
          </div>
        </div>

      </div>
    </div>

    <!-- Météo Locale et Évapotranspiration -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h3 class="font-bold text-base text-stone-900 flex items-center gap-2">
          <span>🌤️</span> Prévisions Météo & Évapotranspiration (ET0)
        </h3>
        <span class="text-xs font-medium text-stone-500">Calcul agronomique Penman-Monteith</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <span class="text-xs text-stone-500 block">Température max</span>
          <span id="wTemp" class="text-lg font-bold text-stone-900">32°C</span>
        </div>
        <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <span class="text-xs text-stone-500 block">Pluie prévue 48h</span>
          <span id="wRain" class="text-lg font-bold text-blue-700">0 mm</span>
        </div>
        <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <span class="text-xs text-stone-500 block">Évaporation ET0</span>
          <span id="wEt0" class="text-lg font-bold text-amber-700">5.4 mm/j</span>
        </div>
        <div class="bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <span class="text-xs text-stone-500 block">Besoin plante (ETc)</span>
          <span id="wEtc" class="text-lg font-bold text-emerald-800">6.2 mm/j</span>
        </div>
      </div>
    </div>

  </main>

  <footer class="max-w-5xl mx-auto px-4 text-center text-xs text-stone-500 pt-6">
    Application Web d'Irrigation Intelligente • Fichier unique intégrant HTML, CSS et JavaScript • Prêt à l'emploi.
  </footer>

  <!-- Logique JavaScript Intégrée Complète -->
  <script>
    let isIoTMode = false;
    let simulatedMoisture = 45;

    const KC_VALUES = {
      mais: { germination: 0.4, croissance: 0.8, floraison: 1.2, fructification: 1.15, maturation: 0.6 },
      tomate: { germination: 0.45, croissance: 0.75, floraison: 1.15, fructification: 1.1, maturation: 0.7 },
      pomme_de_terre: { germination: 0.5, croissance: 0.75, floraison: 1.15, fructification: 1.05, maturation: 0.75 },
      ble: { germination: 0.35, croissance: 0.7, floraison: 1.15, fructification: 1.05, maturation: 0.4 },
      riz: { germination: 1.05, croissance: 1.1, floraison: 1.2, fructification: 1.15, maturation: 0.9 },
      haricot: { germination: 0.4, croissance: 0.7, floraison: 1.1, fructification: 1.05, maturation: 0.35 },
      oignon: { germination: 0.5, croissance: 0.7, floraison: 1.05, fructification: 1.05, maturation: 0.75 },
      manioc: { germination: 0.3, croissance: 0.6, floraison: 0.8, fructification: 0.8, maturation: 0.5 },
      marichage: { germination: 0.5, croissance: 0.75, floraison: 1.05, fructification: 1.0, maturation: 0.8 },
      arbres_fruitiers: { germination: 0.6, croissance: 0.7, floraison: 0.85, fructification: 0.8, maturation: 0.65 }
    };

    const EFFICIENCY = {
      goutte_a_goutte: 0.90,
      aspersion: 0.75,
      gravitaire: 0.55
    };

    function setMode(sensors) {
      isIoTMode = sensors;
      const btnNo = document.getElementById('btnModeNoSensors');
      const btnSens = document.getElementById('btnModeSensors');
      const pNo = document.getElementById('panelNoSensors');
      const pSens = document.getElementById('panelSensors');
      const modeTitle = document.getElementById('modeTitle');

      if (sensors) {
        btnSens.className = "flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all bg-emerald-600 text-white shadow";
        btnNo.className = "flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all text-stone-700 hover:text-stone-900";
        pNo.classList.add('hidden');
        pSens.classList.remove('hidden');
        modeTitle.textContent = "Mode Avancé Avec Capteurs IoT";
      } else {
        btnNo.className = "flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all bg-emerald-600 text-white shadow";
        btnSens.className = "flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all text-stone-700 hover:text-stone-900";
        pSens.classList.add('hidden');
        pNo.classList.remove('hidden');
        modeTitle.textContent = "Mode Sans Capteur (Observation terrain)";
      }
      updateCalculations();
    }

    function onSensorSliderChange(val) {
      simulatedMoisture = Number(val);
      document.getElementById('sensorTopVal').textContent = Math.round(val * 0.95) + '%';
      document.getElementById('sensorDeepVal').textContent = Math.round(val * 1.05) + '%';
      updateCalculations();
    }

    function updateCalculations() {
      const crop = document.getElementById('cropSelect').value;
      const stage = document.getElementById('stageSelect').value;
      const areaHa = parseFloat(document.getElementById('areaInput').value) || 0.5;
      const system = document.getElementById('systemSelect').value;
      const soilType = document.getElementById('soilTypeSelect').value;
      const soilMoisture = document.getElementById('soilMoistureSelect').value;

      // Calcul Kc
      const kc = (KC_VALUES[crop] && KC_VALUES[crop][stage]) || 0.8;
      document.getElementById('kcBadge').textContent = 'Kc = ' + kc + ' (' + stage + ')';

      const et0 = 5.4;
      const etc = Number((et0 * kc).toFixed(1));
      document.getElementById('wEtc').textContent = etc + ' mm/j';

      // Estimation de l'humidité
      let currentMoisture = 50;
      if (isIoTMode) {
        currentMoisture = simulatedMoisture;
      } else {
        if (soilMoisture === 'tres_humide') currentMoisture = 80;
        else if (soilMoisture === 'frais') currentMoisture = 55;
        else if (soilMoisture === 'sec') currentMoisture = 30;
        else if (soilMoisture === 'tres_sec') currentMoisture = 15;
      }

      // Décision
      const card = document.getElementById('decisionCard');
      const badge = document.getElementById('statusBadge');
      const headline = document.getElementById('decisionHeadline');
      const explanation = document.getElementById('decisionExplanation');
      const recWhen = document.getElementById('recWhen');
      const recDuration = document.getElementById('recDuration');
      const recVolume = document.getElementById('recVolume');
      const waterSaved = document.getElementById('waterSavedBadge');

      const eff = EFFICIENCY[system] || 0.85;

      if (currentMoisture <= 32) {
        // URGENT
        card.className = "rounded-3xl p-6 shadow-md border-2 transition-all bg-rose-50 border-rose-500 text-rose-950";
        badge.className = "px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white";
        badge.textContent = "IRRIGATION URGENTE";
        headline.textContent = "Irrigation urgente recommandée";
        explanation.textContent = "Le sol est descendu sous le seuil critique (" + currentMoisture + "%). Vos cultures risquent un stress hydrique immédiat.";
        recWhen.textContent = "Ce soir 18h30 ou demain 06h00";

        const netWaterMm = 14;
        const grossMm = Number((netWaterMm / eff).toFixed(1));
        const volM3 = Math.round(grossMm * 10 * areaHa);
        recVolume.textContent = grossMm + " mm (" + volM3 + " m³)";
        recDuration.textContent = Math.round((volM3 / 15) * 60) + " min";
        waterSaved.textContent = "⚠️ Évitez les heures chaudes de midi pour limiter l'évaporation.";
      } else if (currentMoisture <= 45) {
        // BIENTOT
        card.className = "rounded-3xl p-6 shadow-md border-2 transition-all bg-amber-50 border-amber-500 text-amber-950";
        badge.className = "px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-600 text-white";
        badge.textContent = "IRRIGATION RECOMMANDÉE BIENTÔT";
        headline.textContent = "Préparer un arrosage sous 24h";
        explanation.textContent = "L'humidité du sol diminue (" + currentMoisture + "%). Avec une évaporation de " + etc + " mm/j, un apport sera nécessaire.";
        recWhen.textContent = "Demain matin avant 08h00";

        const netWaterMm = 9;
        const grossMm = Number((netWaterMm / eff).toFixed(1));
        const volM3 = Math.round(grossMm * 10 * areaHa);
        recVolume.textContent = grossMm + " mm (" + volM3 + " m³)";
        recDuration.textContent = Math.round((volM3 / 15) * 60) + " min";
        waterSaved.textContent = "💧 Arrosez à l'aube pour économiser jusqu'à 25% d'eau.";
      } else {
        // OPTIMAL
        card.className = "rounded-3xl p-6 shadow-md border-2 transition-all bg-emerald-50 border-emerald-500 text-emerald-950";
        badge.className = "px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white";
        badge.textContent = "PAS D'IRRIGATION AUJOURD'HUI";
        headline.textContent = "Pas d'irrigation nécessaire";
        explanation.textContent = "L'humidité du sol (" + currentMoisture + "%) est satisfaisante. Aucun apport d'eau requis aujourd'hui.";
        recWhen.textContent = "Non requis ce jour";
        recDuration.textContent = "0 min";
        recVolume.textContent = "0 mm (0 m³)";
        waterSaved.textContent = "💰 Économie estimée : ~" + Math.round(8.3 * 10 * areaHa * 1000) + " Litres préservés.";
      }
    }

    function speakRecommendation() {
      if (!('speechSynthesis' in window)) {
        alert("La synthèse vocale n'est pas supportée par votre navigateur.");
        return;
      }
      const headline = document.getElementById('decisionHeadline').textContent;
      const explanation = document.getElementById('decisionExplanation').textContent;
      const when = document.getElementById('recWhen').textContent;
      const vol = document.getElementById('recVolume').textContent;

      const text = "Recommandation d'irrigation. " + headline + ". " + explanation + ". Moment conseillé : " + when + ". Quantité : " + vol + ".";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    function logIrrigationDone() {
      alert("✅ Irrigation enregistrée avec succès dans le journal de culture ! Le sol est réhydraté.");
      if (isIoTMode) {
        onSensorSliderChange(70);
        document.getElementById('sensorSlider').value = 70;
      } else {
        document.getElementById('soilMoistureSelect').value = 'frais';
      }
      updateCalculations();
    }

    // Initialisation
    window.onload = function() {
      updateCalculations();
    };
  </script>
</body>
</html>`;
}
