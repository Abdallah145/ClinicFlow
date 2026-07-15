const specialties = [
  {
    specialty: "Gastroenterologist",
    keywords: [
      "stomach",
      "abdominal",
      "abdomen",
      "digestion",
      "indigestion",
      "vomiting",
      "nausea",
      "diarrhea",
      "constipation",
      "بطن",
      "معدة",
      "مغص",
      "هضم",
      "قيء",
      "ترجيع",
      "غثيان",
      "إسهال",
      "امساك",
      "إمساك",
    ],
  },

  {
    specialty: "Neurologist",
    keywords: [
      "headache",
      "migraine",
      "dizziness",
      "numbness",
      "nerve",
      "seizure",
      "صداع",
      "دوخة",
      "تنميل",
      "اعصاب",
      "أعصاب",
      "تشنج",
    ],
  },

  {
    specialty: "Dermatologist",
    keywords: [
      "skin",
      "rash",
      "itching",
      "acne",
      "hair loss",
      "جلد",
      "طفح",
      "حكة",
      "حبوب",
      "تساقط الشعر",
    ],
  },

  {
    specialty: "Pediatricians",
    keywords: [
      "child",
      "children",
      "baby",
      "infant",
      "kid",
      "طفل",
      "اطفال",
      "أطفال",
      "رضيع",
      "بيبي",
    ],
  },

  {
    specialty: "Gynecologist",
    keywords: [
      "pregnancy",
      "pregnant",
      "period",
      "menstrual",
      "women",
      "حمل",
      "حامل",
      "دورة",
      "الدورة الشهرية",
      "نساء",
    ],
  },

  {
    specialty: "General physician",
    keywords: [
      "fever",
      "cold",
      "flu",
      "cough",
      "fatigue",
      "temperature",
      "حرارة",
      "برد",
      "انفلونزا",
      "كحة",
      "تعب",
      "سخونية",
    ],
  },
];

const emergencyKeywords = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "difficulty breathing",
  "unconscious",
  "severe bleeding",
  "ألم شديد في الصدر",
  "مش قادر اتنفس",
  "مش قادر أتنفس",
  "صعوبة في التنفس",
  "نزيف شديد",
  "فقدان الوعي",
];

export const analyzeSymptoms = (symptoms) => {
  const text = symptoms.toLowerCase().trim();

  // Emergency check
  const isEmergency = emergencyKeywords.some((keyword) =>
    text.includes(keyword)
  );

  if (isEmergency) {
    return {
      type: "emergency",
      message:
        "Your symptoms may require urgent medical attention. Please seek emergency medical care immediately.",
    };
  }

  // Calculate score for every specialty
  const results = specialties.map((item) => {
    const score = item.keywords.filter((keyword) =>
      text.includes(keyword)
    ).length;

    return {
      specialty: item.specialty,
      score,
    };
  });

  // Sort by highest score
  results.sort((a, b) => b.score - a.score);

  const bestMatch = results[0];

  // No matching symptoms
  if (!bestMatch || bestMatch.score === 0) {
    return {
      type: "unknown",
      specialty: "General physician",
      message:
        "I couldn't determine a specific specialty from your symptoms. A General Physician would be a good starting point.",
    };
  }

  return {
    type: "specialty",
    specialty: bestMatch.specialty,
    message: `Based on the symptoms you described, the suggested specialty is ${bestMatch.specialty}.`,
  };
};