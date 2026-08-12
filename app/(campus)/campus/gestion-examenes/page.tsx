import React from 'react';
import { getEffectiveRole } from '@/lib/user';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getExamenes } from '@/lib/api/examenes';
import Link from 'next/link';

export default async function GestionExamenesPage() {
  const role = await getEffectiveRole();
  
  if (role !== 'Directora') {
    return redirect('/campus');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return redirect('/login');
  }

  const response = await getExamenes(token);
  const examenes = response?.data || [];
  const strapiError = response?.error;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Exámenes</h1>
            <p className="text-gray-600 mt-1">Administra los exámenes disponibles en la academia.</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/campus/gestion-examenes/resultados" 
              className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-50 shadow-sm transition-colors"
            >
              Ver Resultados
            </Link>
            <Link 
              href="/campus/gestion-examenes/nuevo" 
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors"
            >
              + Crear Examen
            </Link>
          </div>
        </div>

        {strapiError ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Error al cargar los exámenes</h3>
            <p>Strapi dice: {strapiError.message || JSON.stringify(strapiError)}</p>
          </div>
        ) : examenes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay exámenes creados</h3>
            <p className="text-gray-500 mb-6">Comienza creando el primer examen para tus alumnos.</p>
            <Link 
              href="/campus/gestion-examenes/nuevo" 
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              Ir a crear examen →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examenes.map((examen: any) => {
              // Manejo seguro tanto para respuestas planas (Strapi v5) como anidadas (Strapi v4)
              const attrs = examen.attributes || examen;
              const title = attrs.titulo || 'Sin Título';
              const id = examen.documentId || examen.id;
              const countPreguntas = attrs.preguntas?.length || 0;
              const programas = attrs.programas?.data || attrs.programas || [];

              return (
                <div key={id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  
                  <div className="flex-1 space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Preguntas:</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                        {countPreguntas}
                      </span>
                    </div>
                    
                    {programas.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium block mb-1">Asignado a:</span>
                        <div className="flex flex-wrap gap-1">
                          {programas.map((prog: any) => {
                            const pAttrs = prog.attributes || prog;
                            return (
                              <span key={prog.id} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs border border-indigo-100">
                                {pAttrs.Nombre || `Prog ${prog.id}`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex gap-3">
                    <Link 
                      href={`/campus/examenes/${id}`} 
                      className="text-center flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Ver
                    </Link>
                    <Link 
                      href={`/campus/gestion-examenes/${id}/editar`}
                      className="text-center flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
