export interface Application {
  id: number;
  uid: number;
  submit_date: Date;
  status: number;
  application_type: string;
  location: string;
  father_name: string;
  city: string;
  phone: string;
  category: string;
  family_income: string;
  family_state: string;
  protected_members: number;
  siblings_students: number;
  children: number;
}
