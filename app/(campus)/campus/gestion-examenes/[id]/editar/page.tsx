import React from 'react';
import { getEffectiveRole } from '@/lib/user';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getExamen } from '@/lib/api/examenes';
import { ExamenForm } from '@/components/Examen/ExamenForm';
import Link from 'next/link';

export default async function EditarExamenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const role = await getEffectiveRole();
  
  if (role !== 'Directora') {
    return redirect('/campus');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return redirect('/login');
  }

  const response = await getExamen(id, token);
  const data = response?.data;

  if (!data) {
    return notFound();
  }
  
  const initialData = data.attributes || data;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto mb-6">
        <Link 
          href="/campus/gestion-examenes" 
          className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-2"
        >
          ← Volver a la gestión
        </Link>
      </div>
      <ExamenForm token={token} initialData={initialData} examenId={id} />
    </div>
  );
}
