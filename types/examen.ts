export interface Opcion {
  id: number;
  texto: string;
  es_correcta: boolean;
}

export interface Media {
  id: number;
  url: string;
  mime: string;
  name: string;
}

export interface Pregunta {
  id: number;
  enunciado: string;
  tipo: 'multiple_choice' | 'true_false';
  opciones: Opcion[];
  media?: {
    data: {
      id: number;
      attributes: Media;
    } | null;
  };
}

export interface Examen {
  id: number;
  attributes: {
    titulo: string;
    descripcion: string;
    preguntas: Pregunta[];
  };
}
