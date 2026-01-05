import { useState, useEffect } from "react";
import "@/App.css";

function App() {
  const [formData, setFormData] = useState({
    area: "",
    weeklyRevenue: "",
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });
  const [results, setResults] = useState(null);

  const questionsData = [
    {
      question: "Klanten lopen regelmatig een ronde zonder iets te kopen.",
      problem: "Onduidelijke winkelroute en productpresentatie",
      solution: "Creëer een logische looproute met duidelijke zones en signage. Plaats populaire producten strategisch verspreid om klanten door de hele winkel te leiden."
    },
    {
      question: "Ik moet klanten vaak uitleggen waar ze moeten beginnen of wat het verschil is tussen producten.",
      problem: "Gebrek aan heldere communicatie en productinformatie",
      solution: "Verbeter signage en productetiketten. Gebruik informatieborden, QR-codes of digitale schermen om productinformatie duidelijk te maken. Train personeel in proactieve klantenservice."
    },
    {
      question: "Producten die goed verkopen staan verspreid door de winkel.",
      problem: "Suboptimale productplaatsing en merchandising",
      solution: "Analyseer verkoopdata en hergroepeer producten logisch. Creëer thematische zones of productcombinaties die natuurlijk bij elkaar horen. Plaats bestsellers op strategische plekken."
    },
    {
      question: "Tijdens drukte wordt het snel onrustig en haken klanten af.",
      problem: "Inadequate ruimte-indeling en crowd management",
      solution: "Verbreed gangpaden, verminder obstakels en creëer meerdere kassa-opties. Implementeer een wachtrij-managementsysteem en zorg voor voldoende personeel tijdens piekuren."
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    // Auto-calculate when all fields are filled
    if (
      formData.area &&
      formData.weeklyRevenue &&
      formData.q1 !== null &&
      formData.q2 !== null &&
      formData.q3 !== null &&
      formData.q4 !== null
    ) {
      calculateResults();
    } else {
      setResults(null);
    }
  }, [formData]);

  const calculateResults = () => {
    const answers = [formData.q1, formData.q2, formData.q3, formData.q4];
    const yesCount = answers.filter((answer) => answer === true).length;

    let percentage = 0;
    if (yesCount <= 1) percentage = 10;
    else if (yesCount <= 3) percentage = 20;
    else percentage = 30;

    const weeklyRevenue = parseFloat(formData.weeklyRevenue);
    const area = parseFloat(formData.area);

    const yearlyRevenue = weeklyRevenue * 52;
    const revenuePerM2 = yearlyRevenue / area;
    const untappedRevenue = yearlyRevenue * (percentage / 100);
    const potentialRevenue = yearlyRevenue + untappedRevenue;

    // Get identified problems
    const identifiedProblems = answers.map((answer, index) => ({
      hasIssue: answer === true,
      ...questionsData[index]
    })).filter(item => item.hasIssue);

    setResults({
      yearlyRevenue,
      revenuePerM2,
      untappedRevenue,
      potentialRevenue,
      percentage,
      identifiedProblems
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetCalculator = () => {
    setFormData({
      area: "",
      weeklyRevenue: "",
      q1: null,
      q2: null,
      q3: null,
      q4: null,
    });
    setResults(null);
  };

  return (
    <div className="App">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Premium Header */}
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-block mb-4">
              <div className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium tracking-wide">
                RETAIL ANALYSE TOOL
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Winkel Omzetanalyse
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ontdek het verborgen potentieel van uw fysieke winkel en krijg concrete verbeteradviezen
            </p>
          </div>

          {/* Main Content Card with Glass Effect */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 p-10 sm:p-14 mb-10 fade-in-up">
            {/* Input Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
                  1
                </div>
                <h2 className="text-3xl font-semibold text-slate-900">
                  Basisgegevens
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-semibold text-slate-700 mb-3"
                  >
                    Winkeloppervlakte (m²)
                  </label>
                  <input
                    id="area"
                    type="number"
                    data-testid="area-input"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-900 text-lg font-medium bg-white shadow-sm"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="weeklyRevenue"
                    className="block text-sm font-semibold text-slate-700 mb-3"
                  >
                    Gemiddelde omzet per week (€)
                  </label>
                  <input
                    id="weeklyRevenue"
                    type="number"
                    data-testid="weekly-revenue-input"
                    value={formData.weeklyRevenue}
                    onChange={(e) =>
                      handleInputChange("weeklyRevenue", e.target.value)
                    }
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-900 text-lg font-medium bg-white shadow-sm"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis Questions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-violet-500/30">
                  2
                </div>
                <h2 className="text-3xl font-semibold text-slate-900">
                  Diagnosevragen
                </h2>
              </div>
              <p className="text-slate-600 mb-8 text-base">
                Beantwoord onderstaande vragen eerlijk voor een accurate analyse.
              </p>

              <div className="space-y-5">
                {questionsData.map((item, index) => (
                  <div
                    key={index}
                    className="border-2 border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-white to-slate-50/50 hover:border-slate-300 transition-all"
                  >
                    <p className="text-slate-800 mb-4 font-medium text-base leading-relaxed">
                      {index + 1}. {item.question}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          handleInputChange(`q${index + 1}`, true)
                        }
                        data-testid={`question-${index + 1}-yes-btn`}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 font-semibold text-base shadow-sm ${
                          formData[`q${index + 1}`] === true
                            ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/30 scale-[1.02]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:shadow-md"
                        }`}
                      >
                        Ja
                      </button>
                      <button
                        onClick={() =>
                          handleInputChange(`q${index + 1}`, false)
                        }
                        data-testid={`question-${index + 1}-no-btn`}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 font-semibold text-base shadow-sm ${
                          formData[`q${index + 1}`] === false
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-[1.02]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        Nee
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="space-y-10 pt-12 border-t-2 border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-emerald-500/30">
                    3
                  </div>
                  <h2 className="text-3xl font-semibold text-slate-900">
                    Uw Resultaten
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Block A - Current Situation */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 border-2 border-slate-200 shadow-sm" data-testid="results-block-a">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      📊 Huidige situatie
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Jaaromzet</div>
                        <div className="text-3xl font-bold text-slate-900" data-testid="yearly-revenue">
                          {formatCurrency(results.yearlyRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Omzet per m²</div>
                        <div className="text-2xl font-semibold text-slate-700" data-testid="revenue-per-m2">
                          {formatCurrency(results.revenuePerM2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Block B - Untapped Revenue */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-8 border-2 border-amber-200 shadow-sm" data-testid="results-block-b">
                    <div className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-4">
                      ⚠️ Structureel onbenut
                    </div>
                    <div>
                      <div className="text-sm text-amber-700 mb-2">Bedrag dat blijft liggen</div>
                      <div className="text-4xl font-bold text-amber-900 mb-3" data-testid="untapped-revenue">
                        {formatCurrency(results.untappedRevenue)}
                      </div>
                      <div className="text-xs text-amber-800 italic bg-white/60 px-3 py-2 rounded-lg">
                        ≈ {results.percentage}% van huidige omzet
                      </div>
                    </div>
                  </div>

                  {/* Block C - After Optimization */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border-2 border-emerald-200 shadow-sm" data-testid="results-block-c">
                    <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
                      ✨ Na optimalisatie
                    </div>
                    <div>
                      <div className="text-sm text-emerald-700 mb-2">Potentiële jaaromzet</div>
                      <div className="text-4xl font-bold text-emerald-900" data-testid="potential-revenue">
                        {formatCurrency(results.potentialRevenue)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problems & Solutions */}
                {results.identifiedProblems.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-8 flex items-center gap-3">
                      <span className="text-3xl">🔍</span>
                      Waarom blijft dit geld liggen?
                    </h3>
                    <div className="space-y-6">
                      {results.identifiedProblems.map((problem, index) => (
                        <div key={index} className="bg-gradient-to-br from-rose-50 to-rose-100/30 border-2 border-rose-200 rounded-2xl p-8 shadow-sm">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-rose-500/30">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-2 text-lg">
                                {problem.problem}
                              </h4>
                              <p className="text-sm text-slate-600 italic">
                                "{problem.question}"
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-500 shadow-sm">
                            <div className="flex items-start gap-2 mb-3">
                              <span className="text-xl">💡</span>
                              <h5 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                                Wat moet je verbeteren:
                              </h5>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {problem.solution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.identifiedProblems.length === 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-2 border-emerald-200 rounded-2xl p-8 mt-10 shadow-sm">
                    <h3 className="text-xl font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      Goede basis!
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      Je winkel heeft geen grote structurele problemen. Er is nog wel optimalisatiepotentieel van ongeveer {results.percentage}% door kleine verbeteringen in de flow en presentatie.
                    </p>
                  </div>
                )}

                <div className="flex justify-center pt-10">
                  <button
                    onClick={resetCalculator}
                    data-testid="reset-calculator-btn"
                    className="px-10 py-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-200 font-semibold shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:scale-[1.02]"
                  >
                    Opnieuw berekenen
                  </button>
                </div>
              </div>
            )}

            {!results && (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border-2 border-dashed border-slate-300">
                <div className="text-slate-400 text-6xl mb-4">📊</div>
                <p className="text-slate-500 font-medium text-lg">
                  Vul alle velden in om je resultaten te zien
                </p>
              </div>
            )}
          </div>

          {/* Premium Footer */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-slate-600 text-sm font-medium">
                Winkel Omzetanalyse Tool — Versie 2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;