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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-gray-800 mb-3">
              Online Rekentool
            </h1>
            <p className="text-gray-600 text-lg font-light">
              Ontdek het potentieel van uw winkel
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-md p-10 mb-8">
            {/* Input Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 mb-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800">Basisgegevens</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Winkeloppervlakte (m²)
                  </label>
                  <input
                    type="number"
                    data-testid="area-input"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800 text-base"
                    placeholder="Bijv. 150"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Gemiddelde omzet per week (€)
                  </label>
                  <input
                    type="number"
                    data-testid="weekly-revenue-input"
                    value={formData.weeklyRevenue}
                    onChange={(e) => handleInputChange("weeklyRevenue", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800 text-base"
                    placeholder="Bijv. 5000"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis Questions */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 mb-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800">Diagnosevragen</h2>
              </div>
              <p className="text-gray-600 mb-6 text-base">
                Beantwoord onderstaande vragen eerlijk voor een accurate analyse.
              </p>

              <div className="space-y-4">
                {questionsData.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white">
                    <p className="text-gray-700 mb-3 text-base">
                      {index + 1}. {item.question}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleInputChange(`q${index + 1}`, true)}
                        data-testid={`question-${index + 1}-yes-btn`}
                        className={`flex-1 py-2.5 rounded-lg transition-all duration-200 font-semibold text-base ${
                          formData[`q${index + 1}`] === true
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-orange-300"
                        }`}
                      >
                        Ja
                      </button>
                      <button
                        onClick={() => handleInputChange(`q${index + 1}`, false)}
                        data-testid={`question-${index + 1}-no-btn`}
                        className={`flex-1 py-2.5 rounded-lg transition-all duration-200 font-semibold text-base ${
                          formData[`q${index + 1}`] === false
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
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
              <div className="space-y-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-800">Jouw Resultaten</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Block A - Current Situation */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-testid="results-block-a">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                      📊 Huidige situatie
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-base text-gray-600 mb-1">Jaaromzet:</div>
                        <div className="text-2xl font-semibold text-gray-800" data-testid="yearly-revenue">
                          {formatCurrency(results.yearlyRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-base text-gray-600 mb-1">Omzet per m² per jaar:</div>
                        <div className="text-xl font-medium text-gray-700" data-testid="revenue-per-m2">
                          {formatCurrency(results.revenuePerM2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Block B - Untapped Revenue */}
                  <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 shadow-sm" data-testid="results-block-b">
                    <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">
                      ⚠️ Structureel onbenut
                    </h3>
                    <div>
                      <div className="text-base text-gray-700 mb-2">Bedrag dat jaarlijks blijft liggen:</div>
                      <div className="text-3xl font-bold text-amber-600 mb-3" data-testid="untapped-revenue">
                        {formatCurrency(results.untappedRevenue)}
                      </div>
                      <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
                        Dit is ongeveer {results.percentage}% van je huidige omzet die je misloopt door onderstaande problemen.
                      </div>
                    </div>
                  </div>

                  {/* Block C - After Optimization */}
                  <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 shadow-sm" data-testid="results-block-c">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">
                      ✨ Na optimalisatie
                    </h3>
                    <div>
                      <div className="text-base text-gray-700 mb-2">Potentiële jaaromzet na verbetering:</div>
                      <div className="text-3xl font-bold text-emerald-600" data-testid="potential-revenue">
                        {formatCurrency(results.potentialRevenue)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problems & Solutions */}
                {results.identifiedProblems.length > 0 && (
                  <div className="mt-8">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 mb-6 rounded-lg">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">🔍</span>
                        Waarom blijft dit geld liggen?
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {results.identifiedProblems.map((problem, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                          <div className="flex items-start space-x-3 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 mb-2 text-base">
                                Probleem: {problem.problem}
                              </h4>
                              <p className="text-base text-gray-600 italic">
                                "{problem.question}"
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-400">
                            <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <span className="text-base">💡</span>
                              Wat moet je verbeteren:
                            </h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              {problem.solution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.identifiedProblems.length === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-8">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                      🎉 Goede basis!
                    </h3>
                    <p className="text-gray-700 font-light">
                      Je winkel heeft geen grote structurele problemen. Er is nog wel optimalisatiepotentieel van ongeveer {results.percentage}% door kleine verbeteringen in de flow en presentatie.
                    </p>
                  </div>
                )}

                <div className="flex justify-center pt-6">
                  <button
                    onClick={resetCalculator}
                    data-testid="reset-calculator-btn"
                    className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Opnieuw berekenen
                  </button>
                </div>
              </div>
            )}

            {!results && (
              <div className="text-center py-8 text-gray-400 font-light">
                Vul alle velden in om je resultaten te zien
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-400 text-sm font-light">
              Online Rekentool voor fysieke retail — Versie 2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;