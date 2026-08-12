import React from 'react';
import { getEffectiveRole } from '@/lib/user';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAllIntentos, getProgramas } from '@/lib/api/examenes';
import Link from 'next/link';

export default async function ResultadosExamenesPage() {
  const role = await getEffectiveRole();
  
  if (role !== 'Directora') {
    return redirect('/campus');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return redirect('/login');
  }

  const [intentosRes, programasRes] = await Promise.all([
    getAllIntentos(token),
    getProgramas(token)
  ]);

  const intentos = intentosRes?.data || [];
  const programas = programasRes?.data || [];

  // Type definitions
  type AlumnoInfo = { id: number, nombre: string, email: string };
  type ExamenInfo = { id: number, titulo: string };
  type Metric = {
    intentos: number;
    puntajes: number[];
    max: number;
    min: number;
    promedio: number;
    aprobado: boolean;
    intentoAprobacion: number | null;
  };

  // Grouped structure: ProgramId -> AlumnoId -> ExamenId -> Metric
  const groupedData: Record<number, {
    programaNombre: string;
    alumnos: Record<number, {
      alumno: AlumnoInfo;
      examenes: Record<number, {
        examen: ExamenInfo;
        metric: Metric;
      }>
    }>
  }> = {};

  // Initialize programs
  programas.forEach((p: any) => {
    groupedData[p.id] = {
      programaNombre: p.attributes?.Nombre || p.Nombre || `Programa ${p.id}`,
      alumnos: {}
    };
  });

  intentos.forEach((intento: any) => {
    const attrs = intento.attributes || intento;
    const alumnoObj = attrs.alumno?.data?.attributes || attrs.alumno;
    const examenObj = attrs.examen?.data?.attributes || attrs.examen;

    if (!alumnoObj || !examenObj) return;

    const alId = attrs.alumno?.data?.id || attrs.alumno?.id;
    const exId = attrs.examen?.data?.id || attrs.examen?.id;

    if (!alId || !exId) return;

    const alumnoInfo: AlumnoInfo = {
      id: alId,
      nombre: alumnoObj.username || alumnoObj.email || `Alumno ${alId}`,
      email: alumnoObj.email || ''
    };

    const examenInfo: ExamenInfo = {
      id: exId,
      titulo: examenObj.titulo || `Examen ${exId}`
    };

    const puntaje = attrs.puntaje || 0;
    
    const examenProgramas = examenObj.programas?.data || examenObj.programas || [];
    // User relation to program might be called "programa" or "programas"
    let alumnoProgramasData = alumnoObj.programa || alumnoObj.programas;
    if (alumnoProgramasData?.data) {
      alumnoProgramasData = Array.isArray(alumnoProgramasData.data) ? alumnoProgramasData.data : [alumnoProgramasData.data];
    } else if (!Array.isArray(alumnoProgramasData)) {
      alumnoProgramasData = alumnoProgramasData ? [alumnoProgramasData] : [];
    }
    const alumnoProgramas = alumnoProgramasData || [];

    const exProgIds = examenProgramas.map((p: any) => p.id);
    const alProgIds = alumnoProgramas.map((p: any) => p.id);
    
    // Alumno takes exam. Find programs they both share. 
    // If no programs share, maybe fallback to the exam's programs.
    let commonProgIds = exProgIds.filter((id: number) => alProgIds.includes(id));
    
    if (commonProgIds.length === 0) {
      commonProgIds = exProgIds;
    }
    if (commonProgIds.length === 0) {
      commonProgIds = alProgIds;
    }

    commonProgIds.forEach((progId: number) => {
      if (!groupedData[progId]) {
        groupedData[progId] = {
          programaNombre: `Programa ${progId}`,
          alumnos: {}
        };
      }

      const progGroup = groupedData[progId];
      
      if (!progGroup.alumnos[alumnoInfo.id]) {
        progGroup.alumnos[alumnoInfo.id] = {
          alumno: alumnoInfo,
          examenes: {}
        };
      }

      const alGroup = progGroup.alumnos[alumnoInfo.id];

      if (!alGroup.examenes[examenInfo.id]) {
        alGroup.examenes[examenInfo.id] = {
          examen: examenInfo,
          metric: {
            intentos: 0,
            puntajes: [],
            max: -1,
            min: 101,
            promedio: 0,
            aprobado: false,
            intentoAprobacion: null
          }
        };
      }

      const m = alGroup.examenes[examenInfo.id].metric;
      m.intentos++;
      m.puntajes.push(puntaje);
      if (puntaje > m.max) m.max = puntaje;
      if (puntaje < m.min) m.min = puntaje;
      const passingScore = examenObj.porcentaje_aprobacion ?? 70;
      
      if (!m.aprobado && puntaje >= passingScore) {
        m.aprobado = true;
        m.intentoAprobacion = m.intentos;
      }

      m.promedio = Math.round(m.puntajes.reduce((a, b) => a + b, 0) / m.intentos);
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resultados de Exámenes</h1>
            <p className="text-gray-600 mt-1">Métricas y desempeño de los alumnos por programa.</p>
          </div>
          <Link 
            href="/campus/gestion-examenes" 
            className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-50 shadow-sm transition-colors"
          >
            Volver a Gestión
          </Link>
        </div>

        {Object.values(groupedData).map((progData, idx) => {
          const hasAlumnos = Object.keys(progData.alumnos).length > 0;
          if (!hasAlumnos) return null;

          return (
            <div key={idx} className="mb-12">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4 pb-2 border-b-2 border-indigo-100">{progData.programaNombre}</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Alumno</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Examen</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Intentos</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Max</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Min</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Promedio</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Estado</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">Aprobó en</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {Object.values(progData.alumnos).map(alData => (
                        Object.values(alData.examenes).map(exData => {
                          const m = exData.metric;
                          return (
                            <tr key={`${alData.alumno.id}-${exData.examen.id}`} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                {alData.alumno.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                {exData.examen.titulo}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center text-gray-700 font-medium">
                                {m.intentos}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center text-green-700 font-bold">
                                {m.max}%
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center text-red-600 font-medium">
                                {m.min}%
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center text-indigo-700 font-bold">
                                {m.promedio}%
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center">
                                {m.aprobado ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Aprobado</span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Reprobado</span>
                                )}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center text-gray-600">
                                {m.aprobado ? `Intento #${m.intentoAprobacion}` : '-'}
                              </td>
                            </tr>
                          );
                        })
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}

        {Object.values(groupedData).every(g => Object.keys(g.alumnos).length === 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay resultados disponibles</h3>
            <p className="text-gray-500">Aún no se han registrado intentos de examen por parte de los alumnos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
