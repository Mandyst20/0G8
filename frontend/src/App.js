import { useState } from "react";
import "@/App.css";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    area: "",
    weeklyRevenue: "",
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });
  const [results, setResults] = useState(null);

  const questions = [
    "Klanten lopen regelmatig een ronde zonder iets te kopen.",
    "Ik moet klanten vaak uitleggen waar ze moeten beginnen of wat het verschil is tussen producten.",
    "Producten die goed verkopen staan verspreid door de winkel.",
    "Tijdens drukte wordt het snel onrustig en haken klanten af.",
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.area || !formData.weeklyRevenue) {
        alert("Vul beide velden in om door te gaan.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (
        formData.q1 === null ||
        formData.q2 === null ||
        formData.q3 === null ||
        formData.q4 === null
      ) {
        alert("Beantwoord alle vragen om door te gaan.");
        return;
      }
      calculateResults();
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const calculateResults = () => {
    const yesCount = [formData.q1, formData.q2, formData.q3, formData.q4].filter(
      (answer) => answer === true
    ).length;

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

    setResults({
      yearlyRevenue,
      revenuePerM2,
      untappedRevenue,
      potentialRevenue,
      percentage,
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
    setStep(1);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
              Online Rekentool
            </h1>
            <p className="text-slate-500 text-lg font-light">
              Ontdek het potentieel van uw winkel
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-center space-x-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step >= 1
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <span className="text-sm font-medium">1</span>
              </div>
              <div
                className={`h-0.5 w-16 transition-all duration-300 ${
                  step >= 2 ? "bg-blue-500" : "bg-slate-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step >= 2
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <span className="text-sm font-medium">2</span>
              </div>
              <div
                className={`h-0.5 w-16 transition-all duration-300 ${
                  step >= 3 ? "bg-blue-500" : "bg-slate-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step >= 3
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
            {/* Step 1: Input */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-light text-slate-800 mb-6">
                    Stap 1 — Uw winkelsituatie
                  </h2>
                  <p className="text-slate-500 mb-8 font-light">
                    Vul de onderstaande gegevens in om te beginnen.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="area"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Winkeloppervlakte (m²)
                    </label>
                    <input
                      id="area"
                      type="number"
                      data-testid="area-input"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-800"
                      placeholder="Bijv. 150"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="weeklyRevenue"
                      className="block text-sm font-medium text-slate-700 mb-2"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-800"
                      placeholder="Bijv. 5000"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNextStep}
                    data-testid="next-step-1-btn"
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Volgende
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Diagnosis Questions */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-light text-slate-800 mb-6">
                    Stap 2 — Diagnosevragen
                  </h2>
                  <p className="text-slate-500 mb-8 font-light">
                    Beantwoord onderstaande vragen met ja of nee.
                  </p>
                </div>

                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg p-6 bg-slate-50/50"
                    >
                      <p className="text-slate-700 mb-4 font-light">
                        {index + 1}. {question}
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() =>
                            handleInputChange(`q${index + 1}`, true)
                          }
                          data-testid={`question-${index + 1}-yes-btn`}
                          className={`flex-1 py-2.5 rounded-lg border transition-all duration-200 font-medium ${
                            formData[`q${index + 1}`] === true
                              ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:border-blue-300"
                          }`}
                        >
                          Ja
                        </button>
                        <button
                          onClick={() =>
                            handleInputChange(`q${index + 1}`, false)
                          }
                          data-testid={`question-${index + 1}-no-btn`}
                          className={`flex-1 py-2.5 rounded-lg border transition-all duration-200 font-medium ${
                            formData[`q${index + 1}`] === false
                              ? "bg-slate-600 text-white border-slate-600 shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          Nee
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrevStep}
                    data-testid="prev-step-btn"
                    className="px-8 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all duration-200 font-medium"
                  >
                    Vorige
                  </button>
                  <button
                    onClick={handleNextStep}
                    data-testid="calculate-results-btn"
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Bereken resultaat
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 3 && results && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-light text-slate-800 mb-6">
                    Uw resultaten
                  </h2>
                  <p className="text-slate-500 mb-8 font-light">
                    Op basis van uw gegevens hebben wij het volgende berekend:
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Block A - Current Situation */}
                  <div className="border-l-4 border-slate-400 bg-slate-50 rounded-r-lg p-6" data-testid="results-block-a">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">
                      Blok A — Huidige situatie
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-light">
                          Jaaromzet:
                        </span>
                        <span className="text-xl font-medium text-slate-800" data-testid="yearly-revenue">
                          {formatCurrency(results.yearlyRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-light">
                          Omzet per m² per jaar:
                        </span>
                        <span className="text-xl font-medium text-slate-800" data-testid="revenue-per-m2">
                          {formatCurrency(results.revenuePerM2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Block B - Untapped Revenue */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-6" data-testid="results-block-b">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">
                      Blok B — Structureel onbenut
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-light">
                          Bedrag dat jaarlijks blijft liggen:
                        </span>
                        <span className="text-2xl font-semibold text-amber-700" data-testid="untapped-revenue">
                          {formatCurrency(results.untappedRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Block C - After Optimization */}
                  <div className="border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg p-6" data-testid="results-block-c">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">
                      Blok C — Na optimalisatie
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-light">
                          Potentiële jaaromzet na verbetering:
                        </span>
                        <span className="text-2xl font-semibold text-emerald-700" data-testid="potential-revenue">
                          {formatCurrency(results.potentialRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <p className="text-slate-700 font-light text-center">
                    Deze tool toont welke omzet structureel jaarlijks blijft liggen en wat realistisch gerealiseerd kan worden.
                  </p>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={resetCalculator}
                    data-testid="reset-calculator-btn"
                    className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Nieuwe berekening
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm font-light">
              Online Rekentool voor fysieke retail — Versie 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;