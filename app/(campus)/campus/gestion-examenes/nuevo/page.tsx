import React from 'react';
import { getEffectiveRole } from '../../../../../lib/user';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { ExamenForm } from '../../../../../components/Examen/ExamenForm';

export default async function NuevoExamenPage() {
  const role = await getEffectiveRole();
  
  if (role !== 'Directora') {
    return redirect('/campus');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ExamenForm token={token} />
    </div>
  );
}
