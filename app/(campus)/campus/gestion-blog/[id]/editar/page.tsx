import React from 'react';
import BlogForm from '@/components/Blog/BlogForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getEffectiveRole } from '@/lib/user';

export default async function EditarBlogPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const role = await getEffectiveRole();
  if (role !== 'Directora') return redirect('/campus');

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) return redirect('/login');

  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <BlogForm token={token} blogId={id} />
      </div>
    </div>
  );
}
