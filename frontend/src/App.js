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
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold tracking-widest uppercase">
                RETAIL ANALYSE TOOL
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Winkel Omzetanalyse
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ontdek het verborgen potentieel van uw fysieke winkel en krijg concrete verbeteradviezen
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white border border-gray-200 p-12 sm:p-16 mb-10">
            {/* Input Section */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-900">
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  Basisgegevens
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide"
                  >
                    Winkeloppervlakte (m²)
                  </label>
                  <input
                    id="area"
                    type="number"
                    data-testid="area-input"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-600 transition-all outline-none text-gray-900 text-lg font-medium bg-white"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="weeklyRevenue"
                    className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-600 transition-all outline-none text-gray-900 text-lg font-medium bg-white"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis Questions */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-900">
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  Diagnosevragen
                </h2>
              </div>
              <p className="text-gray-600 mb-8 text-base">
                Beantwoord onderstaande vragen eerlijk voor een accurate analyse.
              </p>

              <div className="space-y-4">
                {questionsData.map((item, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 p-6 bg-white"
                  >
                    <p className="text-gray-900 mb-4 font-medium text-base leading-relaxed">
                      {index + 1}. {item.question}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          handleInputChange(`q${index + 1}`, true)
                        }
                        data-testid={`question-${index + 1}-yes-btn`}
                        className={`flex-1 py-3 border-2 transition-all duration-200 font-semibold text-base ${
                          formData[`q${index + 1}`] === true
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        Ja
                      </button>
                      <button
                        onClick={() =>
                          handleInputChange(`q${index + 1}`, false)
                        }
                        data-testid={`question-${index + 1}-no-btn`}
                        className={`flex-1 py-3 border-2 transition-all duration-200 font-semibold text-base ${
                          formData[`q${index + 1}`] === false
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
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
              <div className="space-y-12 pt-16 border-t-2 border-gray-900">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-900">
                  <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                    Uw Resultaten
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Block A - Current Situation */}
                  <div className="bg-gray-50 border-2 border-gray-300 p-8" data-testid="results-block-a">
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-6">
                      Huidige situatie
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1 font-medium">Jaaromzet</div>
                        <div className="text-3xl font-bold text-gray-900" data-testid="yearly-revenue">
                          {formatCurrency(results.yearlyRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1 font-medium">Omzet per m²</div>
                        <div className="text-2xl font-semibold text-gray-900" data-testid="revenue-per-m2">
                          {formatCurrency(results.revenuePerM2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Block B - Untapped Revenue */}
                  <div className="bg-blue-50 border-2 border-blue-600 p-8" data-testid="results-block-b">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">
                      Structureel onbenut
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 mb-2 font-medium">Bedrag dat blijft liggen</div>
                      <div className="text-4xl font-bold text-blue-600 mb-3" data-testid="untapped-revenue">
                        {formatCurrency(results.untappedRevenue)}
                      </div>
                      <div className="text-xs text-gray-700 bg-white px-3 py-2 border border-blue-200">
                        ≈ {results.percentage}% van huidige omzet
                      </div>
                    </div>
                  </div>

                  {/* Block C - After Optimization */}
                  <div className="bg-gray-900 border-2 border-gray-900 p-8" data-testid="results-block-c">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                      Na optimalisatie
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-2 font-medium">Potentiële jaaromzet</div>
                      <div className="text-4xl font-bold text-white" data-testid="potential-revenue">
                        {formatCurrency(results.potentialRevenue)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problems & Solutions */}
                {results.identifiedProblems.length > 0 && (
                  <div className="mt-16">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 uppercase tracking-wide border-b-2 border-gray-900 pb-4">
                      Waarom blijft dit geld liggen?
                    </h3>
                    <div className="space-y-8">
                      {results.identifiedProblems.map((problem, index) => (
                        <div key={index} className="border-2 border-gray-300 p-8 bg-white">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-2 text-lg uppercase tracking-wide">
                                {problem.problem}
                              </h4>
                              <p className="text-sm text-gray-600 italic">
                                "{problem.question}"
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 border-l-4 border-blue-600 p-6">
                            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
                              Wat moet je verbeteren:
                            </h5>
                            <p className="text-gray-900 leading-relaxed">
                              {problem.solution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.identifiedProblems.length === 0 && (
                  <div className="bg-gray-900 border-2 border-gray-900 p-8 mt-10 text-white">
                    <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">
                      Goede basis!
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Je winkel heeft geen grote structurele problemen. Er is nog wel optimalisatiepotentieel van ongeveer {results.percentage}% door kleine verbeteringen in de flow en presentatie.
                    </p>
                  </div>
                )}

                <div className="flex justify-center pt-12">
                  <button
                    onClick={resetCalculator}
                    data-testid="reset-calculator-btn"
                    className="px-12 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 font-bold uppercase tracking-wide"
                  >
                    Opnieuw berekenen
                  </button>
                </div>
              </div>
            )}

            {!results && (
              <div className="text-center py-20 border-2 border-dashed border-gray-300">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <p className="text-gray-500 font-medium text-lg">
                  Vul alle velden in om je resultaten te zien
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300">
              <div className="w-2 h-2 bg-blue-600"></div>
              <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
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