import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

interface municipality {
  name: string;
}

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})

/**
 * @title enable practice with vertical stepper
 */
export class accommodationComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  specialDataFormGroup!: FormGroup;
  studentsSSOData: Student[] = [];

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacpersonaluniquecode = this.getRegistrationNumber(this.studentsSSOData[0].schacpersonaluniquecode);
        this.studentsSSOData[0].department_id = this.departmentsMap[this.studentsSSOData[0].department_id];
      });

    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: [],
      surnameCtrl: [],
      fatherNameCtrl: ['', Validators.required],
      registrationNumber: [],
      depName: [],
      municipality: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      mail: [],
    });

    this.secondFormGroup = this._formBuilder.group({
      ssnControl: ['', Validators.required],
      doyControl: ['', Validators.required],
      amkaControl: ['', Validators.required],
      ibanControl: ['', Validators.required],
      ssnFile: ['', Validators.required],
      ibanFile: ['', Validators.required]
    });

    this.contactFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      phoneCtrl: [],
      addressCtrl: [],
      locationCtrl: [],
      cityCtrl: [],
      postalCodeCtrl: []
    });

    this.specialDataFormGroup = this._formBuilder.group({
      ameaCatCtrl: ['', Validators.required],
      workingCatCtrl: ['', Validators.required],
      armyCatCtrl: ['', Validators.required]
    });
  }

  private getRegistrationNumber(str: string): string {
    let registrationNumber = [''];
    if (str.indexOf('/') == -1) {
      registrationNumber = str.split(":");
      return registrationNumber[8];
    } else {
      registrationNumber = str.split("/");
      return registrationNumber[1];
    }
  }

  checkIfFieldEmpty(givenFormGroup: FormGroup, field: string): boolean {
    const fieldValue = givenFormGroup.get(field)?.value;
    return fieldValue && fieldValue != null && fieldValue != '';
  }

  location: municipality[] = [
    { name: 'Αβδήρων' },
    { name: 'Αγαθονησίου' },
    { name: 'Αγιάς' },
    { name: 'Αγίας Βαρβάρας' },
    { name: 'Αγίας Παρασκευής' },
    { name: 'Αγίου Βασιλείου' },
    { name: 'Αγίου Δημητρίου' },
    { name: 'Αγίου Ευστρατίου' },
    { name: 'Αγίου Νικολάου' },
    { name: 'Αγιων Αναργύρων - Καματερού' },
    { name: 'Αγκιστρίου' },
    { name: 'Αγράφων' },
    { name: 'Αγρινίου' },
    { name: 'Αθηναίων' },
    { name: 'Αιγάλεω' },
    { name: 'Αιγιαλείας' },
    { name: 'Αίγινας' },
    { name: 'Ακτιου - Βόνιτσας' },
    { name: 'Αλεξάνδρειας' },
    { name: 'Αλεξανδρούπολης' },
    { name: 'Αλιάρτου - Θεσπιέων' },
    { name: 'Αλίμου' },
    { name: 'Αλμυρού' },
    { name: 'Αλμωπίας' },
    { name: 'Αλοννήσου' },
    { name: 'Αμαρίου' },
    { name: 'Αμαρουσίου' },
    { name: 'Αμοργού' },
    { name: 'Αμπελοκήπων - Μενεμένης' },
    { name: 'Αμυνταίου' },
    { name: 'Αμφίκλειας - Ελάτειας' },
    { name: 'Αμφιλοχίας' },
    { name: 'Αμφίπολης' },
    { name: 'Ανατολικής Μάνης' },
    { name: 'Ανατολικής Σάμου' },
    { name: 'Ανάφης' },
    { name: 'Ανδραβίδας - Κυλλήνης' },
    { name: 'Ανδρίτσαινας - Κρεστένων' },
    { name: 'Ανδρου' },
    { name: 'Αντιπάρου' },
    { name: 'Ανωγείων' },
    { name: 'Αποκορώνου' },
    { name: 'Αργιθέας' },
    { name: 'Αργοστολίου' },
    { name: 'Αργους - Μυκηνών' },
    { name: 'Άργους Ορεστικού' },
    { name: 'Αριστοτέλη' },
    { name: 'Αρριανών' },
    { name: 'Αρταίων' },
    { name: 'Αρχαίας Ολυμπίας' },
    { name: 'Αρχανών - Αστερουσίων' },
    { name: 'Ασπροπύργου' },
    { name: 'Αστυπάλαιας' },
    { name: 'Αχαρνών' },
    { name: 'Βάρης - Βούλας - Βουλιαγμένης' },
    { name: 'Βελβεντού' },
    { name: 'Βέλου - Βόχας' },
    { name: 'Βέροιας' },
    { name: 'Βιάννου' },
    { name: 'Βισαλτίας' },
    { name: 'Βοϊου' },
    { name: 'Βόλβης' },
    { name: 'Βόλου' },
    { name: 'Βόρειας Κέρκυρας' },
    { name: 'Βόρειας Κυνουρίας' },
    { name: 'Βορείων Τζουμέρκων' },
    { name: 'Βριλησσίων' },
    { name: 'Βύρωνος' },
    { name: 'Γαλατσίου' },
    { name: 'Γαύδου' },
    { name: 'Γεωργίου Καραϊσκάκη' },
    { name: 'Γλυφάδας' },
    { name: 'Γόρτυνας' },
    { name: 'Γορτυνίας' },
    { name: 'Γρεβενών' },
    { name: 'Δάφνης - Υμηττού' },
    { name: 'Δέλτα' },
    { name: 'Δελφών' },
    { name: 'Δεσκάτης' },
    { name: 'Διδυμοτείχου' },
    { name: 'Διονύσου' },
    { name: 'Δίου - Ολύμπου' },
    { name: 'Διρφύων - Μεσσαπίων' },
    { name: 'Διστόμου - Αράχοβας - Αντίκυρας' },
    { name: 'Δομοκού' },
    { name: 'Δοξάτου' },
    { name: 'Δράμας' },
    { name: 'Δυτικής Αχαϊας' },
    { name: 'Δυτικής Λέσβου' },
    { name: 'Δυτικής Μάνης' },
    { name: 'Δυτικής Σάμου' },
    { name: 'Δωδώνης' },
    { name: 'Δωρίδος' },
    { name: 'Εδεσσας' },
    { name: 'Ελασσόνας' },
    { name: 'Ελαφονήσου' },
    { name: 'Ελευσίνας' },
    { name: 'Ελληνικού - Αργυρούπολης' },
    { name: 'Εμμανουήλ Παππά' },
    { name: 'Εορδαίας' },
    { name: 'Επιδαύρου' },
    { name: 'Ερέτριας' },
    { name: 'Ερμιονίδας' },
    { name: 'Ερυμάνθου' },
    { name: 'Ευρώτα' },
    { name: 'Ζαγοράς - Μουρεσίου' },
    { name: 'Ζαγορίου' },
    { name: 'Ζακύνθου' },
    { name: 'Ζαχάρως' },
    { name: 'Ζηρού' },
    { name: 'Ζίτσας' },
    { name: 'Ζωγράφου' },
    { name: 'Ηγουμενίτσας' },
    { name: 'Ηλιδας' },
    { name: 'Ηλιουπόλεως' },
    { name: 'Ηρακλείας' },
    { name: 'Ηρακλείου' },
    { name: 'Ηρακλείου Αττικής' },
    { name: 'Ηρωικής Νήσου Κάσου' },
    { name: 'Ηρωικής Νήσου Ψαρών' },
    { name: 'Ηρωικής Πόλεως Νάουσας' },
    { name: 'Θάσου' },
    { name: 'Θερμαϊκού' },
    { name: 'Θέρμης' },
    { name: 'Θέρμου' },
    { name: 'Θεσσαλονίκης' },
    { name: 'Θηβαίων' },
    { name: 'Θήρας' },
    { name: 'Ιάσμου' },
    { name: 'Ιεράπετρας' },
    { name: 'Ιεράς Πόλης Μεσολογγίου' },
    { name: 'Ιητών' },
    { name: 'Ιθάκης' },
    { name: 'Ικαρίας ' },
    { name: 'Ιλίου' },
    { name: 'Ιστιαίας - Αιδηψού' },
    { name: 'Ιωαννιτών' },
    { name: 'Καβάλας' },
    { name: 'Καισαριανής' },
    { name: 'Καλαβρύτων' },
    { name: 'Καλαμαριάς' },
    { name: 'Καλαμάτας' },
    { name: 'Καλλιθέας' },
    { name: 'Καλυμνίων' },
    { name: 'Καμένων Βούρλων' },
    { name: 'Καντάνου - Σελίνου' },
    { name: 'Καρδίτσας' },
    { name: 'Καρπάθου' },
    { name: 'Καρπενησίου' },
    { name: 'Καρύστου' },
    { name: 'Κασσάνδρας' },
    { name: 'Καστοριάς' },
    { name: 'Κατερίνης' },
    { name: 'Κάτω Νευροκοπίου' },
    { name: 'Κέας' },
    { name: 'Κεντρικής Κέρκυρας και Διαποντίων Νήσων' },
    { name: 'Κεντρικών Τζουμέρκων ' },
    { name: 'Κερατσινίου - Δραπετσώνας' },
    { name: 'Κηφισιάς' },
    { name: 'Κιλελέρ' },
    { name: 'Κιλκίς' },
    { name: 'Κιμώλου' },
    { name: 'Κισσάμου' },
    { name: 'Κοζάνης' },
    { name: 'Κομοτηνής' },
    { name: 'Κόνιτσας' },
    { name: 'Κορδελιού - Ευόσμου' },
    { name: 'Κορινθίων' },
    { name: 'Κορυδαλλού' },
    { name: 'Κρωπίας' },
    { name: 'Κυθήρων' },
    { name: 'Κύθνου' },
    { name: 'Κύμης - Αλιβερίου' },
    { name: 'Κω' },
    { name: 'Λαγκαδά' },
    { name: 'Λαμιέων' },
    { name: 'Λαρισαίων' },
    { name: 'Λαυρεωτικής' },
    { name: 'Λεβαδέων' },
    { name: 'Λειψών' },
    { name: 'Λέρου' },
    { name: 'Λευκάδας' },
    { name: 'Λήμνου' },
    { name: 'Ληξουρίου' },
    { name: 'Λίμνης Πλαστήρα' },
    { name: 'Λοκρών' },
    { name: 'Λουτρακίου - Περαχώρας - Αγ. Θεοδώρων' },
    { name: 'Λυκόβρυσης - Πεύκης' },
    { name: 'Μακρακώμης' },
    { name: 'Μαλεβιζίου' },
    { name: 'Μάνδρας - Ειδυλλίας' },
    { name: 'Μαντουδίου - Λίμνης - Αγίας Αννας' },
    { name: 'Μαραθώνος' },
    { name: 'Μαρκοπούλου Μεσογαίας' },
    { name: 'Μαρωνείας - Σαπών' },
    { name: 'Μεγαλόπολης' },
    { name: 'Μεγανησίου' },
    { name: 'Μεγαρέων' },
    { name: 'Μεγίστης' },
    { name: 'Μεσσήνης' },
    { name: 'Μεταμορφώσεως' },
    { name: 'Μετεώρων' },
    { name: 'Μετσόβου' },
    { name: 'Μήλου' },
    { name: 'Μινώα Πεδιάδας' },
    { name: 'Μονεμβασίας' },
    { name: 'Μοσχάτου - Ταύρου' },
    { name: 'Μουζακίου' },
    { name: 'Μύκης' },
    { name: 'Μυκόνου' },
    { name: 'Μυλοποτάμου' },
    { name: 'Μυτιλήνης' },
    { name: 'Νάξου & Μικρών Κυκλάδων' },
    { name: 'Ναυπακτίας' },
    { name: 'Ναυπλιέων' },
    { name: 'Νεάπολης - Συκεών' },
    { name: 'Νέας Ζίχνης' },
    { name: 'Νέας Ιωνίας' },
    { name: 'Νέας Προποντίδας' },
    { name: 'Νέας Σμύρνης' },
    { name: 'Νέας Φιλαδέλφειας - Νέας Χαλκηδόνας' },
    { name: 'Νεμέας' },
    { name: 'Νεστορίου' },
    { name: 'Νέστου' },
    { name: 'Νίκαιας - Αγίου Ι. Ρέντη' },
    { name: 'Νικολάου Σκουφά' },
    { name: 'Νισύρου' },
    { name: 'Νότιας Κέρκυρας' },
    { name: 'Νότιας Κυνουρίας' },
    { name: 'Νοτίου Πηλίου' },
    { name: 'Ξάνθης' },
    { name: 'Ξηρομέρου' },
    { name: 'Ξυλοκάστρου - Ευρωστίνης' },
    { name: 'Οινουσσών' },
    { name: 'Οιχαλίας' },
    { name: 'Ορεστιάδας' },
    { name: 'Οροπεδίου Λασιθίου' },
    { name: 'Ορχομενού' },
    { name: 'Παγγαίου' },
    { name: 'Παιανίας' },
    { name: 'Παιονίας' },
    { name: 'Παλαιού Φαλήρου' },
    { name: 'Παλαμά' },
    { name: 'Παλλήνης' },
    { name: 'Παξών' },
    { name: 'Παπάγου - Χολαργού' },
    { name: 'Παρανεστίου' },
    { name: 'Πάργας' },
    { name: 'Πάρου' },
    { name: 'Πάτμου' },
    { name: 'Πατρέων' },
    { name: 'Παύλου Μελά' },
    { name: 'Πειραιώς' },
    { name: 'Πέλλας' },
    { name: 'Πεντέλης' },
    { name: 'Περάματος' },
    { name: 'Περιστερίου' },
    { name: 'Πετρουπόλεως' },
    { name: 'Πηνειού' },
    { name: 'Πλατανιά' },
    { name: 'Πολυγύρου' },
    { name: 'Πόρου' },
    { name: 'Πρέβεζας' },
    { name: 'Πρεσπών' },
    { name: 'Προσοτσάνης' },
    { name: 'Πύδνας - Κολινδρού' },
    { name: 'Πυλαίας - Χορτιάτη' },
    { name: 'Πύλης' },
    { name: 'Πύλου - Νέστορος' },
    { name: 'Πύργου' },
    { name: 'Πωγωνίου' },
    { name: 'Ραφήνας - Πικερμίου' },
    { name: 'Ρεθύμνης' },
    { name: 'Ρήγα Φεραίου' },
    { name: 'Ρόδου' },
    { name: 'Σαλαμίνος' },
    { name: 'Σάμης' },
    { name: 'Σαμοθράκης' },
    { name: 'Σαρωνικού' },
    { name: 'Σερβίων' },
    { name: 'Σερίφου' },
    { name: 'Σερρών' },
    { name: 'Σητείας' },
    { name: 'Σιθωνίας' },
    { name: 'Σικίνου' },
    { name: 'Σικυωνίων' },
    { name: 'Σιντικής' },
    { name: 'Σίφνου' },
    { name: 'Σκιάθου' },
    { name: 'Σκοπέλου' },
    { name: 'Σκύδρας' },
    { name: 'Σκύρου' },
    { name: 'Σουλίου' },
    { name: 'Σουφλίου' },
    { name: 'Σοφάδων' },
    { name: 'Σπάρτης' },
    { name: 'Σπάτων - Αρτέμιδος' },
    { name: 'Σπετσών' },
    { name: 'Στυλίδας' },
    { name: 'Σύμης' },
    { name: 'Σύρου - Ερμούπολης' },
    { name: 'Σφακίων' },
    { name: 'Τανάγρας' },
    { name: 'Τεμπών ' },
    { name: 'Τήλου' },
    { name: 'Τήνου' },
    { name: 'Τοπείρου' },
    { name: 'Τρικκαίων' },
    { name: 'Τρίπολης' },
    { name: 'Τριφυλίας' },
    { name: 'Τροιζηνίας - Μεθάνων' },
    { name: 'Τυρνάβου' },
    { name: 'Υδρας' },
    { name: 'Φαιστού' },
    { name: 'Φαρκαδόνας' },
    { name: 'Φαρσάλων' },
    { name: 'Φιλιατών' },
    { name: 'Φιλοθέης - Ψυχικού' },
    { name: 'Φλώρινας' },
    { name: 'Φολεγάνδρου' },
    { name: 'Φούρνων Κορσεών' },
    { name: 'Φυλής' },
    { name: 'Χαϊδαρίου' },
    { name: 'Χαλανδρίου' },
    { name: 'Χαλκηδόνος' },
    { name: 'Χάλκης' },
    { name: 'Χαλκιδέων' },
    { name: 'Χανίων' },
    { name: 'Χερσονήσου' },
    { name: 'Χίου' },
    { name: 'Ωραιοκάστρου' },
    { name: 'Ωρωπού' },
  ];

  departmentsMap = {
    '98': 'ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ',
    '104': 'ΙΣΤΟΡΙΑΣ, ΑΡΧΑΙΟΛΟΓΙΑΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΠΟΛΙΤΙΣΜΙΚΩΝ ΑΓΑΘΩΝ',
    '1511': 'ΓΕΩΠΟΝΙΑΣ',
    '1512': 'ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ',
    '1513': 'ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ',
    '1514': 'ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ ΚΑΙ ΟΡΓΑΝΙΣΜΩΝ',
    '1515': 'ΛΟΓΟΘΕΡΑΠΕΙΑΣ',
    '1516': 'ΕΠΙΣΤΗΜΗΣ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ',
    '1517': 'ΠΑΡΑΣΤΑΤΙΚΩΝ ΚΑΙ ΨΗΦΙΑΚΩΝ ΤΕΧΝΩΝ',
    '1518': 'ΔΙΟΙΚΗΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ',
    '1519': 'ΨΗΦΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ',
    '1520': 'ΦΥΣΙΚΟΘΕΡΑΠΕΙΑΣ',
    '1522': 'ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '1523': 'ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '1524': 'ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '187': 'ΚΟΙΝΩΝΙΚΗΣ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ',
    '189': 'ΦΙΛΟΛΟΓΙΑΣ',
    '190': 'ΝΟΣΗΛΕΥΤΙΚΗΣ',
    '361': 'ΟΙΚΟΝΟΜΙΚΩΝ ΕΠΙΣΤΗΜΩΝ',
    '362': 'ΘΕΑΤΡΙΚΩΝ ΣΠΟΥΔΩΝ',
    '400': 'ΟΡΓΑΝΩΣΗΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΑΘΛΗΤΙΣΜΟΥ',
    '411': 'ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ'
  }

  /**
   * Used to update student general, contract and contact details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    // check if the only required field in the last stepper is empty
    // to check if a more generic implementation can implemented
    if (!this.checkIfFieldEmpty(this.contactFormGroup, 'emailCtrl')) {
      return;
    }
    const generalDetailsData: any = {
      father_name: this.firstFormGroup.get('fatherNameCtrl')?.value,
      father_last_name: this.firstFormGroup.get('fatherSurnameCtrl')?.value,
      mother_name: this.firstFormGroup.get('motherNameCtrl')?.value,
      mother_last_name: this.firstFormGroup.get('motherSurnameCtrl')?.value
    };
    const contractsData: any = {
      ssn: this.secondFormGroup.get('ssnControl')?.value,
      doy: this.secondFormGroup.get('doyControl')?.value,
      iban: this.secondFormGroup.get('ibanControl')?.value,
    };
    const contractFiles: any = {
      ssnFile: this.secondFormGroup.get('ssnFile')?.value,
      ibanFile: this.secondFormGroup.get('ibanFile')?.value
    };
    const contactDetails: any = {
      phone: this.contactFormGroup.get('phoneCtrl')?.value,
      address: this.contactFormGroup.get('addressCtrl')?.value,
      location: this.contactFormGroup.get('locationCtrl')?.value,
      city: this.contactFormGroup.get('cityCtrl')?.value,
      post_address: this.contactFormGroup.get('postalCodeCtrl')?.value,
      country: 'gr'
    };

    const specialDetails: any = {
      military_training: this.specialDataFormGroup.get('armyCatCtrl')?.value,
      working_state: this.specialDataFormGroup.get('workingCatCtrl')?.value,
      amea_cat: this.specialDataFormGroup.get('ameaCatCtrl')?.value
    }

    this.onSubmitStudentDetails(generalDetailsData);
    this.onSubmitStudentContractDetails(contractsData, contractFiles);
    this.onSubmitStudentContact(contactDetails);
    this.onSubmitStudentSpecialDetails(specialDetails);
    this.setPhase(1);
    this.onSave();
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitStudentDetails(data: any) {
    this.studentsService.updateStudentDetails(data);
  }

  onSubmitStudentSpecialDetails(data: any) {
    this.studentsService.updateStudentSpecialDetails(data);
  }

  setPhase(phase: number) {

  }

  onSubmitStudentContractDetails(data: any, contractFiles: { ssnFile: any; ibanFile: any; }) {
    const fileSSN = this.uploadFile(contractFiles.ssnFile);
    const fileIban = this.uploadFile(contractFiles.ibanFile);
    this.studentsService.updateStudentContractDetails(data);
    // this.studentsService.updateStudentContractSSNFile(fileSSN);
    // this.studentsService.updateStudentContractIbanFile(fileIban);
    let err = false;
    this.studentsService.updateStudentContractSSNFile(fileSSN)
      .pipe(
        mergeMap(this.studentsService.updateStudentContractIbanFile(fileIban)
        )
      );
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
  }

  onSave() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  onErr() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Μη έγκυρος τύπος αρχείων. Υποστηριζόμενος τύπος αρχέιων: .pdf .jpg .png .webp .jpeg .gif .doc .docx',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  validateFiles(docType: string) {
    let ssnFile = this.secondFormGroup.get(docType)?.value;
    if (ssnFile == null) {
      return;
    }
    let fileName = ssnFile._fileNames;
    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'pdf':
      case 'png':
      case 'doc':
      case 'docx':
      case 'gif':
      case 'webp':
        console.log('Allowed file format');
        break;
      default:
        this.onErr();
        this.secondFormGroup.get(docType)?.setValue(null);
        break;
    }
  }

}

