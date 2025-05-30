// All the accepted file types
const FILE_TYPES = [
  'pdf'
];

const FILE_TYPES_WITH_DOT = [
  '.pdf'
];

const departmentsMap = {
  '104': 555, //ΙΣΤΟΡΙΑΣ, ΑΡΧΑΙΟΛΟΓΙΑΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΠΟΛΙΤΙΣΜΙΚΩΝ ΑΓΑΘΩΝ
  '1511': 1511, //ΓΕΩΠΟΝΙΑΣ
  '1512': 1512, //ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ
  '1513': 465, //ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ
  '1514': 1514, //ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ ΚΑΙ ΟΡΓΑΝΙΣΜΩΝ
  '1515': 466, //ΛΟΓΟΘΕΡΑΠΕΙΑΣ
  '1516': 1516, //ΕΠΙΣΤΗΜΗΣ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ
  '1517': 1517, //ΠΑΡΑΣΤΑΤΙΚΩΝ ΚΑΙ ΨΗΦΙΑΚΩΝ ΤΕΧΝΩΝ
  '1518': 1518, //ΔΙΟΙΚΗΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ
  '1519': 1519, //ΨΗΦΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ
  '1520': 1520, //ΦΥΣΙΚΟΘΕΡΑΠΕΙΑΣ
  '1522': 31, //ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1522': 11, //ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ   - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1522': 61, //ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ   - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1523': 32, //ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1523': 12, //ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1524': 33, //ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1524': 13, //ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '187': 556, //ΚΟΙΝΩΝΙΚΗΣ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ
  '189': 551, //ΦΙΛΟΛΟΓΙΑΣ
  '190': 550, //ΝΟΣΗΛΕΥΤΙΚΗΣ
  '361': 554, //ΟΙΚΟΝΟΜΙΚΩΝ ΕΠΙΣΤΗΜΩΝ
  '362': 557, //ΘΕΑΤΡΙΚΩΝ ΣΠΟΥΔΩΝ
  '400': 558, //ΟΡΓΑΝΩΣΗΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΑΘΛΗΤΙΣΜΟΥ
  '411': 559, //ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ
  '98': 560 //ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ
};

