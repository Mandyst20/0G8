import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "@/App.css";

function App() {
  const [formData, setFormData] = useState({
    companyName: "",
    area: "",
    weeklyRevenue: "",
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
  });
  const [results, setResults] = useState(null);

  const questionsData = [
    // Categorie A - Structuur & keuzes (🟡 Geel)
    {
      category: "A",
      categoryName: "Structuur & keuzes",
      categoryColor: "yellow",
      question: "De winkelindeling is de afgelopen 12 maanden aangepast op basis van concreet klantgedrag en niet op gevoel of esthetiek.",
      linkedBlock: null
    },
    {
      category: "A",
      categoryName: "Structuur & keuzes",
      categoryColor: "yellow",
      question: "Bestverkopende producten zijn strategisch geplaatst om klanten door te leiden naar een volgende aankoop (bijvoorbeeld combinaties, upgrades of aanvullingen).",
      linkedBlock: null
    },
    {
      category: "A",
      categoryName: "Structuur & keuzes",
      categoryColor: "yellow",
      question: "Bij het inrichten van de winkel is expliciet nagedacht over waar klanten stoppen, twijfelen of afhaken en neemt keuzestress weg.",
      linkedBlock: null
    },
    // Categorie B - Volwassenheid / smart retail (🔴 Rood)
    {
      category: "B",
      categoryName: "Volwassenheid / smart retail",
      categoryColor: "red",
      question: "De winkel is ingericht op piekmomenten (drukte), niet alleen op rustige momenten of ideale klantflow.",
      linkedBlock: null
    },
    {
      category: "B",
      categoryName: "Volwassenheid / smart retail",
      categoryColor: "red",
      question: "Klanten kunnen zelfstandig tot aankoop komen zonder uitleg van personeel, doordat keuzes vooraf zijn vereenvoudigd.",
      linkedBlock: 2, // BLOK 2
      problem: "De winkel leunt te veel op uitleg van jou of je team",
      problemDescription: "Klanten vragen waar wat ligt, wat het verschil is, of wat ze nodig hebben.",
      explanation: "Als klanten pas kunnen kiezen nadat jij iets hebt uitgelegd, dan ligt de druk volledig bij jou en je team. En dat is niet vol te houden zonder omzet te verliezen. Op rustige momenten lukt dat nog. Tijdens drukte niet. En precies dan lopen de meeste aankopen weg.\n\nVeel klanten durven geen vragen te stellen. Die lopen dan liever door of vertrekken.",
      solution: "We vertalen veelgestelde vragen en twijfelpunten naar vaste keuzestructuren in de winkel, zodat beslissingen minder afhankelijk zijn van uitleg."
    },
    {
      category: "B",
      categoryName: "Volwassenheid / smart retail",
      categoryColor: "red",
      question: "De winkel 'stuurt' klanten actief richting beslissingen, in plaats van reactief te wachten tot klanten vragen stellen.",
      linkedBlock: null
    },
    // Categorie C - Herkenning (🟢 Groen)
    {
      category: "C",
      categoryName: "Herkenning",
      categoryColor: "green",
      question: "Meer dan 30% van de klanten verlaat de winkel zonder aankoop.",
      linkedBlock: 3, // BLOK 3
      problem: "Drukte in de winkel vertaalt zich onvoldoende naar extra verkopen",
      problemDescription: "Op piekmomenten blijven klanten korter, twijfelen meer en rekenen minder af.",
      explanation: "Klanten vertrekken zelden omdat het aanbod niet klopt. Ze vertrekken omdat het net te veel moeite kost om tot een keuze te komen.\n\nDat voelt voor hen niet als een bewuste beslissing. Het gebeurt automatisch. Het brein kiest altijd de makkelijkste optie als iets voor hen onduidelijk is. En dat wordt dan: niets doen en weer naar buiten.\n\nDat is geen marketingprobleem en ook geen prijsprobleem. Het is een signaal dat beslissingen te veel bij de klant zelf worden neergelegd.",
      solution: "We brengen structuur en volgorde aan in het koopproces, waardoor afronden logischer voelt dan vertrekken."
    },
    {
      category: "C",
      categoryName: "Herkenning",
      categoryColor: "green",
      question: "Klanten maken regelmatig een volledige ronde door de winkel zonder zichtbaar richting een beslissing te bewegen.",
      linkedBlock: 1, // BLOK 1
      problem: "Beslissing komt niet op gang",
      problemDescription: "Klanten lopen een ronde, kijken, twijfelen en vertrekken zonder iets mee te nemen.",
      explanation: "Als klanten een hele ronde maken zonder echt ergens te blijven hangen, is dat meestal geen interesseprobleem. Het is een keuzestressprobleem.\n\nVeel ondernemers denken: ze willen gewoon even kijken. In de praktijk betekent het vaak: ze weten niet waar ze moeten stoppen om te beslissen.\n\nVroeger namen mensen daar de tijd voor. Nu niet meer. Als een winkel niet helpt bij dat beslismoment, loopt iemand letterlijk weer naar buiten zonder dat hij doorheeft waarom.",
      solution: "We analyseren het gedrag in de winkel en ontwerpen op basis daarvan smartzones die het koopproces optimaliseren."
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    if (
      formData.companyName &&
      formData.area &&
      formData.weeklyRevenue &&
      formData.q1 !== null &&
      formData.q2 !== null &&
      formData.q3 !== null &&
      formData.q4 !== null &&
      formData.q5 !== null &&
      formData.q6 !== null &&
      formData.q7 !== null &&
      formData.q8 !== null
    ) {
      calculateResults();
    } else {
      setResults(null);
    }
  }, [formData]);

  const calculateResults = () => {
    const answers = [formData.q1, formData.q2, formData.q3, formData.q4, formData.q5, formData.q6, formData.q7, formData.q8];
    const nietWaarCount = answers.filter((answer) => answer === false).length;

    let percentage = 0;
    if (nietWaarCount <= 2) percentage = 10;
    else if (nietWaarCount <= 5) percentage = 15;
    else percentage = 20;

    const weeklyRevenue = parseFloat(formData.weeklyRevenue);
    const area = parseFloat(formData.area);

    const yearlyRevenue = weeklyRevenue * 52;
    const revenuePerM2 = yearlyRevenue / area;
    const untappedRevenue = yearlyRevenue * (percentage / 100);
    const potentialRevenue = yearlyRevenue + untappedRevenue;

    // Get identified problems - only for questions with linkedBlock
    const identifiedProblems = answers.map((answer, index) => ({
      hasIssue: answer === false && questionsData[index].linkedBlock !== null,
      ...questionsData[index]
    })).filter(item => item.hasIssue);

    setResults({
      yearlyRevenue,
      revenuePerM2,
      untappedRevenue,
      potentialRevenue,
      percentage,
      nietWaarCount,
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
      companyName: "",
      area: "",
      weeklyRevenue: "",
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      q7: null,
      q8: null,
    });
    setResults(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("OG8", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Winkel Omzetanalyse Rapport", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 6;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text(formData.companyName, pageWidth / 2, yPosition, { align: "center" });
    doc.setTextColor(0, 0, 0);
    
    yPosition += 15;
    
    // Basisgegevens
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(219, 234, 254); // Light blue
    doc.rect(14, yPosition - 5, pageWidth - 28, 10, "F");
    doc.text("Basisgegevens", 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Bedrijf: ${formData.companyName}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Winkeloppervlakte: ${formData.area} m²`, 20, yPosition);
    yPosition += 7;
    doc.text(`Gemiddelde omzet per week: ${formatCurrency(parseFloat(formData.weeklyRevenue))}`, 20, yPosition);
    yPosition += 15;
    
    // Inzichtscan Antwoorden
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(219, 234, 254);
    doc.rect(14, yPosition - 5, pageWidth - 28, 10, "F");
    doc.text("Inzichtscan - Uw Antwoorden", 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const answers = [formData.q1, formData.q2, formData.q3, formData.q4, formData.q5, formData.q6, formData.q7, formData.q8];
    let currentCategory = "";
    
    questionsData.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Show category header
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        yPosition += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        
        const categoryEmojis = {
          yellow: "🟡",
          red: "🔴",
          green: "🟢"
        };
        doc.text(`${categoryEmojis[item.categoryColor]} Categorie ${item.category} - ${item.categoryName}`, 20, yPosition);
        yPosition += 7;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
      }
      
      const answer = answers[index] === true ? "Waar" : "Niet waar";
      const answerColor = answers[index] === true ? [16, 185, 129] : [249, 115, 22]; // Green or Orange
      
      doc.setFont("helvetica", "normal");
      doc.text(`${index + 1}. ${item.question}`, 20, yPosition, { maxWidth: pageWidth - 40 });
      
      const textHeight = doc.getTextDimensions(item.question, { maxWidth: pageWidth - 40 }).h;
      yPosition += textHeight + 2;
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...answerColor);
      doc.text(`   → ${answer}`, 20, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 7;
    });
    
    // New page for results
    doc.addPage();
    yPosition = 20;
    
    // Resultaten Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(219, 234, 254);
    doc.rect(14, yPosition - 5, pageWidth - 28, 10, "F");
    doc.text("Uw Resultaten", 20, yPosition);
    yPosition += 15;
    
    // Block A - Huidige situatie
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 85, 99);
    doc.text("📊 HUIDIGE SITUATIE", 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Jaaromzet: ${formatCurrency(results.yearlyRevenue)}`, 25, yPosition);
    yPosition += 7;
    doc.text(`Omzet per m² per jaar: ${formatCurrency(results.revenuePerM2)}`, 25, yPosition);
    yPosition += 12;
    
    // Block B - Structureel onbenut
    doc.setFont("helvetica", "bold");
    doc.setTextColor(217, 119, 6);
    doc.text("⚠️ STRUCTUREEL ONBENUT", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Bedrag dat jaarlijks blijft liggen: ${formatCurrency(results.untappedRevenue)}`, 25, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const explanationText = `Op basis van jouw antwoorden en benchmarks uit retailonderzoek blijft momenteel circa ${results.percentage}% van je omzet onbenut binnen de huidige winkelopzet.`;
    doc.text(explanationText, 25, yPosition, { maxWidth: pageWidth - 50 });
    yPosition += 12;
    
    // Block C - Na optimalisatie
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text("✨ NA OPTIMALISATIE", 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Potentiële jaaromzet na verbetering: ${formatCurrency(results.potentialRevenue)}`, 25, yPosition);
    yPosition += 15;
    
    // Problems & Solutions
    if (results.identifiedProblems.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(219, 234, 254);
      doc.rect(14, yPosition - 5, pageWidth - 28, 10, "F");
      doc.text("🔍 Waarom blijft dit geld liggen?", 20, yPosition);
      yPosition += 12;
      
      results.identifiedProblems.forEach((problem, index) => {
        // Check if we need a new page
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Problem header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(249, 115, 22);
        doc.text(`BLOK ${problem.linkedBlock}: ${problem.problem}`, 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(0, 0, 0);
        doc.text(`"${problem.problemDescription}"`, 25, yPosition, { maxWidth: pageWidth - 50 });
        yPosition += 7;
        
        // Hier lekt omzet weg
        doc.setFont("helvetica", "bold");
        doc.text("HIER LEKT OMZET WEG:", 25, yPosition);
        yPosition += 6;
        
        doc.setFont("helvetica", "normal");
        const explanationLines = doc.splitTextToSize(problem.explanation, pageWidth - 50);
        explanationLines.forEach(line => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
        
        // Oplossing
        doc.setFont("helvetica", "bold");
        doc.setTextColor(5, 150, 105);
        doc.text("💡 OPLOSSING:", 25, yPosition);
        yPosition += 6;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const solutionLines = doc.splitTextToSize(problem.solution, pageWidth - 50);
        solutionLines.forEach(line => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 10;
      });
    }
    
    // Footer on last page
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(`OG8 - Versie 1.0 | Pagina ${i} van ${totalPages}`, pageWidth / 2, 285, { align: "center" });
      doc.text(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')}`, pageWidth / 2, 290, { align: "center" });
    }
    
    // Save PDF with company name
    const sanitizedCompanyName = formData.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    doc.save(`Optimalisatie-analyse - ${sanitizedCompanyName}.pdf`);
  };

  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative mb-12 overflow-hidden">
            {/* Gradient Background - Fris Groen → Turquoise → Blauw */}
            <div className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 rounded-2xl shadow-xl p-12 text-center">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <h1 className="text-6xl font-bold text-white mb-3 tracking-tight" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif"}}>
                  OG8
                </h1>
                <p className="text-xl text-white/90 font-light mb-2" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif"}}>
                  Ontdek het potentieel van uw winkel
                </p>
                <div className="mt-4 pt-4 border-t border-white/30">
                  <p className="text-2xl font-semibold text-white tracking-wide" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif", letterSpacing: '0.05em'}}>
                    Optimalisatie-Analyse
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-md p-10 mb-8">
            {/* Input Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 mb-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 tracking-wide" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif", letterSpacing: '0.05em'}}>
                  Basisgegevens
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label
                    htmlFor="companyName"
                    className="block text-base font-semibold text-gray-700 mb-2"
                  >
                    Bedrijf
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    data-testid="company-name-input"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800 text-base"
                    placeholder="Bijv. Modewinkel De Stijl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="area"
                    className="block text-base font-semibold text-gray-700 mb-2"
                  >
                    Winkeloppervlakte (m²)
                  </label>
                  <input
                    id="area"
                    type="number"
                    data-testid="area-input"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800 text-base"
                    placeholder="Bijv. 150"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="weeklyRevenue"
                    className="block text-base font-semibold text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800 text-base"
                    placeholder="Bijv. 5000"
                  />
                </div>
              </div>
            </div>

            {/* Omzet-analyse / Inzichtscan */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 mb-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 tracking-wide" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif", letterSpacing: '0.05em'}}>
                  Inzichtscan
                </h2>
              </div>
              <p className="text-gray-600 mb-6 text-base">
                Beantwoord onderstaande vragen eerlijk voor een accurate analyse.
              </p>

              <div className="space-y-6">
                {questionsData.map((item, index) => {
                  const categoryColors = {
                    yellow: "bg-yellow-50 border-yellow-300",
                    red: "bg-red-50 border-red-300",
                    green: "bg-green-50 border-green-300"
                  };
                  const categoryEmojis = {
                    yellow: "🟡",
                    red: "🔴",
                    green: "🟢"
                  };

                  return (
                    <div key={index}>
                      {/* Show category header only for first question of each category */}
                      {(index === 0 || questionsData[index].category !== questionsData[index - 1].category) && (
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                            {categoryEmojis[item.categoryColor]} Categorie {item.category} – {item.categoryName}
                          </h3>
                        </div>
                      )}
                      
                      <div className={`border-2 rounded-xl p-5 ${categoryColors[item.categoryColor]}`}>
                        <p className="text-gray-800 mb-3 text-base font-medium">
                          {index + 1}. {item.question}
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleInputChange(`q${index + 1}`, true)}
                            data-testid={`question-${index + 1}-waar-btn`}
                            className={`flex-1 py-2.5 rounded-lg transition-all duration-200 font-semibold text-base ${
                              formData[`q${index + 1}`] === true
                                ? "bg-emerald-500 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-300"
                            }`}
                          >
                            Waar
                          </button>
                          <button
                            onClick={() => handleInputChange(`q${index + 1}`, false)}
                            data-testid={`question-${index + 1}-niet-waar-btn`}
                            className={`flex-1 py-2.5 rounded-lg transition-all duration-200 font-semibold text-base ${
                              formData[`q${index + 1}`] === false
                                ? "bg-orange-500 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:border-orange-300"
                            }`}
                          >
                            Niet waar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="space-y-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 tracking-wide" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif", letterSpacing: '0.05em'}}>
                    Jouw Resultaten
                  </h2>
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
                      <div className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg leading-relaxed">
                        Op basis van jouw antwoorden en benchmarks uit retailonderzoek blijft momenteel circa {results.percentage}% van je omzet onbenut binnen de huidige winkelopzet.
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
                      <h3 className="text-2xl font-semibold text-gray-800 tracking-wide flex items-center gap-2" style={{fontFamily: "'Inter', -apple-system, system-ui, sans-serif", letterSpacing: '0.05em'}}>
                        <span className="text-2xl">🔍</span>
                        Waarom blijft dit geld liggen?
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {results.identifiedProblems.map((problem, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                          <div className="flex items-start space-x-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-base">
                              {problem.linkedBlock}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-2 text-lg">
                                Probleem: {problem.problem}
                              </h4>
                              <p className="text-base text-gray-700 italic mb-2">
                                "{problem.problemDescription}"
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-400 mb-4">
                            <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                              Hier lekt omzet weg:
                            </h5>
                            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                              {problem.explanation}
                            </p>
                          </div>

                          <div className="bg-emerald-50 rounded-lg p-5 border-l-4 border-emerald-500">
                            <h5 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3">
                              💡 Oplossing:
                            </h5>
                            <p className="text-base text-gray-800 leading-relaxed">
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
                    <h3 className="text-lg font-bold text-emerald-800 mb-2">
                      🎉 Goede basis!
                    </h3>
                    <p className="text-base text-gray-700">
                      Je winkel heeft geen grote structurele problemen. Er is nog wel optimalisatiepotentieel van ongeveer {results.percentage}% door kleine verbeteringen in de flow en presentatie.
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4 pt-12">
                  <button
                    onClick={generatePDF}
                    data-testid="download-pdf-btn"
                    className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md text-base flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download als PDF
                  </button>
                  <button
                    onClick={resetCalculator}
                    data-testid="reset-calculator-btn"
                    className="px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200 font-semibold shadow-sm hover:shadow-md text-base"
                  >
                    Opnieuw berekenen
                  </button>
                </div>
              </div>
            )}

            {!results && (
              <div className="text-center py-8 text-gray-400 text-base">
                Vul alle velden in om je resultaten te zien
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-400 text-sm font-light">
              OG8 — Versie 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;