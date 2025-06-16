// models/PacienteModel.js
export const pacienteModel = {
  email: '',
  username: '',
  password: '',
  full_name: '',
  birth_date: '',
  gender: '',
  nationality: '',
  address: '',
  phone_number: '',
  cpf: '',
  rg: '',
  patient_name: '',
  diagnosis_id: '',
  diagnosis_name: '',
  patient_birth_date: '',
  patient_gender: '',
  patient_nationality: '',
  patient_cpf: '',
  patient_rg: '',
  agreement_card: '',
  sus_card: '',
  medical_history: '',
  allergies: '',
  medication_in_use: '',
  familiar_history: '',
  first_consultation: '',
  observations: '',
  consent_form: false,
  authorization_to_share_data: false
};

export const criarPacienteVazio = () => ({
  ...pacienteModel
});

