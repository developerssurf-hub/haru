import React from 'react';
import { getEffectiveRole } from '@/lib/user';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchStrapi, getStrapiMedia } from '@/lib/strapi';
import Link from 'next/link';
import Image from 'next/image';

export default async function GestionBlogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined } }) {
  const role = await getEffectiveRole();

  if (role !== 'Directora') {
    return redirect('/campus');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return redirect('/login');
  }

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const currentTab = (resolvedSearchParams?.tab as string) || 'blog';

  const response = await fetchStrapi('blogs', 'populate=*', token);
  const allBlogs = response?.data || [];

  const blogs = allBlogs.filter((post: any) => {
    if (currentTab === 'gramatica') {
      return post.Tag === 'gramatica';
    }
    return !post.Tag || post.Tag === 'blog';
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Blog</h1>
            <p className="text-gray-600 mt-1">Administra los artículos y consejos gramaticales de la academia.</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/campus/gestion-blog/nuevo"
              className="px-8 py-4 rounded-full font-bold text-white shadow-xl transition-all flex items-center gap-2 bg-pink-600 hover:bg-pink-700 hover:shadow-2xl hover:-translate-y-1"
            >
              + Crear Artículo
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <Link
              href="/campus/gestion-blog?tab=blog"
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${currentTab === 'blog'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Artículos de Blog
            </Link>
            <Link
              href="/campus/gestion-blog?tab=gramatica"
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${currentTab === 'gramatica'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Consejos Gramaticales
            </Link>
          </nav>
        </div>

        {blogs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay artículos creados</h3>
            <p className="text-gray-500 mb-6">Comienza creando tu primer contenido para esta sección.</p>
            <Link
              href="/campus/gestion-blog/nuevo"
              className="text-primary-main font-medium hover:text-primary-800"
            >
              Ir a crear artículo →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((post: any) => {
              const attrs = post.attributes || post;
              const title = attrs.title || 'Sin Título';
              const id = post.documentId || post.id;
              const publishedAt = attrs.publishedAt;
              const miniatura = attrs.Miniatura;

              let imageUrl = null;
              if (miniatura) {
                if (Array.isArray(miniatura)) imageUrl = miniatura[0]?.url || miniatura[0]?.attributes?.url;
                else if (miniatura.data) imageUrl = miniatura.data.url || miniatura.data.attributes?.url;
                else imageUrl = miniatura.url || miniatura.attributes?.url;
              }
              const thumbUrl = getStrapiMedia(imageUrl);

              return (
                <div key={id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                  <div className="relative aspect-video bg-gray-100">
                    {thumbUrl ? (
                      <Image src={thumbUrl} alt={title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{title}</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {publishedAt ? new Date(publishedAt).toLocaleDateString('es-ES') : 'Borrador'}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                      <Link
                        href={`/blog/${attrs.Slug}`}
                        target="_blank"
                        className="text-center flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/campus/gestion-blog/${id}/editar`}
                        className="text-center flex-1 bg-primary-50 border border-primary-200 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                      >
                        Editar
                      </Link>
                    </div>
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
