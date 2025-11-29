import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveItem } from "../api/asyncStorage";

export const seedDatabase = async () => {
  // CLEAR ALL OLD DATA FIRST
  console.log("🗑️ Clearing old data...");
  await AsyncStorage.clear();
  console.log("✅ Old data cleared!");
  
  // Sample Users
  const users = [
    {
      id: "u001",
      role: "patient",
      name: "Jean Martin",
      email: "patient@test.com",
      password: "patient123",
    },
    {
      id: "u002",
      role: "pharmacien",
      name: "Marie Dubois",
      email: "pharmacien@test.com",
      password: "pharma123",
    },
    {
      id: "u003",
      role: "medecin",
      name: "Dr. Pierre Durant",
      email: "medecin@test.com",
      password: "medecin123",
    },
  ];

  // Sample Patients
  const patients = [
    {
      id: "u001",
      name: "Jean Martin",
      age: 45,
      adresse: "10 rue des Lilas, Paris",
      telephone: "0601020304",
    },
    {
      id: "p002",
      name: "Sophie Bernard",
      age: 32,
      adresse: "25 avenue Mozart, Lyon",
      telephone: "0612345678",
    },
    {
      id: "p003",
      name: "Lucas Petit",
      age: 28,
      adresse: "8 boulevard Victor Hugo, Marseille",
      telephone: "0698765432",
    },
    {
      id: "p004",
      name: "Emma Rousseau",
      age: 55,
      adresse: "14 rue de la République, Toulouse",
      telephone: "0623456789",
    },
    {
      id: "p005",
      name: "Thomas Leroy",
      age: 67,
      adresse: "42 place de la Mairie, Nice",
      telephone: "0634567890",
    },
  ];

  // Sample Medicaments
  const medicaments = [
    {
      id: "m001",
      nom: "Doliprane",
      dosage: "500 mg",
      forme: "Comprimé",
      quantiteStock: 120,
    },
    {
      id: "m002",
      nom: "Ibuprofène",
      dosage: "400 mg",
      forme: "Comprimé",
      quantiteStock: 80,
    },
    {
      id: "m003",
      nom: "Amoxicilline",
      dosage: "1 g",
      forme: "Gélule",
      quantiteStock: 45,
    },
    {
      id: "m004",
      nom: "Ventoline",
      dosage: "100 μg",
      forme: "Spray",
      quantiteStock: 30,
    },
    {
      id: "m005",
      nom: "Aspirine",
      dosage: "100 mg",
      forme: "Comprimé",
      quantiteStock: 200,
    },
    {
      id: "m006",
      nom: "Paracétamol",
      dosage: "1 g",
      forme: "Comprimé effervescent",
      quantiteStock: 150,
    },
    {
      id: "m007",
      nom: "Levothyrox",
      dosage: "75 μg",
      forme: "Comprimé",
      quantiteStock: 90,
    },
    {
      id: "m008",
      nom: "Oméprazole",
      dosage: "20 mg",
      forme: "Gélule",
      quantiteStock: 65,
    },
    {
      id: "m009",
      nom: "Atorvastatine",
      dosage: "10 mg",
      forme: "Comprimé",
      quantiteStock: 110,
    },
    {
      id: "m010",
      nom: "Metformine",
      dosage: "850 mg",
      forme: "Comprimé",
      quantiteStock: 95,
    },
    {
      id: "m011",
      nom: "Ramipril",
      dosage: "5 mg",
      forme: "Comprimé",
      quantiteStock: 75,
    },
    {
      id: "m012",
      nom: "Amlodipine",
      dosage: "5 mg",
      forme: "Comprimé",
      quantiteStock: 88,
    },
    {
      id: "m013",
      nom: "Prednisolone",
      dosage: "20 mg",
      forme: "Comprimé",
      quantiteStock: 42,
    },
    {
      id: "m014",
      nom: "Cetirizine",
      dosage: "10 mg",
      forme: "Comprimé",
      quantiteStock: 135,
    },
    {
      id: "m015",
      nom: "Azithromycine",
      dosage: "250 mg",
      forme: "Comprimé",
      quantiteStock: 55,
    },
    {
      id: "m016",
      nom: "Ciprofloxacine",
      dosage: "500 mg",
      forme: "Comprimé",
      quantiteStock: 48,
    },
    {
      id: "m017",
      nom: "Loratadine",
      dosage: "10 mg",
      forme: "Comprimé",
      quantiteStock: 125,
    },
    {
      id: "m018",
      nom: "Symbicort",
      dosage: "160 μg",
      forme: "Spray inhalateur",
      quantiteStock: 28,
    },
    {
      id: "m019",
      nom: "Insuline Lantus",
      dosage: "100 UI",
      forme: "Stylo injectable",
      quantiteStock: 35,
    },
    {
      id: "m020",
      nom: "Xanax",
      dosage: "0.25 mg",
      forme: "Comprimé",
      quantiteStock: 62,
    },
    {
      id: "m021",
      nom: "Sertraline",
      dosage: "50 mg",
      forme: "Comprimé",
      quantiteStock: 70,
    },
    {
      id: "m022",
      nom: "Furosémide",
      dosage: "40 mg",
      forme: "Comprimé",
      quantiteStock: 85,
    },
    {
      id: "m023",
      nom: "Bisoprolol",
      dosage: "5 mg",
      forme: "Comprimé",
      quantiteStock: 92,
    },
    {
      id: "m024",
      nom: "Clopidogrel",
      dosage: "75 mg",
      forme: "Comprimé",
      quantiteStock: 78,
    },
    {
      id: "m025",
      nom: "Vitamine D",
      dosage: "1000 UI",
      forme: "Gélule",
      quantiteStock: 180,
    },
    {
      id: "m026",
      nom: "Magnésium",
      dosage: "300 mg",
      forme: "Comprimé",
      quantiteStock: 160,
    },
    {
      id: "m027",
      nom: "Fer",
      dosage: "80 mg",
      forme: "Comprimé",
      quantiteStock: 105,
    },
    {
      id: "m028",
      nom: "Sirop Toplexil",
      dosage: "150 ml",
      forme: "Sirop",
      quantiteStock: 45,
    },
    {
      id: "m029",
      nom: "Lysopaïne",
      dosage: "20 mg",
      forme: "Pastille",
      quantiteStock: 95,
    },
    {
      id: "m030",
      nom: "Biafine",
      dosage: "100 g",
      forme: "Crème",
      quantiteStock: 68,
    },
    {
      id: "m031",
      nom: "Voltarène Gel",
      dosage: "1%",
      forme: "Gel topique",
      quantiteStock: 52,
    },
    {
      id: "m032",
      nom: "Collyrium",
      dosage: "10 ml",
      forme: "Gouttes oculaires",
      quantiteStock: 38,
    },
    {
      id: "m033",
      nom: "Spasfon",
      dosage: "80 mg",
      forme: "Comprimé",
      quantiteStock: 112,
    },
    {
      id: "m034",
      nom: "Gaviscon",
      dosage: "500 mg",
      forme: "Comprimé à croquer",
      quantiteStock: 98,
    },
    {
      id: "m035",
      nom: "Smecta",
      dosage: "3 g",
      forme: "Poudre sachet",
      quantiteStock: 145,
    },
    {
      id: "m036",
      nom: "Lactibiane",
      dosage: "10 milliards",
      forme: "Gélule",
      quantiteStock: 72,
    },
    {
      id: "m037",
      nom: "Eludril",
      dosage: "200 ml",
      forme: "Bain de bouche",
      quantiteStock: 58,
    },
    {
      id: "m038",
      nom: "Rhinofluimucil",
      dosage: "10 ml",
      forme: "Spray nasal",
      quantiteStock: 43,
    },
    {
      id: "m039",
      nom: "Humex",
      dosage: "200 mg",
      forme: "Gélule",
      quantiteStock: 87,
    },
    {
      id: "m040",
      nom: "Fervex",
      dosage: "500 mg",
      forme: "Poudre sachet",
      quantiteStock: 125,
    },
  ];

  // Sample Ordonnances
  const ordonnances = [
    {
      id: "o001",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m001",
          quantiteParJour: 3,
          duree: 5,
        },
        {
          idMedicament: "m002",
          quantiteParJour: 2,
          duree: 7,
        },
      ],
      date: "2025-01-15",
    },
    {
      id: "o002",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m003",
          quantiteParJour: 2,
          duree: 10,
        },
      ],
      date: "2025-01-20",
    },
    {
      id: "o003",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m007",
          quantiteParJour: 1,
          duree: 30,
        },
        {
          idMedicament: "m009",
          quantiteParJour: 1,
          duree: 30,
        },
      ],
      date: "2025-02-01",
    },
    {
      id: "o004",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m033",
          quantiteParJour: 3,
          duree: 5,
        },
        {
          idMedicament: "m035",
          quantiteParJour: 3,
          duree: 3,
        },
      ],
      date: "2025-02-10",
    },
    {
      id: "o005",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m014",
          quantiteParJour: 1,
          duree: 7,
        },
        {
          idMedicament: "m029",
          quantiteParJour: 4,
          duree: 5,
        },
      ],
      date: "2025-02-15",
    },
    {
      id: "o006",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m004",
          quantiteParJour: 2,
          duree: 30,
        },
        {
          idMedicament: "m018",
          quantiteParJour: 2,
          duree: 30,
        },
      ],
      date: "2025-03-01",
    },
    {
      id: "o007",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m015",
          quantiteParJour: 1,
          duree: 5,
        },
      ],
      date: "2025-03-10",
    },
    {
      id: "o008",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m010",
          quantiteParJour: 2,
          duree: 30,
        },
        {
          idMedicament: "m011",
          quantiteParJour: 1,
          duree: 30,
        },
        {
          idMedicament: "m025",
          quantiteParJour: 1,
          duree: 30,
        },
      ],
      date: "2025-03-20",
    },
    {
      id: "o009",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m028",
          quantiteParJour: 3,
          duree: 7,
        },
        {
          idMedicament: "m040",
          quantiteParJour: 3,
          duree: 5,
        },
      ],
      date: "2025-04-01",
    },
    {
      id: "o010",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m008",
          quantiteParJour: 1,
          duree: 30,
        },
        {
          idMedicament: "m034",
          quantiteParJour: 2,
          duree: 14,
        },
      ],
      date: "2025-04-10",
    },
    {
      id: "o011",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m030",
          quantiteParJour: 2,
          duree: 10,
        },
      ],
      date: "2025-04-15",
    },
    {
      id: "o012",
      patientId: "u001",
      medecinId: "u003",
      medicaments: [
        {
          idMedicament: "m001",
          quantiteParJour: 4,
          duree: 3,
        },
        {
          idMedicament: "m002",
          quantiteParJour: 3,
          duree: 5,
        },
        {
          idMedicament: "m039",
          quantiteParJour: 2,
          duree: 5,
        },
      ],
      date: "2025-04-20",
    },
  ];

  // Sample Commandes
  const commandes = [
    {
      id: "cmd001",
      ordonnanceId: "o001",
      patientId: "u001",
      pharmacienId: "u002",
      status: "en_preparation",
      dateCreation: "2025-01-16T10:30:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "Livraison avant 18h si possible",
    },
    {
      id: "cmd002",
      ordonnanceId: "o002",
      patientId: "u001",
      pharmacienId: "u002",
      status: "livree",
      dateCreation: "2025-01-21T09:15:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "Sonner à l'interphone",
    },
    {
      id: "cmd003",
      ordonnanceId: "o003",
      patientId: "u001",
      pharmacienId: "u002",
      status: "en_attente",
      dateCreation: "2025-02-02T14:20:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "",
    },
    {
      id: "cmd004",
      ordonnanceId: "o004",
      patientId: "u001",
      pharmacienId: "u002",
      status: "livree",
      dateCreation: "2025-02-11T11:45:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "Laisser à la gardienne si absent",
    },
    {
      id: "cmd005",
      ordonnanceId: "o005",
      patientId: "u001",
      pharmacienId: "u002",
      status: "en_preparation",
      dateCreation: "2025-02-16T08:30:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "Livraison express demandée",
    },
    {
      id: "cmd006",
      ordonnanceId: "o007",
      patientId: "u001",
      pharmacienId: "u002",
      status: "livree",
      dateCreation: "2025-03-11T16:00:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "",
    },
    {
      id: "cmd007",
      ordonnanceId: "o009",
      patientId: "u001",
      pharmacienId: "u002",
      status: "en_attente",
      dateCreation: "2025-04-02T10:10:00Z",
      lieuLivraison: "10 rue des Lilas, Paris",
      remarques: "Préférence livraison matin",
    },
  ];

  // Save all data
  console.log("💾 Saving data...");
  await saveItem("users", users);
  console.log("👥 Users saved:", users.length);
  await saveItem("patients", patients);
  console.log("🏥 Patients saved:", patients.length);
  await saveItem("medicaments", medicaments);
  console.log("💊 Medicaments saved:", medicaments.length);
  await saveItem("ordonnances", ordonnances);
  console.log("📋 Ordonnances saved:", ordonnances.length);
  await saveItem("commandes", commandes);
  console.log("📦 Commandes saved:", commandes.length);

  console.log("✅ Base de données initialisée avec succès!");
  console.log("📊 Summary:");
  console.log("  - Users:", users.length);
  console.log("  - Patients:", patients.length);
  console.log("  - Medicaments:", medicaments.length);
  console.log("  - Ordonnances:", ordonnances.length);
  console.log("  - Commandes:", commandes.length);
};
