import { fetchStrapi, postStrapi, putStrapi } from '../strapi';

export async function createExamen(data: any, token: string) {
  return await postStrapi('examenes', data, token);
}

export async function updateExamen(id: number | string, data: any, token: string) {
  return await putStrapi('examenes', id, data, token);
}

export async function getProgramas(token?: string) {
  return await fetchStrapi('programas', 'fields[0]=Nombre&fields[1]=id', token);
}

export async function getExamenes(token?: string) {
  // En Strapi v5 no se debe usar =* en campos media, mejor especificar true o listar en array
  const query = 'populate[preguntas][populate][opciones]=true&populate[preguntas][populate][media]=true&populate[programas]=true';
  const data = await fetchStrapi('examenes', query, token);
  return data;
}

export async function getExamen(id: number | string, token?: string) {
  const query = 'populate[preguntas][populate][opciones]=true&populate[preguntas][populate][media]=true&populate[programas]=true';
  const data = await fetchStrapi(`examenes/${id}`, query, token);
  return data;
}

export async function getExamenesPorPrograma(programaId: number | string, token?: string) {
  const query = `filters[programas][id][$eq]=${programaId}&populate[preguntas][populate][opciones]=true&populate[preguntas][populate][media]=true&populate[programas]=true`;
  const data = await fetchStrapi('examenes', query, token);
  return data;
}

export async function createIntento(data: any, token: string) {
  return await postStrapi('intento-examenes', data, token);
}

export async function getIntentosPorExamen(examenId: string | number, alumnoId: string | number, token: string) {
  // Strapi v5 filter syntax to get attempts for a specific exam and student
  const query = `filters[examen][id][$eq]=${examenId}&filters[alumno][id][$eq]=${alumnoId}&sort[0]=fecha_intento:desc`;
  return await fetchStrapi('intento-examenes', query, token);
}
