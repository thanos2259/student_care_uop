import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  public calamata = [
    { id: 'collapseOne', name: 'Αβραμόπουλος Δημήτριος', address: 'Διεύθυνση: Λακωνικής & Σφακιανάκη Καλαμάτα 24100', phone: 'τηλ: 27210-80-978', email: 'd.avramopoulos@uop.gr', cardColor: 'card-primary' },
    { id: 'collapseTwo', name: 'Μπάμπαλη Σταυρούλα', address: 'Διεύθυνση: Αντικάλαμος Μεσσηνίας Καλαμάτα Τ.Κ. 24100', phone: 'τηλ: 27210-45-190, 27210-45-171', email: 's.mpampali@uop.gr', cardColor: 'card-primary' },
    { id: 'collapseThree', name: 'Μουτάφης Ευστράτιος', address: 'Διεύθυνση: Αντικάλαμος Μεσσηνίας Καλαμάτα Τ.Κ. 24100', phone: 'τηλ: 27210-45- 346', email: 'moutafis@teikal.gr', cardColor: 'card-primary' },
    { id: 'collapseFour', name: 'Ορφανός Γεώργιος ', address: 'Διεύθυνση: Λακωνικής & Σφακιανάκη Καλαμάτα 24100', phone: 'τηλ: 27210-29-654', email: 'g.orfanos@uop.gr', cardColor: 'card-primary' },
    { id: 'collapseFive', name: 'Πατεράκης Στέφανος', address: 'Διεύθυνση: Αντικάλαμος Μεσσηνίας Καλαμάτα Τ.Κ. 24100', phone: 'τηλ. 27210-45345', email: 'paterakis@uop.gr', cardColor: 'card-primary' },
    { id: 'collapseSix', name: 'Φράγκος Λυμπέρης', address: 'Διεύθυνση: Λακωνικής & Σφακιανάκη Καλαμάτα 24100', phone: 'τηλ: 27210-29654 ', email: 'l.fragkos@uop.gr', cardColor: 'card-primary mb-5' }
  ]

  public patra = [
    { id: 'collapseSeven', name: 'Αναστασοπούλου Ιωάννα', address: 'Διεύθυνση: Μ. Αλέξανδρου 1 Κουκούλι , Πάτρα ,Τ.Κ 26334', phone: 'τηλ : 2610-369-129', email: 'ioanasta@uop.gr', cardColor: 'card-success' },
    { id: 'collapseEight', name: 'Κωνσταντακόπουλος Δημήτριος', address: 'Διεύθυνση: Μ. Αλεξάνδρου 1, Κουκούλι Πάτρα Τ.Κ. 26334', phone: 'τηλ: 2610-369-012', email: 'konstantakop@uop.gr', cardColor: 'card-success mb-5' }
  ]

  public nafplio = [
    { id: 'collapseNine', name: 'Διαβολή Κονδυλία', address: 'Διεύθυνση: Βασιλέως Κωνσταντίνου 21 Τ.Κ. 21100 Ναύπλιο', phone: 'τηλ: 27520-96-126', email: 'condil@uop.gr', cardColor: 'card-danger' },
    { id: 'collapseTen', name: 'Λάγγα Σταματία', address: 'Διεύθυνση: Τέρμα οδού Ρετάλη Άρια Ναυπλίου Τ.Κ. 21100', phone: 'τηλ: 27520-70-223', email: 'matinal@uop.gr', cardColor: 'card-danger mb-5' }
  ]


  ngOnInit(): void {

  }

}
