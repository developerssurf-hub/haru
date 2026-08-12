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

export async function getExamenesPorPrograma(programaId: number | string, token?: string, programName?: string) {
  const query = `populate[preguntas][populate][opciones]=true&populate[preguntas][populate][media]=true&populate[programas]=true`;
  const data = await fetchStrapi('examenes', query, token);
  
  if (data?.data) {
    const progIdStr = String(programaId);
    data.data = data.data.filter((examen: any) => {
      const attrs = examen.attributes || examen;
      const programas = attrs.programas?.data || attrs.programas || [];
      return programas.some((p: any) => {
        if (String(p.id) === progIdStr || p.documentId === progIdStr) return true;
        if (programName && p.Nombre && p.Nombre === programName) return true;
        if (programName && p.attributes?.Nombre && p.attributes.Nombre === programName) return true;
        return false;
      });
    });
  }
  
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

export async function getAllIntentos(token: string) {
  // Fetch all attempts with related student (and their programs) and exam (and its programs)
  // Pagination limit set high to fetch all, in a real app this should be paginated
  const query = `populate[alumno][populate][programa]=true&populate[examen][populate][programas]=true&pagination[limit]=1000&sort[0]=fecha_intento:asc`;
  return await fetchStrapi('intento-examenes', query, token);
}

export async function checkPendingExams(alumnoId: string | number, programaId: string | number, token: string, programaNombre?: string): Promise<boolean> {
  try {
    // 1. Fetch exams for the program
    const examenesRes = await getExamenesPorPrograma(programaId, token, programaNombre);
    const examenes = examenesRes?.data || [];
    
    if (examenes.length === 0) return false;

    // 2. For each exam, check if it's pending
    for (const examen of examenes) {
      const attrs = examen.attributes || examen;
      const now = new Date();
      const apertura = attrs.fecha_apertura ? new Date(attrs.fecha_apertura) : null;
      const clausura = attrs.fecha_clausura ? new Date(attrs.fecha_clausura) : null;
      
      const isTooEarly = apertura && now < apertura;
      const isTooLate = clausura && now > clausura;
      
      if (isTooEarly || isTooLate) continue; // Exam not available right now

      // 3. Check attempts for this student and exam
      const intentosRes = await getIntentosPorExamen(examen.id || examen.documentId, alumnoId, token);
      const intentos = intentosRes?.data || [];
      
      const maxIntentos = attrs.max_intentos || 1;
      const passingScore = attrs.porcentaje_aprobacion ?? 70;
      
      if (intentos.length < maxIntentos) {
        // They have attempts left. Check if they already passed.
        let alreadyPassed = false;
        for (const intento of intentos) {
          const intAttrs = intento.attributes || intento;
          if ((intAttrs.puntaje || 0) >= passingScore) {
            alreadyPassed = true;
            break;
          }
        }
        
        if (!alreadyPassed) {
          // Check cooldown? If they are in cooldown they technically have an exam to take later, 
          // but let's just say if they have attempts and haven't passed, it's pending.
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking pending exams:", error);
    return false;
  }
}
