import React from 'react';
import { getExamen, getIntentosPorExamen } from '../../../../../lib/api/examenes';
import { VistaExamen } from '../../../../../components/Examen/VistaExamen';
import { notFound, redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import { getMe } from '../../../../../lib/user';

export default async function ExamenPage({ params }: { params: Promise<{ examenId: string }> }) {
  const { examenId } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return redirect('/login');
  }

  const [data, user] = await Promise.all([
    getExamen(examenId, token),
    getMe(token)
  ]);
  
  if (!data?.data || !user) {
    return notFound();
  }

  const intentosRes = await getIntentosPorExamen(examenId, user.id, token);
  const intentos = intentosRes?.data || [];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <VistaExamen 
          examen={data.data} 
          intentos={intentos} 
          alumnoId={user.id} 
          token={token} 
        />
      </div>
    </div>
  );
}
