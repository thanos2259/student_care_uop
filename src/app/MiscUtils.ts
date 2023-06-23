import Swal from 'sweetalert2';

export abstract class Utils {

  public static reformatDateToEULocaleStr(date: Date): string {
    let newDate = new Date(date);
    return (newDate.getDate()) + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear();
  }

  public static onSaveApplication() {
    Swal.fire({
      title: 'Αίτηση',
      text: 'Η αίτησή σας καταχωρήθηκε, θα γίνει ο έλεγχος για το αν πληρείτε τις προϋποθέσεις',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  public static onSave() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  public static onFileUpload() {
    Swal.fire({
      title: 'Ανέβασμα αρχείου',
      text: 'Το αρχείο σας ανέβηκε επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  public static onFileLengthError() {
    Swal.fire({
      title: 'Ανέβασμα αρχείου',
      text: 'Το αρχείο σας δεν ανέβηκε επειδή το όνομα του περιέχει περισσότερους από 100 χαρακτήρες',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  public static onSaveAndReload() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      // Reload the Page
      // To be changed in the future refresh strategy is not good
      location.reload();
    });
  }

  public static onError() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Μη έγκυρος τύπος αρχείων. Υποστηριζόμενος τύπος αρχέιων: .pdf',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  public static reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;
    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);
    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

  public static getPreferredTimestamp(dateParam: string | number | Date): string {
    let dateVal = new Date(dateParam);
    let preferredTimestamp = dateVal.toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    return preferredTimestamp;
  }

  public static getCurrentYear() {
    return new Date().getFullYear();
  }

  public static getRegistrationNumber(str: string): string {
    let registrationNumber = [''];
    if (str.indexOf('/') == -1) {
      registrationNumber = str.split(":");
      return registrationNumber[8];
    } else {
      registrationNumber = str.split("/");
      return registrationNumber[1];
    }
  }

  public static FamilyState = {
    UnmarriedStudentUnder25: 'Άγαμος φοιτητής/φοιτήτρια κάτω των 25 ετών',
    MarriedStudent: 'Έγγαμος φοιτητής/φοιτήτρια',
    UnmarriedStudentOver25: 'Άγαμος φοιτητής/φοιτήτρια άνω των 25 ετών'
  }

  public static calculateIncomeLimitForMealEligibility(appInfo): number {
    let incomeLimit = 25000;
    try {
      // console.log(appInfo);
      // const appInfo = getApplicationInfoByAppId(appId);
      const familyState = appInfo.family_state;

      if (familyState === this.FamilyState.UnmarriedStudentUnder25) {
        incomeLimit = 45000;
        const siblings = Number(appInfo.protected_members);
        const siblingStudents = Number(appInfo.siblings_students);

        for (let i = 1; i < siblings; i++) {
          incomeLimit += 5000;
        }

        for (let i = 0; i < siblingStudents; i++) {
          incomeLimit += 3000;
        }
      } else if (familyState === this.FamilyState.MarriedStudent) {
        incomeLimit = 45000;
        const kids = Number(appInfo.children);

        for (let i = 0; i < kids; i++) {
          incomeLimit += 5000;
        }
      } else if (familyState === this.FamilyState.UnmarriedStudentOver25) {
        incomeLimit = 25000;
      }

      return incomeLimit;
    } catch (error) {
      console.error('Error while updating application notes status' + error.message);
      throw Error('Error while updating application notes status');
    }
  };

  public static calculateIncomeLimitForAccommodationEligibility(appInfo): number {
    let incomeLimit = 30000;
    try {
      const familyState = appInfo.family_state;

      if (familyState === this.FamilyState.UnmarriedStudentUnder25) {
        const siblings = Number(appInfo.protected_members);

        for (let i = 1; i < siblings; i++) {
          incomeLimit += 3000;
        }

      } else if (familyState === this.FamilyState.MarriedStudent) {
        const kids = Number(appInfo.children);

        for (let i = 0; i < kids; i++) {
          incomeLimit += 3000;
        }
      } else if (familyState === this.FamilyState.UnmarriedStudentOver25) {
        incomeLimit = 30000;
      }

      return incomeLimit;
    } catch (error) {
      console.error('Error while updating application notes status' + error.message);
      throw Error('Error while updating application notes status');
    }
  };

  public static location = [
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

  public static countries = [
    { name: 'Αγία Λουκία' },
    { name: 'Άγιος Βικέντιος και Γρεναδίνες' },
    { name: 'Άγιος Μαρίνος' },
    { name: 'Άγιος Μαρτίνος (Ολλανδία)' },
    { name: 'Άγιος Χριστόφορος και Νέβις' },
    { name: 'Αζερμπαϊτζάν' },
    { name: 'Αίγυπτος' },
    { name: 'Αιθιοπία' },
    { name: 'Αϊτή' },
    { name: 'Ακτή Ελεφαντοστού' },
    { name: 'Αλβανία' },
    { name: 'Αλγερία' },
    { name: 'Αμπχαζία' },
    { name: 'Ανατολικό Τιμόρ' },
    { name: 'Ανγκόλα' },
    { name: 'Ανδόρρα' },
    { name: 'Αντίγκουα και Μπαρμπούντα' },
    { name: 'Αργεντινή' },
    { name: 'Αρμενία' },
    { name: 'Αρούμπα' },
    { name: 'Δημοκρατία του Αρτσάχ' },
    { name: 'Αυστραλία' },
    { name: 'Αυστρία' },
    { name: 'Αφγανιστάν' },
    { name: 'Βανουάτου' },
    { name: 'Βατικανό' },
    { name: 'Βέλγιο' },
    { name: 'Βενεζουέλα' },
    { name: 'Βερμούδες' },
    { name: 'Βιετνάμ' },
    { name: 'Βολιβία' },
    { name: 'Βόρεια Ιρλανδία' },
    { name: 'Βόρεια Μακεδονία' },
    { name: 'Βοσνία και Ερζεγοβίνη' },
    { name: 'Βουλγαρία' },
    { name: 'Βραζιλία' },
    { name: 'Γαλλία' },
    { name: 'Γερμανία' },
    { name: 'Γεωργία' },
    { name: 'Γκάμπια' },
    { name: 'Γκαμπόν' },
    { name: 'Γκάνα' },
    { name: 'Γουατεμάλα' },
    { name: 'Γουιάνα' },
    { name: 'Γουινέα' },
    { name: 'Γουινέα-Μπισσάου' },
    { name: 'Γρενάδα' },
    { name: 'Γροιλανδία' },
    { name: 'Δανία' },
    { name: 'Δομινικανή Δημοκρατία' },
    { name: 'Δημοκρατία της Σαχάρας' },
    { name: 'Ελ Σαλβαδόρ' },
    { name: 'Ελβετία' },
    { name: 'Ελλάδα' },
    { name: 'Ερυθραία' },
    { name: 'Εσθονία' },
    { name: 'Εσουατίνι' },
    { name: 'Ζάμπια' },
    { name: 'Ζιμπάμπουε' },
    { name: 'Ηνωμένα Αραβικά Εμιράτα' },
    { name: 'ΗΠΑ' },
    { name: 'Ηνωμένο Βασίλειο' },
    { name: 'Ιαπωνία' },
    { name: 'Ινδία' },
    { name: 'Ινδονησία' },
    { name: 'Ιορδανία' },
    { name: 'Ιράκ' },
    { name: 'Ιράν' },
    { name: 'Ιρλανδία' },
    { name: 'Ισημερινή Γουινέα' },
    { name: 'Ισημερινός' },
    { name: 'Ισλανδία' },
    { name: 'Ισπανία' },
    { name: 'Ισραήλ' },
    { name: 'Ιταλία' },
    { name: 'Καζακστάν' },
    { name: 'Καμερούν' },
    { name: 'Καμπότζη' },
    { name: 'Καναδάς' },
    { name: 'Κατάρ' },
    { name: 'Κεντροαφρικανική Δημοκρατία' },
    { name: 'Κένυα' },
    { name: 'Κίνα' },
    { name: 'Κιργιζία' },
    { name: 'Κιριμπάτι' },
    { name: 'Κολομβία' },
    { name: 'Κομόρες' },
    { name: 'Δημοκρατία του Κονγκό' },
    { name: 'Λαϊκή Δημοκρατία του Κονγκό' },
    { name: 'Βόρεια Κορέα' },
    { name: 'Νότια Κορέα' },
    { name: 'Κόστα Ρίκα' },
    { name: 'Κόσοβο' },
    { name: 'Κούβα' },
    { name: 'Κουβέιτ' },
    { name: 'Νήσοι Κουκ' },
    { name: 'Κουρασάο' },
    { name: 'Κροατία' },
    { name: 'Κύπρος' },
    { name: 'Λάος' },
    { name: 'Λεσότο' },
    { name: 'Λετονία' },
    { name: 'Λευκορωσία' },
    { name: 'Λίβανος' },
    { name: 'Λιβερία' },
    { name: 'Λιβύη' },
    { name: 'Λιθουανία' },
    { name: 'Λίχτενσταϊν' },
    { name: 'Λουξεμβούργο' },
    { name: 'Μαδαγασκάρη' },
    { name: 'Μαλαισία' },
    { name: 'Μαλάουι' },
    { name: 'Μαλδίβες' },
    { name: 'Μάλι' },
    { name: 'Μάλτα' },
    { name: 'Μαρόκο' },
    { name: 'Μαυρίκιος' },
    { name: 'Μαυριτανία' },
    { name: 'Μαυροβούνιο' },
    { name: 'Μεξικό' },
    { name: 'Μιανμάρ' },
    { name: 'Μικρονησία' },
    { name: 'Μογγολία' },
    { name: 'Μοζαμβίκη' },
    { name: 'Μολδαβία' },
    { name: 'Μονακό' },
    { name: 'Μπανγκλαντές' },
    { name: 'Μπαρμπάντος' },
    { name: 'Μπαχάμες' },
    { name: 'Μπαχρέιν' },
    { name: 'Μπελίζ' },
    { name: 'Μπενίν' },
    { name: 'Μποτσουάνα' },
    { name: 'Μπουρκίνα Φάσο' },
    { name: 'Μπουρούντι' },
    { name: 'Μπουτάν' },
    { name: 'Μπρουνέι' },
    { name: 'Ναμίμπια' },
    { name: 'Ναουρού' },
    { name: 'Νέα Ζηλανδία' },
    { name: 'Νεπάλ' },
    { name: 'Νήσοι Μάρσαλ' },
    { name: 'Νήσοι Σολομώντα' },
    { name: 'Νίγηρας' },
    { name: 'Νιγηρία' },
    { name: 'Νικαράγουα' },
    { name: 'Νιούε' },
    { name: 'Νορβηγία' },
    { name: 'Νότια Αφρική' },
    { name: 'Νότια Οσσετία' },
    { name: 'Νότιο Σουδάν' },
    { name: 'Ολλανδία' },
    { name: 'Ομάν' },
    { name: 'Ονδούρα' },
    { name: 'Ουαλία' },
    { name: 'Ουγγαρία' },
    { name: 'Ουγκάντα' },
    { name: 'Ουζμπεκιστάν' },
    { name: 'Ουκρανία' },
    { name: 'Ουρουγουάη' },
    { name: 'Πακιστάν' },
    { name: 'Παλάου' },
    { name: 'Κράτος της Παλαιστίνης' },
    { name: 'Παναμάς' },
    { name: 'Παπούα Νέα Γουινέα' },
    { name: 'Παραγουάη' },
    { name: 'Περού' },
    { name: 'Πολωνία' },
    { name: 'Πορτογαλία' },
    { name: 'Πράσινο Ακρωτήριο' },
    { name: 'Ρουάντα' },
    { name: 'Ρουμανία' },
    { name: 'Ρωσία' },
    { name: 'Σαμόα' },
    { name: 'Σάο Τομέ και Πρίνσιπε' },
    { name: 'Σαουδική Αραβία' },
    { name: 'Σενεγάλη' },
    { name: 'Σερβία' },
    { name: 'Σεϋχέλλες' },
    { name: 'Σιγκαπούρη' },
    { name: 'Σιέρα Λεόνε' },
    { name: 'Σκωτία' },
    { name: 'Σλοβακία' },
    { name: 'Σλοβενία' },
    { name: 'Σομαλία' },
    { name: 'Σομαλιλάνδη' },
    { name: 'Σουδάν' },
    { name: 'Σουηδία' },
    { name: 'Σουρινάμ' },
    { name: 'Σρι Λάνκα' },
    { name: 'Συρία' },
    { name: 'Ταϊβάν' },
    { name: 'Ταϊλάνδη' },
    { name: 'Τανζανία' },
    { name: 'Τατζικιστάν' },
    { name: 'Τζαμάικα' },
    { name: 'Τζιμπουτί' },
    { name: 'Τόγκο' },
    { name: 'Τόνγκα' },
    { name: 'Τουβαλού' },
    { name: 'Τουρκία' },
    { name: 'Τουρκμενιστάν' },
    { name: 'Τρίνινταντ και Tομπάγκο' },
    { name: 'Τσαντ' },
    { name: 'Τσεχία' },
    { name: 'Τυνησία' },
    { name: 'Υεμένη' },
    { name: 'Υπερδνειστερία' },
    { name: 'Νήσοι Φερόες' },
    { name: 'Φιλιππίνες' },
    { name: 'Φινλανδία' },
    { name: 'Φίτζι' },
    { name: 'Χιλή' },
  ]

  public static departmentsMap = {
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

  public static citiesDepartmentsMap =
    [
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
      { depId: "411", name: "ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ", city: 'ΝΑΥΠΛΙΟ' },
    ];

  public static mapFilesMealsModelToFilenames = {
    'eka8aristiko': 'fileEka8aristiko',
    'oikogeneiakhKatastasi': 'fileOikogeneiakhKatastasi',
    'pistopoihtikoGoneaFoithth': 'filePistopoihtikoGoneaFoithth',
    'tautotita': 'fileTautotita',
    'toposMonimhsKatoikias': 'fileToposMonimhsKatoikias',
    'ypeu8unhDilosi': 'fileYpeu8unhDilosi',
    'polutekneia': 'filePolutekneia',
    'bebaioshSpoudonAderfwn': 'fileBebaioshSpoudonAderfwn',
    'agamhMhtera': 'fileAgamhMhtera',
    'AMEA': 'fileAMEA',
    'AMEAIatrikhGnomateush': 'fileAMEAIatrikhGnomateush',
    'lhksiarxikhPrakshThanatouGoneaA': 'fileLhksiarxikhPrakshThanatouGoneaA',
    'lhksiarxikhPrakshThanatouGoneaB': 'fileLhksiarxikhPrakshThanatouGoneaB',
    'goneisAMEA': 'fileGoneisAMEA',
    'goneisAMEAIatrikhGnomateush': 'fileGoneisAMEAIatrikhGnomateush',
    'goneisThumataTromokratias1': 'fileGoneisThumataTromokratias1',
    'goneisThumataTromokratias2': 'fileGoneisThumataTromokratias2',
    'bebaioshEpidothsdhsAnergeias': 'fileBebaioshEpidothsdhsAnergeias',
    'diazevgmenoiGoneis1': 'fileDiazevgmenoiGoneis1',
    'diazevgmenoiGoneis2': 'fileDiazevgmenoiGoneis2'
  };

  public static mapFilesAccommodationModelToFilenames = {
    'oikogeneiakhKatastasi': 'fileOikogeneiakhKatastasi',
    'pistopoihtikoGoneaFoithth': 'filePistopoihtikoGoneaFoithth',
    'tautotita': 'fileTautotita',
    'toposMonimhsKatoikias': 'fileToposMonimhsKatoikias',
    'ypeu8unhDilosi': 'fileYpeu8unhDilosi',
    'polutekneia': 'filePolutekneia',
    'bebaioshSpoudonAderfwn': 'fileBebaioshSpoudonAderfwn',
    'agamhMhtera': 'fileAgamhMhtera',
    'AMEA': 'fileAMEA',
    'AMEAIatrikhGnomateush': 'fileAMEAIatrikhGnomateush',
    'lhksiarxikhPrakshThanatouGoneaA': 'fileLhksiarxikhPrakshThanatouGoneaA',
    'lhksiarxikhPrakshThanatouGoneaB': 'fileLhksiarxikhPrakshThanatouGoneaB',
    'goneisAMEA': 'fileGoneisAMEA',
    'goneisAMEAIatrikhGnomateush': 'fileGoneisAMEAIatrikhGnomateush',
    'goneisThumataTromokratias1': 'fileGoneisThumataTromokratias1',
    'goneisThumataTromokratias2': 'fileGoneisThumataTromokratias2',
    'bebaioshEpidothsdhsAnergeias': 'fileBebaioshEpidothsdhsAnergeias',
    'diazevgmenoiGoneis1': 'fileDiazevgmenoiGoneis1',
    'diazevgmenoiGoneis2': 'fileDiazevgmenoiGoneis2',
    "epidosi": "fileEpidosi",
    "vevaiwshSpoudwn": "fileVevaiwshSpoudwn",
    "stratos": "fileStratos",
    "ypotrofeia": "fileYpotrofeia",
    "aporia": "fileAporia",
    "diavathrio": "fileDiavathrio",
    "pistopoihtikoAlodapou": "filePistopoihtikoAlodapou",
    "ekkatharistikoAllodapou": "fileEkkatharistikoAllodapou"
  }

  public static getDepartmentsIdsByCity(cityName: string) {
    return Utils.citiesDepartmentsMap.filter(department => department.city === cityName)
                                     .map(department => department.depId);
  }

  public static getCityByDepartmentId(departmentId: string) {
    return Utils.citiesDepartmentsMap.filter(department => department.depId == departmentId)
                                     .map(department => department.city)
  }

  public static sortArrayOfDepartments(array: any) {
    return array.sort((itemA, itemB) => {
      const cityA = Utils.getCityByDepartmentId(itemA.department_id).toString();
      const cityB = Utils.getCityByDepartmentId(itemB.department_id).toString();
      return cityA.localeCompare(cityB, 'el');
    });
  }
}
