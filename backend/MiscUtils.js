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
const filesSubmitted = [
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

// Export list
module.exports = {
  FILE_TYPES,
  FILE_TYPES_WITH_DOT,
  departmentsMap,
  filesSubmitted
};
