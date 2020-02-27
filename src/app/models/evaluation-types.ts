export interface EvaluationType {
  value: string;
  viewValue: string;
}

export const EVALUATION_TYPES: EvaluationType[] = [
  { value: 'PRUEBA', viewValue: 'Prueba' },
  { value: 'EXAMEN', viewValue: 'Exámen' },
  { value: 'DISERTACION', viewValue: 'Disertación' },
  { value: 'TRABAJO_GRUPAL', viewValue: 'Trabajo Grupal' },
  { value: 'OTRO', viewValue: 'Otro' },
]