// TODO check if filenames do indeed match the description
const filesSubmittedMeals = [
  {
    filename: "fileOikogeneiakhKatastasi", description: "Πιστοποιητικό οικογενειακής κατάστασης(άρθρο 5, παρ.1, κατ.β)", type: 'required'
  }, {
    filename: "fileTautotita", description: "Αντίγραφο Αστυνομικής Ταυτότητας ή Διαβατηρίου(άρθρο 5, παρ.1, κατ.γ)", type: 'required'
  }, {
    filename: "fileToposMonimhsKatoikias", description: "Έγγραφο πιστοποίησης τόπου μόνιμης κατοικίας(άρθρο 5, παρ.1, κατ.δ)", type: 'required'
  }, {
    filename: "fileEka8aristiko", description: "Εκκαθαριστικό σημείωμα εφορίας(άρθρο 1, παρ.5, περ.ζ)", type: 'required'
  }, {
    filename: "fileYpeu8unhDilosi", description: "Υπεύθυνη δήλωση Ν.1599(βάσει υποδείγματος) (άρθρο 5, παρ 1, κατ.ε)", type: 'required'
  }, {
    filename: "filePolutekneia", description: "Πιστοποιητικό πολυτεκνίας(άρθρο1, παρ.9, κατ.α)", type: 'optional'
  }, {
    filename: "fileBebaioshSpoudonAderfwn", description: "Βεβαίωση σπουδών αδελφού/ης(άρθρο 1, παρ.9, κατ.γ)", type: 'optional'
  }, {
    filename: "filePistopoihtikoGoneaFoithth", description: "Πιστοποιητικό οικογενειακής κατάστασης(τρίτεκνος)(άρθρο 1, παρ. 9, κατ.β)", type: 'optional'
  }, {
    filename: "fileLhksiarxikhPrakshThanatouGoneaA", description: "Ληξιαρχική πράξη θανάτου γονέα(άρθρο 1, παρ9, κατ.δ)", type: 'optional'
  }, {
    filename: "fileLhksiarxikhPrakshThanatouGoneaB", description: "Ληξιαρχική πράξη γέννησης φοιτητή(άρθρο 1, παρ.9, κατ.δ)", type: 'optional'
  }, {
    filename: "fileAgamhMhtera", description: "Ληξιαρχική πράξη γέννησης φοιτητή(άρθρο 1, παρ.9, κατ.ε)", type: 'optional'
  }, {
    filename: "fileGoneisAMEA", description: "Πιστοποιητικό υγειονομικής επιτροπής(αναπηρία)(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileGoneisAMEAIatrikhGnomateush", description: "Ιατρική γνωμάτευση από Δημόσιο Νοσοκομείο(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileGoneisThumataTromokratias1", description: "Ληξιαρχική πράξη γέννησης φοιτητή(άρθρο 1, παρ.9, κατ.η)", type: 'optional'
  }, {
    filename: "fileGoneisThumataTromokratias2", description: "Αντίγραφο πράξης συνταξιοδότησης Ν1897(άρθρο 1, παρ.9, κατ.η)", type: 'optional'
  }, {
    filename: "fileBebaioshEpidothsdhsAnergeias", description: "Βεβαίωση επιδότησης ανεργίας(άρθρο 1, παρ5)", type: 'optional'
  }, {
    filename: "fileDiazevgmenoiGoneis1", description: "Διαζευκτήριο", type: 'optional'
  }, {
    filename: "fileDiazevgmenoiGoneis2", description: "Eπιμέλεια φοιτητή", type: 'optional'
  }, {
    filename: "fileAMEA", description: "Πιστοποιητικό υγειονομικής επιτροπής(αναπηρία)(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileAMEAIatrikhGnomateush", description: "Ιατρική γνωμάτευση από Δημόσιο Νοσοκομείο(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }
];

const filesSubmittedAccommodation = [
  {
    filename: "fileOikogeneiakhKatastasi", description: "Πιστοποιητικό οικογενειακής κατάστασης(άρθρο 5, παρ.1, κατ.β)", type: 'required'
  }, {
    filename: "fileTautotita", description: "Αντίγραφο Αστυνομικής Ταυτότητας ή Διαβατηρίου(άρθρο 5, παρ.1, κατ.γ)", type: 'required'
  }, {
    filename: "fileToposMonimhsKatoikias", description: "Έγγραφο πιστοποίησης τόπου μόνιμης κατοικίας(άρθρο 5, παρ.1, κατ.δ)", type: 'required'
  }, {
    filename: "fileEpidosi", description: "Βεβαίωση επίδοσης για επιτυχής εξέταση στα μισά μαθήματα του προηγούμενου Ακ. Έτους, που προβλέπονται από τον Οδηγό Σπουδών.", type: 'required'
  }, {
    filename: "fileVevaiwshSpoudwn", description: "Βεβαίωση σπουδών. Για την απόδειξη φοίτησης εντός της τυπικής διάρκειας +2 χρόνια.", type: 'required'
  }, {
    filename: "fileYpeu8unhDilosi", description: "Υπεύθυνη δήλωση Ν.1599(βάσει υποδείγματος) (άρθρο 5, παρ 1, κατ.ε)", type: 'required'
  }, {
    filename: "filePolutekneia", description: "Πιστοποιητικό πολυτεκνίας(άρθρο1, παρ.9, κατ.α)", type: 'optional'
  }, {
    filename: "fileBebaioshSpoudonAderfwn", description: "Βεβαίωση σπουδών αδελφού/ης(άρθρο 1, παρ.9, κατ.γ)", type: 'optional'
  }, {
    filename: "filePistopoihtikoGoneaFoithth", description: "Πιστοποιητικό οικογενειακής κατάστασης(τρίτεκνος)(άρθρο 1, παρ. 9, κατ.β)", type: 'optional'
  }, {
    filename: "fileLhksiarxikhPrakshThanatouGoneaA", description: "Ληξιαρχική πράξη θανάτου γονέα(άρθρο 1, παρ9, κατ.δ)", type: 'optional'
  }, {
    filename: "fileLhksiarxikhPrakshThanatouGoneaB", description: "Ληξιαρχική πράξη γέννησης φοιτητή(άρθρο 1, παρ.9, κατ.δ)", type: 'optional'
  }, {
    filename: "fileAgamhMhtera", description: "Ληξιαρχική πράξη γέννησης φοιτητή(άρθρο 1, παρ.9, κατ.ε)", type: 'optional'
  }, {
    filename: "fileGoneisAMEA", description: "Πιστοποιητικό υγειονομικής επιτροπής(αναπηρία)(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileGoneisAMEAIatrikhGnomateush", description: "Ιατρική γνωμάτευση από Δημόσιο Νοσοκομείο(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileGoneisThumataTromokratias1", description: "Ληξιαρχική πράξη γέννησης φοιτητή(άρθρο 1, παρ.9, κατ.η)", type: 'optional'
  }, {
    filename: "fileGoneisThumataTromokratias2", description: "Αντίγραφο πράξης συνταξιοδότησης Ν1897(άρθρο 1, παρ.9, κατ.η)", type: 'optional'
  }, {
    filename: "fileBebaioshEpidothsdhsAnergeias", description: "Βεβαίωση επιδότησης ανεργίας(άρθρο 1, παρ5)", type: 'optional'
  }, {
    filename: "fileDiazevgmenoiGoneis1", description: "Διαζευκτήριο", type: 'optional'
  }, {
    filename: "fileDiazevgmenoiGoneis2", description: "Eπιμέλεια φοιτητή", type: 'optional'
  }, {
    filename: "fileAMEA", description: "Πιστοποιητικό υγειονομικής επιτροπής(αναπηρία)(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileAMEAIatrikhGnomateush", description: "Ιατρική γνωμάτευση από Δημόσιο Νοσοκομείο(άρθρο 1, παρ.9, περ.στ)", type: 'optional'
  }, {
    filename: "fileStratos", description: "Βεβαίωση Υπηρεσίας από τη Μονάδα του στρατευμένου για κάθε προστατευόμενο μέλος της οικογένειας του υποψηφίου", type: 'optional'
  }, {
    filename: "fileYpotrofeia", description: "Βεβαίωση υποτροφίας", type: 'optional'
  }, {
    filename: "fileAporia", description: "Bεβαίωση – πιστοποιητικό απορίας Βεβαίωση από αρμόδια Υπηρεσία Κοινωνικής Πρόνοιας", type: 'optional'
  }, {
    filename: "fileDiavathrio", description: "Διαβατήριο και άδεια παραμονής (φωτοτυπία)", type: 'optional'
  }, {
    filename: "filePistopoihtikoAlodapou", description: "Πιστοποιητικό οικογενειακής κατάστασης, μεταφρασμένο και θεωρημένο από αρμόδια αρχή", type: 'optional'
  }, {
    filename: "fileEkkatharistikoAllodapou", description: "Εκκαθαριστικό σημείωμα για το οικογενειακό εισόδημα ή Βεβαίωση Οικονομικής αρχής από τον τόπο καταγωγής/διαμονής τους", type: 'optional'
  }
];

const citiesDepartmentsMap = [
  { depId: "98", name: "ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "104", name: "ΙΣΤΟΡΙΑΣ, ΑΡΧΑΙΟΛΟΓΙΑΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΠΟΛΙΤΙΣΜΙΚΩΝ ΑΓΑΘΩΝ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1511", name: "ΓΕΩΠΟΝΙΑΣ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1512", name: "ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1513", name: "ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1514", name: "ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ ΚΑΙ ΟΡΓΑΝΙΣΜΩΝ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1515", name: "ΛΟΓΟΘΕΡΑΠΕΙΑΣ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1516", name: "ΕΠΙΣΤΗΜΗΣ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1517", name: "ΠΑΡΑΣΤΑΤΙΚΩΝ ΚΑΙ ΨΗΦΙΑΚΩΝ ΤΕΧΝΩΝ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "1518", name: "ΔΙΟΙΚΗΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "1519", name: "ΨΗΦΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "1520", name: "ΦΥΣΙΚΟΘΕΡΑΠΕΙΑΣ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "1522", name: "ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ", city: 'ΠΑΤΡΑ' },
  { depId: "1523", name: "ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ", city: 'ΠΑΤΡΑ' },
  { depId: "1524", name: "ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ", city: 'ΠΑΤΡΑ' },
  { depId: "187", name: "ΚΟΙΝΩΝΙΚΗΣ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "189", name: "ΦΙΛΟΛΟΓΙΑΣ", city: 'ΚΑΛΑΜΑΤΑ' },
  { depId: "190", name: "ΝΟΣΗΛΕΥΤΙΚΗΣ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "361", name: "ΟΙΚΟΝΟΜΙΚΩΝ ΕΠΙΣΤΗΜΩΝ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "362", name: "ΘΕΑΤΡΙΚΩΝ ΣΠΟΥΔΩΝ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "400", name: "ΟΡΓΑΝΩΣΗΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΑΘΛΗΤΙΣΜΟΥ", city: 'ΝΑΥΠΛΙΟ' },
  { depId: "411", name: "ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ", city: 'ΝΑΥΠΛΙΟ' }
];

function getDepartmentsByCity(cityName) {
  return citiesDepartmentsMap.filter(department => department.city === cityName);
}

function getAllDepartments() {
  return citiesDepartmentsMap;
}

/**
 * Extract the student Registry ID after the last colon (:) and after the optional slash (/) in the given string.
 * Mostly for students of technological departments. e.g for AM: 1513/1234567 the function will return 1234567.
 *
 * @param {string} splitString - The input string to be split and processed.
 * @returns {string} The extracted student ID.
 */
const splitStudentsAM = (splitString) => {
  const splitArray = splitString.split(':');
  const lastArrayPart = splitArray[splitArray.length - 1];

  if (lastArrayPart.includes("/")) {
    return lastArrayPart.split("/")[1];
  }

  return lastArrayPart;
};

const getAEICodeFromDepartmentId = (departmentId) => {
  return parseInt(departmentId.toString().substring(0, 4));
};

// Export list
module.exports = {
  FILE_TYPES,
  FILE_TYPES_WITH_DOT,
  departmentsMap,
  filesSubmittedMeals,
  filesSubmittedAccommodation,
  citiesDepartmentsMap,
  getDepartmentsByCity,
  getAllDepartments,
  splitStudentsAM,
  getAEICodeFromDepartmentId
};
