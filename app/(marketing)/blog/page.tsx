import Image from "next/image";
import Link from "next/link";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined } }) {
  // Manejo compatible con Next.js 14 y 15 para searchParams
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const currentTab = (resolvedSearchParams?.tab as string) || 'blog';

  // Fetching real data from Strapi - Updated to 'blogs'
  const response = await fetchStrapi('blogs', 'populate=*');
  const allPosts = response?.data || [];

  // Filtrar posts según la pestaña activa y la etiqueta (Tag)
  const posts = allPosts.filter((post: any) => {
    if (currentTab === 'gramatica') {
      return post.Tag === 'gramatica';
    }
    // Para la pestaña 'blog', mostramos los que no tienen etiqueta o tienen 'blog'
    return !post.Tag || post.Tag === 'blog';
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Header del Blog */}
      <section className="pt-20 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <span className="text-primary-main font-bold tracking-widest uppercase text-xs">
            Bitácora de Haru
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-neutral-900 leading-tight">
            Cultura y Tradición <span className="text-primary-500 italic">Japonesa</span>
          </h1>
        </div>
      </section>

      {/* Tabs / Solapas */}
      <section className="px-6 pb-12 flex justify-center">
        <div className="inline-flex bg-neutral-100 p-1 rounded-full">
          <Link
            href="/blog?tab=blog"
            className={`px-8 py-3 rounded-full text-sm font-bold transition-colors ${currentTab === 'blog' ? 'bg-white shadow-sm text-primary-main' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Cultura
          </Link>
          <Link
            href="/blog?tab=gramatica"
            className={`px-8 py-3 rounded-full text-sm font-bold transition-colors ${currentTab === 'gramatica' ? 'bg-white shadow-sm text-primary-main' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Consejos Gramaticales
          </Link>
        </div>
      </section>

      {/* Grid de Artículos */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post: any) => {
              // Extraemos atributos (Strapi 5 tiene los campos directamente en post)
              const title = post.title;
              const descripcion = post.Descripcion;
              const slug = post.Slug;
              const publishedAt = post.publishedAt;

              // SIGUIENDO TU JSON: post.Miniatura.url
              // Pero lo hacemos robusto para Strapi 5 (puede ser objeto, array o con wrapper data)
              const miniatura = post.Miniatura;

              // Intentamos obtener la URL de varias formas comunes en Strapi
              let imageUrl = null;

              if (miniatura) {
                if (Array.isArray(miniatura)) {
                  imageUrl = miniatura[0]?.url || miniatura[0]?.attributes?.url;
                } else if (miniatura.data) {
                  imageUrl = miniatura.data.url || miniatura.data.attributes?.url;
                } else {
                  imageUrl = miniatura.url || miniatura.attributes?.url;
                }
              }

              const thumbUrl = getStrapiMedia(imageUrl);

              return (
                <article
                  key={post.id}
                  className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col border border-neutral-100"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={title || "Blog image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 italic bg-neutral-100">
                        <span className="text-[10px]">Sin Imagen</span>
                        {/* Debug opcional para ti: <span className="text-[8px]">{JSON.stringify(imageUrl)}</span> */}
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1 gap-4">
                    <p className="text-xs font-semibold text-neutral-500 tracking-wider">
                      {publishedAt ? new Date(publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Reciente'}
                    </p>
                    <h2 className="text-2xl font-serif text-neutral-900 leading-tight group-hover:text-primary-main transition-colors line-clamp-2">
                      <Link href={`/blog/${slug}`}>
                        {title}
                      </Link>
                    </h2>
                    <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                      {descripcion}
                    </p>
                    <div className="mt-auto pt-6 border-t border-neutral-50">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-primary-main font-bold text-sm flex items-center gap-2 group/link"
                      >
                        Leer artículo
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <span className="text-4xl text-neutral-300">🌸</span>
              <p className="text-neutral-500 italic">Cargando artículos desde la bitácora...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
