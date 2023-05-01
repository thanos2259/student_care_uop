export interface Question {
  question_id?: number;
  department_id: number;
  receiver_role: string;
  student_id: number;
  question_text: string;
  answer_text?: string;
  date_submitted?: Date;
}
