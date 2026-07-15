const specialties = [
  {
    specialty: "Gastroenterologist",
    arabicName: "أمراض الجهاز الهضمي والباطنة",
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
      "بطني",
      "معدة",
      "مغص",
      "هضم",
      "قيء",
      "ترجيع",
      "غثيان",
      "إسهال",
      "اسهال",
      "إمساك",
      "امساك",
    ],
  },

  {
    specialty: "Neurologist",
    arabicName: "المخ والأعصاب",
    keywords: [
      "headache",
      "migraine",
      "dizziness",
      "numbness",
      "nerve",
      "seizure",
      "صداع",
      "دوخة",
      "دوخه",
      "تنميل",
      "اعصاب",
      "أعصاب",
      "تشنج",
      "تشنجات",
    ],
  },

  {
    specialty: "Dermatologist",
    arabicName: "الأمراض الجلدية",
    keywords: [
      "skin",
      "rash",
      "itching",
      "acne",
      "hair loss",
      "جلد",
      "جلدية",
      "جلديه",
      "طفح",
      "حكة",
      "حكه",
      "حبوب",
      "تساقط الشعر",
    ],
  },

  {
    specialty: "Pediatricians",
    arabicName: "طب الأطفال",
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
    arabicName: "النساء والتوليد",
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
      "ولادة",
      "ولاده",
    ],
  },

  {
    specialty: "General physician",
    arabicName: "الطب العام",
    keywords: [
      "fever",
      "cold",
      "flu",
      "cough",
      "fatigue",
      "temperature",
      "حرارة",
      "حراره",
      "برد",
      "انفلونزا",
      "كحة",
      "كحه",
      "تعب",
      "سخونية",
      "سخونيه",
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
  "الم شديد في الصدر",
  "مش قادر اتنفس",
  "مش قادر أتنفس",
  "صعوبة في التنفس",
  "صعوبه في التنفس",
  "نزيف شديد",
  "فقدان الوعي",
];

const containsArabic = (text) => {
  return /[\u0600-\u06FF]/.test(text);
};

export const analyzeSymptoms = (symptoms) => {
  const text = symptoms.toLowerCase().trim();

  // Detect user language
  const language = containsArabic(text) ? "ar" : "en";

  // Check emergency symptoms
  const isEmergency = emergencyKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  if (isEmergency) {
    return {
      type: "emergency",
      language,
      message:
        language === "ar"
          ? "الأعراض التي وصفتها قد تحتاج إلى رعاية طبية عاجلة. يُرجى التوجه إلى أقرب قسم طوارئ أو طلب المساعدة الطبية فورًا."
          : "The symptoms you described may require urgent medical attention. Please seek emergency medical care immediately.",
    };
  }

  // Calculate score for each specialty
  const results = specialties.map((item) => {
    const score = item.keywords.filter((keyword) =>
      text.includes(keyword.toLowerCase())
    ).length;

    return {
      specialty: item.specialty,
      arabicName: item.arabicName,
      score,
    };
  });

  // Highest matching score first
  results.sort((a, b) => b.score - a.score);

  const bestMatch = results[0];

  // No clear match
  if (!bestMatch || bestMatch.score === 0) {
    return {
      type: "unknown",
      language,
      specialty: "General physician",
      arabicName: "الطب العام",

      message:
        language === "ar"
          ? "لم أتمكن من تحديد تخصص دقيق بناءً على الأعراض التي ذكرتها. يُفضل التوجه إلى طبيب عام لتقييم حالتك وتوجيهك إلى التخصص المناسب."
          : "I couldn't determine a specific specialty from your symptoms. A General Physician would be a good starting point.",
    };
  }

  return {
    type: "specialty",
    language,
    specialty: bestMatch.specialty,
    arabicName: bestMatch.arabicName,

    message:
      language === "ar"
        ? `بناءً على الأعراض التي وصفتها، أنصحك بالتوجه إلى قسم ${bestMatch.arabicName}. يمكنك الضغط على الزر بالأسفل لعرض الأطباء المتاحين في هذا التخصص.`
        : `Based on the symptoms you described, I recommend visiting the ${bestMatch.specialty} department. You can use the button below to view available doctors in this specialty.`,
  };
};