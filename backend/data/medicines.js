// Comprehensive Indian medicines dataset with brand names, generic salts,
// Jan Aushadhi generic substitutes, safety profiles, and cost comparisons.

const medicines = [
  {
    id: "med-1",
    name: "Augmentin 625 Duo Tablet",
    genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    brand: "Augmentin",
    category: "Antibiotics",
    manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 10 tablets",
    mrp: 223.50,
    price: 189.90,
    requiresPrescription: true,
    rating: 4.7,
    reviewsCount: 3820,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    description: "Augmentin 625 Duo Tablet is a penicillin-type antibiotic that helps fight bacterial infections of the respiratory tract, ear, nose, throat, urinary tract, and skin.",
    uses: [
      "Bacterial infections of throat and tonsils",
      "Lower respiratory tract infections (Bronchitis, Pneumonia)",
      "Urinary tract infections (UTI)",
      "Skin and soft tissue infections",
      "Dental infections"
    ],
    sideEffects: [
      "Nausea and mild diarrhea",
      "Vomiting",
      "Stomach upset",
      "Skin rashes (rare)"
    ],
    safetyAdvice: {
      alcohol: "Avoid alcohol consumption during the antibiotic course as it may increase dizziness.",
      pregnancy: "Generally considered safe under doctor's guidance.",
      breastfeeding: "Safe if prescribed; minimal amounts pass into breast milk.",
      driving: "May cause dizziness in rare cases; refrain from driving if dizzy.",
      kidney: "Dose adjustment required for patients with severe kidney impairment.",
      liver: "Use with caution in patients with active liver diseases."
    },
    howToUse: "Take this medicine in the dose and duration as advised by your doctor. Swallow it as a whole with food to avoid stomach upset.",
    genericSubstitute: {
      name: "Amoxycillin & Pot. Clavulanate 625mg (Jan Aushadhi)",
      genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
      manufacturer: "PMBJP (Pradhan Mantri Bhartiya Janaushadhi)",
      packSize: "Strip of 10 tablets",
      price: 58.00,
      mrp: 65.00,
      savingsPercent: 74,
      qualityStandard: "WHO-GMP Certified, IP Standard",
      verified: true
    },
    inStock: true,
    tags: ["antibiotic", "infection", "amoxicillin", "clavulanate", "fever", "chest"]
  },
  {
    id: "med-2",
    name: "Dolo 650 Tablet",
    genericName: "Paracetamol / Acetaminophen (650mg)",
    brand: "Dolo",
    category: "Pain Relief & Fever",
    manufacturer: "Micro Labs Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 15 tablets",
    mrp: 34.00,
    price: 30.50,
    requiresPrescription: false,
    rating: 4.8,
    reviewsCount: 14200,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60",
    description: "Dolo 650 is a widely trusted analgesic and antipyretic medicine used to relieve mild-to-moderate pain and reduce fever rapidly.",
    uses: [
      "High body temperature (Fever)",
      "Headache and migraine",
      "Body aches and joint pain",
      "Post-vaccination fever",
      "Dental pain and toothache"
    ],
    sideEffects: [
      "Extremely safe at recommended doses",
      "Nausea (very rare)",
      "Liver toxicity (only on heavy overdose >4g/day)"
    ],
    safetyAdvice: {
      alcohol: "Avoid excessive alcohol as it increases risk of liver damage when combined with paracetamol.",
      pregnancy: "Safe during all trimesters of pregnancy at therapeutic doses.",
      breastfeeding: "Completely safe during lactation.",
      driving: "Does not cause sedation or impaired concentration.",
      kidney: "Safe for short duration; monitor if chronic kidney condition exists.",
      liver: "Consult doctor before use if you have cirrhosis or pre-existing liver disorder."
    },
    howToUse: "Take 1 tablet every 6 to 8 hours as needed. Do not exceed 4 tablets in 24 hours. Can be taken with or without food.",
    genericSubstitute: {
      name: "Paracetamol Tablets IP 650mg (Jan Aushadhi)",
      genericName: "Paracetamol (650mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 9.50,
      mrp: 12.00,
      savingsPercent: 72,
      qualityStandard: "Indian Pharmacopoeia (IP) Certified",
      verified: true
    },
    inStock: true,
    tags: ["paracetamol", "fever", "headache", "dolo", "crocin", "pain", "otc"]
  },
  {
    id: "med-3",
    name: "Pantocid 40mg Tablet",
    genericName: "Pantoprazole (40mg)",
    brand: "Pantocid",
    category: "Acidity & Digestion",
    manufacturer: "Sun Pharmaceutical Industries Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 15 tablets",
    mrp: 178.50,
    price: 151.70,
    requiresPrescription: true,
    rating: 4.6,
    reviewsCount: 2950,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
    description: "Pantocid 40 is a proton pump inhibitor (PPI) that reduces the amount of acid produced in the stomach, treating acid reflux and peptic ulcer disease.",
    uses: [
      "Gastroesophageal reflux disease (GERD / Acid Reflux)",
      "Peptic ulcer healing and prevention",
      "Heartburn and chest burning sensation",
      "Stomach protection against painkiller-induced ulcers"
    ],
    sideEffects: [
      "Headache",
      "Flatulence / Gas",
      "Mild stomach cramps",
      "Diarrhea or constipation"
    ],
    safetyAdvice: {
      alcohol: "Alcohol stimulates stomach acid production, counteracting medication benefits.",
      pregnancy: "Consult doctor; usually prescribed when benefits outweigh risks.",
      breastfeeding: "Safe under medical supervision.",
      driving: "Safe; does not affect driving ability.",
      kidney: "Safe at standard dosages.",
      liver: "Dose reduction might be advised for chronic liver disease."
    },
    howToUse: "Best taken in the morning 30 to 60 minutes before breakfast with a glass of water.",
    genericSubstitute: {
      name: "Pantoprazole Gastro-Resistant Tablets IP 40mg",
      genericName: "Pantoprazole (40mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 24.00,
      mrp: 30.00,
      savingsPercent: 86,
      qualityStandard: "WHO-GMP Certified, USP/IP Grade",
      verified: true
    },
    inStock: true,
    tags: ["acidity", "gas", "gerd", "stomach", "pantoprazole", "digestion", "heartburn"]
  },
  {
    id: "med-4",
    name: "Pan-D Capsule",
    genericName: "Pantoprazole (40mg) + Domperidone (30mg SR)",
    brand: "Pan-D",
    category: "Acidity & Digestion",
    manufacturer: "Alkem Laboratories Ltd",
    dosageForm: "Capsule",
    packSize: "Strip of 15 capsules",
    mrp: 232.00,
    price: 197.20,
    requiresPrescription: true,
    rating: 4.7,
    reviewsCount: 5100,
    image: "https://images.unsplash.com/photo-1550572017-ed21f6631ad0?w=500&auto=format&fit=crop&q=60",
    description: "Pan-D Capsule combines an acid reducer (Pantoprazole) with a prokinetic agent (Domperidone) that speeds gastric emptying, treating acid reflux with nausea.",
    uses: [
      "Acid reflux with nausea or vomiting",
      "Severe indigestion and fullness feeling",
      "Gastritis and stomach ulcers"
    ],
    sideEffects: [
      "Dryness in mouth",
      "Dizziness or light headache",
      "Stomach rumble"
    ],
    safetyAdvice: {
      alcohol: "Avoid alcohol as it aggravates reflux symptoms.",
      pregnancy: "Not recommended unless strictly prescribed by gynecologist.",
      breastfeeding: "Domperidone passes into breast milk; medical supervision needed.",
      driving: "May cause mild drowsiness in some individuals.",
      kidney: "Safe; monitor if taking long term.",
      liver: "Caution in severe hepatic impairment."
    },
    howToUse: "Swallow whole capsule 30 minutes before first meal of the day. Do not chew or crush.",
    genericSubstitute: {
      name: "Pantoprazole & Domperidone SR Capsules",
      genericName: "Pantoprazole (40mg) + Domperidone (30mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 capsules",
      price: 36.00,
      mrp: 45.00,
      savingsPercent: 84,
      qualityStandard: "WHO-GMP Certified",
      verified: true
    },
    inStock: true,
    tags: ["pan-d", "acidity", "nausea", "vomiting", "gas", "indigestion"]
  },
  {
    id: "med-5",
    name: "Janumet 50mg/500mg Tablet",
    genericName: "Sitagliptin (50mg) + Metformin Hydrochloride (500mg)",
    brand: "Janumet",
    category: "Diabetes",
    manufacturer: "MSD Pharmaceuticals Pvt Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 15 tablets",
    mrp: 385.00,
    price: 327.25,
    requiresPrescription: true,
    rating: 4.8,
    reviewsCount: 2100,
    image: "https://images.unsplash.com/photo-1576073719676-aa955fc1bda9?w=500&auto=format&fit=crop&q=60",
    description: "Janumet combines Sitagliptin (DPP-4 inhibitor) and Metformin (biguanide) to effectively control blood glucose levels in adults with Type 2 Diabetes.",
    uses: [
      "Type 2 Diabetes Mellitus glycemic control",
      "Reduction of HbA1c levels",
      "Prevention of diabetic complications (kidney, eye, nerve damage)"
    ],
    sideEffects: [
      "Mild metallic taste",
      "Nausea or stomach discomfort during initial days",
      "Hypoglycemia (low blood sugar, mainly if skipping meals)"
    ],
    safetyAdvice: {
      alcohol: "High risk of lactic acidosis when combined with heavy alcohol.",
      pregnancy: "Insulin is preferred during pregnancy; discuss with doctor.",
      breastfeeding: "Consult physician before use.",
      driving: "Carry glucose sweets while driving in case of low blood sugar.",
      kidney: "Regular kidney function tests (eGFR) required.",
      liver: "Avoid in severe liver dysfunction."
    },
    howToUse: "Take with meals twice daily to reduce gastrointestinal irritation.",
    genericSubstitute: {
      name: "Sitagliptin 50mg + Metformin 500mg Tablets (Generic)",
      genericName: "Sitagliptin (50mg) + Metformin (500mg)",
      manufacturer: "Cipla / Jan Aushadhi",
      packSize: "Strip of 15 tablets",
      price: 110.00,
      mrp: 140.00,
      savingsPercent: 71,
      qualityStandard: "IP/BP Certified, USFDA approved plant",
      verified: true
    },
    inStock: true,
    tags: ["diabetes", "sugar", "metformin", "sitagliptin", "janumet", "hba1c"]
  },
  {
    id: "med-6",
    name: "Glycomet-GP 1 Tablet",
    genericName: "Glimepiride (1mg) + Metformin (500mg PR)",
    brand: "Glycomet-GP",
    category: "Diabetes",
    manufacturer: "USV Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 15 tablets",
    mrp: 138.00,
    price: 117.30,
    requiresPrescription: true,
    rating: 4.6,
    reviewsCount: 3400,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    description: "Glycomet-GP 1 is a dual-action oral anti-diabetic medication that enhances insulin secretion from pancreas and improves body's insulin sensitivity.",
    uses: [
      "Type 2 Diabetes Mellitus with uncontrolled fasting sugars",
      "Post-prandial blood sugar control"
    ],
    sideEffects: [
      "Hypoglycemia (sweating, trembling, hunger)",
      "Digestive upset",
      "Taste changes"
    ],
    safetyAdvice: {
      alcohol: "Avoid alcohol; strongly predisposes to sudden hypoglycemia.",
      pregnancy: "Not recommended; insulin therapy is standard.",
      breastfeeding: "Consult doctor before use.",
      driving: "Ensure blood glucose is stable before driving.",
      kidney: "Contraindicated in severe renal impairment.",
      liver: "Monitor liver enzymes periodically."
    },
    howToUse: "Take once daily with your primary morning meal / breakfast.",
    genericSubstitute: {
      name: "Glimepiride 1mg + Metformin 500mg SR Tablets",
      genericName: "Glimepiride (1mg) + Metformin (500mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 14.50,
      mrp: 18.00,
      savingsPercent: 89,
      qualityStandard: "WHO-GMP Certified",
      verified: true
    },
    inStock: true,
    tags: ["diabetes", "sugar", "glimepiride", "metformin", "glycomet"]
  },
  {
    id: "med-7",
    name: "Telma 40mg Tablet",
    genericName: "Telmisartan (40mg)",
    brand: "Telma",
    category: "Cardiac & BP",
    manufacturer: "Glenmark Pharmaceuticals Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 30 tablets",
    mrp: 295.00,
    price: 250.75,
    requiresPrescription: true,
    rating: 4.8,
    reviewsCount: 4120,
    image: "https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=500&auto=format&fit=crop&q=60",
    description: "Telma 40 is an Angiotensin Receptor Blocker (ARB) prescribed to treat high blood pressure (hypertension) and lower cardiovascular risk like heart attack and stroke.",
    uses: [
      "Hypertension (High Blood Pressure)",
      "Cardiovascular risk reduction in diabetic and heart patients",
      "Kidney protection in diabetic nephropathy"
    ],
    sideEffects: [
      "Dizziness or lightheadedness when standing",
      "Back pain or muscle cramps (infrequent)",
      "Slight elevation in serum potassium"
    ],
    safetyAdvice: {
      alcohol: "Alcohol can cause sudden drop in blood pressure, leading to fainting.",
      pregnancy: "Strictly contraindicated during 2nd and 3rd trimesters (harmful to fetus).",
      breastfeeding: "Alternative anti-hypertensive preferred.",
      driving: "Be mindful of dizziness when initiating therapy.",
      kidney: "Dose check required; avoid potassium supplements unless monitored.",
      liver: "Use with caution in biliary obstructive disorders."
    },
    howToUse: "Take once daily at the same time each day, with or without food.",
    genericSubstitute: {
      name: "Telmisartan Tablets IP 40mg (Jan Aushadhi)",
      genericName: "Telmisartan (40mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 18.00,
      mrp: 22.00,
      savingsPercent: 82,
      qualityStandard: "Indian Pharmacopoeia (IP) Certified",
      verified: true
    },
    inStock: true,
    tags: ["bp", "hypertension", "telmisartan", "telma", "heart", "cardiac"]
  },
  {
    id: "med-8",
    name: "Atorva 10mg Tablet",
    genericName: "Atorvastatin (10mg)",
    brand: "Atorva",
    category: "Cholesterol & Heart",
    manufacturer: "Zydus Lifesciences Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 15 tablets",
    mrp: 132.50,
    price: 112.60,
    requiresPrescription: true,
    rating: 4.7,
    reviewsCount: 1890,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    description: "Atorva 10 contains Atorvastatin, an HMG-CoA reductase inhibitor (statin) that lowers bad cholesterol (LDL) and triglycerides while raising good cholesterol (HDL).",
    uses: [
      "High cholesterol (Hyperlipidemia)",
      "Prevention of atherosclerosis (plaque buildup in arteries)",
      "Reducing risk of heart attack and stroke"
    ],
    sideEffects: [
      "Mild muscle ache",
      "Digestive discomfort",
      "Elevated liver enzymes (rare)"
    ],
    safetyAdvice: {
      alcohol: "Excessive alcohol consumption increases muscle and liver risks.",
      pregnancy: "Strictly contraindicated in pregnancy.",
      breastfeeding: "Not recommended.",
      driving: "Safe; does not impact motor skills.",
      kidney: "Safe; no dose adjustment needed.",
      liver: "Do not use if suffering from active liver cirrhosis."
    },
    howToUse: "Take 1 tablet daily, preferably at bedtime as cholesterol synthesis peaks at night.",
    genericSubstitute: {
      name: "Atorvastatin Tablets IP 10mg",
      genericName: "Atorvastatin (10mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 11.00,
      mrp: 14.00,
      savingsPercent: 88,
      qualityStandard: "WHO-GMP Certified, IP Standard",
      verified: true
    },
    inStock: true,
    tags: ["cholesterol", "statin", "heart", "atorvastatin", "atorva", "cardiac", "ldl"]
  },
  {
    id: "med-9",
    name: "Allegra 120mg Tablet",
    genericName: "Fexofenadine Hydrochloride (120mg)",
    brand: "Allegra",
    category: "Allergy & Respiratory",
    manufacturer: "Sanofi India Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 10 tablets",
    mrp: 236.00,
    price: 200.60,
    requiresPrescription: false,
    rating: 4.7,
    reviewsCount: 3200,
    image: "https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=500&auto=format&fit=crop&q=60",
    description: "Allegra 120 is a non-drowsy second-generation antihistamine used to relieve seasonal allergic rhinitis, sneezing, runny nose, and allergic skin hives.",
    uses: [
      "Allergic Rhinitis (sneezing, runny nose, itchy watery eyes)",
      "Chronic idiopathic urticaria (allergic skin hives, redness, itching)",
      "Pollen and dust allergies"
    ],
    sideEffects: [
      "Minimal drowsiness compared to first-gen antihistamines",
      "Mild headache",
      "Dry throat"
    ],
    safetyAdvice: {
      alcohol: "Avoid alcohol as it may slightly increase sedation.",
      pregnancy: "Use only if advised by doctor.",
      breastfeeding: "Safe under medical advice.",
      driving: "Usually non-drowsy, but test individual response before highway driving.",
      kidney: "Dose reduction advised in severe renal issues.",
      liver: "Safe; predominantly excreted unchanged."
    },
    howToUse: "Take 1 tablet daily with a full glass of water. Avoid taking with fruit juices (grapefruit/apple) as they reduce absorption.",
    genericSubstitute: {
      name: "Fexofenadine Tablets IP 120mg",
      genericName: "Fexofenadine (120mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 32.00,
      mrp: 40.00,
      savingsPercent: 86,
      qualityStandard: "IP/BP Certified",
      verified: true
    },
    inStock: true,
    tags: ["allergy", "sneezing", "fexofenadine", "allegra", "cold", "hives", "antihistamine"]
  },
  {
    id: "med-10",
    name: "Montair-LC Tablet",
    genericName: "Montelukast (10mg) + Levocetirizine (5mg)",
    brand: "Montair-LC",
    category: "Allergy & Respiratory",
    manufacturer: "Cipla Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 10 tablets",
    mrp: 185.00,
    price: 157.25,
    requiresPrescription: true,
    rating: 4.8,
    reviewsCount: 4600,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
    description: "Montair-LC combines a leukotriene receptor antagonist (Montelukast) with an antihistamine (Levocetirizine) to relieve allergy symptoms and allergic asthma.",
    uses: [
      "Allergic Rhinitis with bronchial irritation",
      "Persistent sneezing and nighttime nasal blockage",
      "Skin allergies and eczema itching"
    ],
    sideEffects: [
      "Mild sleepiness / sedation",
      "Fatigue",
      "Dry mouth"
    ],
    safetyAdvice: {
      alcohol: "Avoid alcohol as it markedly amplifies sedation.",
      pregnancy: "Consult doctor.",
      breastfeeding: "Use with caution.",
      driving: "May induce drowsiness; do not drive immediately after taking.",
      kidney: "Dose adjustment for renal impairment.",
      liver: "Safe at standard prescribed doses."
    },
    howToUse: "Take 1 tablet at bedtime, as it can cause drowsiness.",
    genericSubstitute: {
      name: "Montelukast 10mg + Levocetirizine 5mg Tablets",
      genericName: "Montelukast (10mg) + Levocetirizine (5mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 28.00,
      mrp: 35.00,
      savingsPercent: 85,
      qualityStandard: "WHO-GMP Certified",
      verified: true
    },
    inStock: true,
    tags: ["cough", "allergy", "montair", "levocetirizine", "montelukast", "asthma", "cold"]
  },
  {
    id: "med-11",
    name: "Shelcal 500 Tablet",
    genericName: "Calcium Carbonate (1250mg eq. to Elemental Calcium 500mg) + Vitamin D3 (250 IU)",
    brand: "Shelcal",
    category: "Vitamins & Supplements",
    manufacturer: "Torrent Pharmaceuticals Ltd",
    dosageForm: "Tablet",
    packSize: "Bottle of 15 tablets",
    mrp: 144.50,
    price: 122.80,
    requiresPrescription: false,
    rating: 4.8,
    reviewsCount: 5800,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60",
    description: "Shelcal 500 is a premium calcium and vitamin D3 supplement essential for maintaining strong bones, teeth, and muscle function.",
    uses: [
      "Osteoporosis and bone weakness",
      "Calcium deficiency during pregnancy and lactation",
      "Post-menopausal bone health",
      "Joint and muscular support in seniors"
    ],
    sideEffects: [
      "Mild constipation if water intake is low",
      "Stomach bloating"
    ],
    safetyAdvice: {
      alcohol: "Safe.",
      pregnancy: "Frequently recommended during pregnancy under physician guidance.",
      breastfeeding: "Safe and beneficial.",
      driving: "Safe.",
      kidney: "Check serum calcium levels if history of kidney stones.",
      liver: "Safe."
    },
    howToUse: "Take 1 tablet daily after lunch or dinner with plenty of water.",
    genericSubstitute: {
      name: "Calcium & Vitamin D3 Tablets IP (Jan Aushadhi)",
      genericName: "Calcium (500mg) + Vitamin D3 (250 IU)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 10 tablets",
      price: 12.00,
      mrp: 15.00,
      savingsPercent: 90,
      qualityStandard: "IP Grade, Certified",
      verified: true
    },
    inStock: true,
    tags: ["calcium", "vitamin d3", "bones", "shelcal", "supplement", "osteoporosis"]
  },
  {
    id: "med-12",
    name: "Becosules Capsules",
    genericName: "Vitamin B-Complex (B1, B2, B6, B12, Niacinamide, Calcium Pantothenate, Folic Acid) + Vitamin C",
    brand: "Becosules",
    category: "Vitamins & Supplements",
    manufacturer: "Pfizer Ltd",
    dosageForm: "Capsule",
    packSize: "Strip of 20 capsules",
    mrp: 58.00,
    price: 49.30,
    requiresPrescription: false,
    rating: 4.9,
    reviewsCount: 9200,
    image: "https://images.unsplash.com/photo-1550572017-ed21f6631ad0?w=500&auto=format&fit=crop&q=60",
    description: "Becosules is an iconic multi-vitamin formulation that treats mouth ulcers, improves vitality, boosts immune defense, and promotes healthy skin and hair.",
    uses: [
      "Mouth ulcers and tongue sores (aphthous ulcers)",
      "Vitamin B-complex deficiency and weakness",
      "Immune support post illness or antibiotic courses",
      "Nerve nourishment"
    ],
    sideEffects: [
      "Bright yellow discoloration of urine (completely harmless, due to Vitamin B2 Riboflavin)",
      "Mild stomach fullness"
    ],
    safetyAdvice: {
      alcohol: "Safe; alcohol depletes vitamin B, making supplementation necessary.",
      pregnancy: "Safe under medical supervision.",
      breastfeeding: "Safe and commonly prescribed.",
      driving: "Safe.",
      kidney: "Safe; excess water-soluble vitamins excreted.",
      liver: "Safe."
    },
    howToUse: "Take 1 capsule once daily after meals.",
    genericSubstitute: {
      name: "Vitamin B-Complex with Vitamin C Capsules IP",
      genericName: "B-Complex + Vitamin C",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 20 capsules",
      price: 14.00,
      mrp: 18.00,
      savingsPercent: 76,
      qualityStandard: "IP/BP Standard",
      verified: true
    },
    inStock: true,
    tags: ["mouth ulcer", "vitamin b", "becosules", "immunity", "energy", "otc"]
  },
  {
    id: "med-13",
    name: "Thyronorm 50mcg Tablet",
    genericName: "Thyroxine Sodium / Levothyroxine (50mcg)",
    brand: "Thyronorm",
    category: "Thyroid & Hormones",
    manufacturer: "Abbott Healthcare Pvt Ltd",
    dosageForm: "Tablet",
    packSize: "Bottle of 120 tablets",
    mrp: 232.00,
    price: 197.20,
    requiresPrescription: true,
    rating: 4.8,
    reviewsCount: 3900,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    description: "Thyronorm 50 is a synthetic thyroid hormone identical to the natural hormone produced by the thyroid gland, used to treat hypothyroidism (underactive thyroid).",
    uses: [
      "Hypothyroidism (fatigue, weight gain, cold intolerance)",
      "Goiter management",
      "Thyroid replacement therapy post surgery"
    ],
    sideEffects: [
      "Overdose may cause palpitations, nervousness, weight loss, sweating",
      "Well-tolerated at appropriate calibrated dose"
    ],
    safetyAdvice: {
      alcohol: "Safe in moderation.",
      pregnancy: "Crucial to continue and often increase dose during pregnancy to support fetal brain development.",
      breastfeeding: "Safe; minimal amounts excreted.",
      driving: "Safe.",
      kidney: "Safe.",
      liver: "Safe."
    },
    howToUse: "Take early in the morning on an empty stomach with plain water, at least 30 to 45 minutes before tea, coffee, or breakfast.",
    genericSubstitute: {
      name: "Levothyroxine Sodium Tablets IP 50mcg",
      genericName: "Thyroxine (50mcg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Bottle of 100 tablets",
      price: 52.00,
      mrp: 65.00,
      savingsPercent: 78,
      qualityStandard: "Indian Pharmacopoeia (IP) Certified",
      verified: true
    },
    inStock: true,
    tags: ["thyroid", "thyronorm", "levothyroxine", "hypothyroid", "tsh", "hormone"]
  },
  {
    id: "med-14",
    name: "Azithral 500 Tablet",
    genericName: "Azithromycin (500mg)",
    brand: "Azithral",
    category: "Antibiotics",
    manufacturer: "Alembic Pharmaceuticals Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 5 tablets",
    mrp: 135.00,
    price: 114.75,
    requiresPrescription: true,
    rating: 4.6,
    reviewsCount: 2750,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
    description: "Azithral 500 is a macrolide antibiotic that stops bacterial growth, commonly prescribed for respiratory, throat, ear, and genital infections.",
    uses: [
      "Tonsillitis, pharyngitis, and sinusitis",
      "Community acquired pneumonia",
      "Skin and soft tissue bacterial infections",
      "Typhoid and traveler's diarrhea"
    ],
    sideEffects: [
      "Nausea and diarrhea",
      "Abdominal pain",
      "Altered taste"
    ],
    safetyAdvice: {
      alcohol: "Avoid alcohol to prevent stomach irritation.",
      pregnancy: "Safe under doctor's guidance.",
      breastfeeding: "Safe if prescribed.",
      driving: "Safe unless experiencing dizziness.",
      kidney: "Safe at usual doses.",
      liver: "Use caution in severe liver diseases as azithromycin is eliminated through bile."
    },
    howToUse: "Take once daily 1 hour before or 2 hours after food, as food may alter absorption.",
    genericSubstitute: {
      name: "Azithromycin Tablets IP 500mg",
      genericName: "Azithromycin (500mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 3 tablets",
      price: 24.50,
      mrp: 30.00,
      savingsPercent: 82,
      qualityStandard: "WHO-GMP Certified",
      verified: true
    },
    inStock: true,
    tags: ["antibiotic", "throat", "cough", "infection", "azithromycin", "azithral", "fever"]
  },
  {
    id: "med-15",
    name: "Volini Pain Relief Gel",
    genericName: "Diclofenac Diethylamine (1.16% w/w) + Methyl Salicylate + Menthol + Linseed Oil",
    brand: "Volini",
    category: "Pain Relief & Muscle",
    manufacturer: "Sun Pharmaceutical Industries Ltd",
    dosageForm: "Gel / Ointment",
    packSize: "Tube of 75g",
    mrp: 275.00,
    price: 233.75,
    requiresPrescription: false,
    rating: 4.8,
    reviewsCount: 8100,
    image: "https://images.unsplash.com/photo-1550572017-ed21f6631ad0?w=500&auto=format&fit=crop&q=60",
    description: "Volini Gel provides quick, deep-penetrating relief from joint pain, backache, neck shoulder stiffness, sprains, and sports injuries.",
    uses: [
      "Lower back pain and sciatica stiffness",
      "Knee joint and osteoarthritis pain",
      "Sprains, strains, and muscular soreness",
      "Neck and shoulder stiffness from desk work"
    ],
    sideEffects: [
      "Mild skin tingling or warmth at application site",
      "Skin redness in rare sensitive skin cases"
    ],
    safetyAdvice: {
      alcohol: "Safe (topical application).",
      pregnancy: "Safe for small localized areas; avoid large surface application in 3rd trimester.",
      breastfeeding: "Safe; do not apply near breast area.",
      driving: "Safe.",
      kidney: "Safe for topical use.",
      liver: "Safe."
    },
    howToUse: "Gently apply a thin layer onto the affected area 3 to 4 times a day. Do not rub vigorously. Wash hands after application.",
    genericSubstitute: {
      name: "Diclofenac Gel IP with Linseed Oil & Menthol",
      genericName: "Diclofenac + Menthol + Methyl Salicylate",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Tube of 50g",
      price: 25.00,
      mrp: 32.00,
      savingsPercent: 89,
      qualityStandard: "IP Standard",
      verified: true
    },
    inStock: true,
    tags: ["pain", "backache", "volini", "gel", "diclofenac", "joint pain", "muscle"]
  },
  {
    id: "med-16",
    name: "Ecosprin 75 Tablet",
    genericName: "Aspirin / Acetylsalicylic Acid (75mg gastro-resistant)",
    brand: "Ecosprin",
    category: "Cardiac & Blood Thinners",
    manufacturer: "USV Ltd",
    dosageForm: "Tablet",
    packSize: "Strip of 14 tablets",
    mrp: 6.20,
    price: 5.40,
    requiresPrescription: true,
    rating: 4.9,
    reviewsCount: 11400,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60",
    description: "Ecosprin 75 is an antiplatelet agent (blood thinner) that prevents blood clots from forming inside blood vessels, reducing heart attack and stroke risk.",
    uses: [
      "Prevention of heart attack in high-risk individuals",
      "Prevention of ischemic stroke and transient ischemic attacks (TIA)",
      "Post-stent cardiac maintenance therapy"
    ],
    sideEffects: [
      "Increased bleeding tendency (bruising, minor cuts take longer to stop)",
      "Mild heartburn or dyspepsia"
    ],
    safetyAdvice: {
      alcohol: "Avoid heavy alcohol as it increases risk of stomach bleeding.",
      pregnancy: "Use only under strict obstetrical guidance.",
      breastfeeding: "Consult doctor.",
      driving: "Safe.",
      kidney: "Caution in severe renal impairment.",
      liver: "Avoid in severe liver failure."
    },
    howToUse: "Take once daily with meals to protect stomach lining. Swallow whole; do not crush enteric-coated tablet.",
    genericSubstitute: {
      name: "Aspirin Gastro-Resistant Tablets IP 75mg",
      genericName: "Aspirin (75mg)",
      manufacturer: "PMBJP Jan Aushadhi",
      packSize: "Strip of 14 tablets",
      price: 3.50,
      mrp: 4.50,
      savingsPercent: 44,
      qualityStandard: "IP Certified",
      verified: true
    },
    inStock: true,
    tags: ["aspirin", "blood thinner", "heart", "ecosprin", "cardiac", "stroke"]
  }
];

module.exports = medicines;
