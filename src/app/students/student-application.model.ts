export interface StudentApplication {
  id: number;
  app_id?: number;
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
  sso_uid: number;
  student_uid: number;
  sn: string;
  givenname: string;
  edupersonaffiliation: string;
  edupersonprimaryaffiliation: string;
  edupersonorgdn: string;
  edupersonentitlement: string;
  schacpersonaluniquecode: string,
  schacyearofbirth: number;
  schacdateofbirth: string;
  schacpersonaluniqueid: string;
  schacgender?: number;
  department_id: string;
  post_address: string;
  mother_name: string;
  mother_last_name: string;
  father_last_name: string;
  country: string;
  address: string;
  mail: string;
  Grade?: number;
  Semester?: number;
  Ects?: number;
  CourseCount?: number;
}
