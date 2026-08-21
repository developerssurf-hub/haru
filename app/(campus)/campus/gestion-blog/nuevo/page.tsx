import React from 'react';
import BlogForm from '@/components/Blog/BlogForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getEffectiveRole } from '@/lib/user';

export default async function NuevoBlogPage() {
  const role = await getEffectiveRole();
  if (role !== 'Directora') return redirect('/campus');

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) return redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <BlogForm token={token} />
      </div>
    </div>
  );
}
