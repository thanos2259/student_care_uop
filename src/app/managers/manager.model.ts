export interface Manager {
    id: string;
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
    department_id: string;
    city: string;
    post_address: string;
    phone: string;
    mother_name: string;
    mother_last_name: string;
    location: string;
    father_name: string;
    father_last_name: string;
    country: string;
    address: string;
    mail: string;
}
