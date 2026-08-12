import React from 'react';
import { getEffectiveRole, getMe } from '@/lib/user';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getExamenesPorPrograma, getIntentosPorExamen } from '@/lib/api/examenes';
import Link from 'next/link';

export default async function ExamenesAlumnoPage() {
  const role = await getEffectiveRole();
  const user = await getMe();
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token || !user?.id) {
    return redirect('/login');
  }

  // Si es Directora, tal vez quiera ver la gestión en lugar de esto, pero si entra, la dejamos.
  const isStudent = role === 'Alumno' || role === 'Student' || role === null; // Asumimos null es alumno también en muchos casos

  const activeProgramId = user?.programa?.id;
  const activeProgramName = user?.programa?.nombre || user?.programa?.Nombre;
  
  if (!activeProgramId) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Exámenes</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Sin programa asignado</h3>
            <p className="text-gray-500">No tienes un programa activo seleccionado para ver los exámenes.</p>
          </div>
        </div>
      </div>
    );
  }

  const examenesRes = await getExamenesPorPrograma(activeProgramId, token, activeProgramName);
  const examenes = examenesRes?.data || [];

  const examenesPendientes: any[] = [];
  const examenesCompletados: any[] = [];

  for (const examen of examenes) {
    const attrs = examen.attributes || examen;
    const now = new Date();
    const apertura = attrs.fecha_apertura ? new Date(attrs.fecha_apertura) : null;
    const clausura = attrs.fecha_clausura ? new Date(attrs.fecha_clausura) : null;
    
    const isTooEarly = apertura && now < apertura;
    const isTooLate = clausura && now > clausura;

    const intentosRes = await getIntentosPorExamen(examen.id || examen.documentId, user.id, token);
    const intentos = intentosRes?.data || [];
    
    const maxIntentos = attrs.max_intentos || 1;
    const passingScore = attrs.porcentaje_aprobacion ?? 70;
    
    let alreadyPassed = false;
    let highestScore = 0;
    for (const intento of intentos) {
      const intAttrs = intento.attributes || intento;
      const score = intAttrs.puntaje || 0;
      if (score > highestScore) highestScore = score;
      if (score >= passingScore) {
        alreadyPassed = true;
      }
    }

    const hasAttemptsLeft = intentos.length < maxIntentos;
    const isPending = !isTooEarly && !isTooLate && !alreadyPassed && hasAttemptsLeft;

    const examenData = {
      ...examen,
      intentosCount: intentos.length,
      highestScore,
      alreadyPassed,
      hasAttemptsLeft,
      isTooEarly,
      isTooLate,
      apertura,
      clausura,
      maxIntentos,
      passingScore
    };

    if (isPending) {
      examenesPendientes.push(examenData);
    } else {
      examenesCompletados.push(examenData);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Exámenes</h1>
        <p className="text-gray-600 mb-8">Evalúa tus conocimientos del programa {user.programa.nombre}</p>

        {examenesPendientes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-indigo-900 mb-4 pb-2 border-b-2 border-indigo-100">Exámenes Pendientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examenesPendientes.map((examen: any) => {
                const title = examen.attributes?.titulo || examen.titulo || 'Sin Título';
                const id = examen.documentId || examen.id;

                return (
                  <div key={id} className="bg-white rounded-xl border-2 border-indigo-100 shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                    <div className="pl-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                      <div className="space-y-2 mb-6 text-sm text-gray-600">
                        {examen.clausura && (
                          <p><strong>Cierra el:</strong> {examen.clausura.toLocaleDateString()} {examen.clausura.toLocaleTimeString()}</p>
                        )}
                        <p><strong>Intentos disponibles:</strong> {examen.maxIntentos - examen.intentosCount}</p>
                      </div>
                      <Link 
                        href={`/campus/examenes/${id}`} 
                        className="inline-block text-center w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        {examen.intentosCount > 0 ? 'Reintentar Examen' : 'Rendir Examen'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {examenesCompletados.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">Historial de Exámenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examenesCompletados.map((examen: any) => {
                const title = examen.attributes?.titulo || examen.titulo || 'Sin Título';
                const id = examen.documentId || examen.id;
                
                let statusBadge;
                if (examen.alreadyPassed) {
                  statusBadge = <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Aprobado ({examen.highestScore}%)</span>;
                } else if (!examen.hasAttemptsLeft) {
                  statusBadge = <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Sin intentos ({examen.highestScore}%)</span>;
                } else if (examen.isTooEarly) {
                  statusBadge = <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Próximamente</span>;
                } else if (examen.isTooLate) {
                  statusBadge = <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Cerrado</span>;
                } else {
                  statusBadge = <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Completado</span>;
                }

                return (
                  <div key={id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 opacity-90">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">{title}</h3>
                      <div className="shrink-0">{statusBadge}</div>
                    </div>
                    <div className="space-y-1 mb-4 text-sm text-gray-500">
                      <p>Intentos usados: {examen.intentosCount} / {examen.maxIntentos}</p>
                      {examen.isTooEarly && examen.apertura && (
                        <p>Abre el: {examen.apertura.toLocaleDateString()}</p>
                      )}
                    </div>
                    
                    {/* Para el historial, podrían querer ver la vista de resultados de su intento si está implementada, por ahora pueden ir al examen pero el sistema los bloqueará si no hay intentos */}
                    {examen.intentosCount > 0 && (
                      <Link 
                        href={`/campus/examenes/${id}`} 
                        className="inline-block text-center w-full bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {examenesPendientes.length === 0 && examenesCompletados.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm mt-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay exámenes disponibles</h3>
            <p className="text-gray-500">Aún no tienes exámenes asignados en este programa.</p>
          </div>
        )}
      </div>
    </div>
  );
}
