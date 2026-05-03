import Link from "next/link";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import { notFound } from "next/navigation";
import StrapiContent from "@/components/StrapiContent";

export default async function BlogPostDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const response = await fetchStrapi('blogs', `filters[Slug][$eq]=${slug}&populate=*`);
  const post = response?.data?.[0];

  if (!post) {
    notFound();
  }

  // Strapi 5 Mapping
  const title = post.title;
  const contenido = post.Contenido;
  const publishedAt = post.publishedAt;
  const descripcion = post.Descripcion;
  const portada = post.Portada;

  const coverUrl = getStrapiMedia(portada?.url);

  return (
    <div className="bg-neutral-main min-h-screen pb-24">

      {coverUrl && (
        <section className="">
          <div className="w-full mx-auto h-[500px] overflow-hidden relative shadow-2xl bg-neutral-200">
            <Image
              src={coverUrl}
              alt={title || "Cover image"}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </section>
      )}

      <section className="pt-24 pb-16 px-6 text-reveal">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <Link href="/blog" className="text-primary-main font-bold text-sm flex items-center gap-2 hover:translate-x-[-4px] transition-transform w-fit">
            ← Volver al blog
          </Link>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-6xl font-serif text-neutral-900 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-neutral-500 text-sm">
              <span>Por Academia Haru</span>
              <span>•</span>
              <span>{publishedAt ? new Date(publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Reciente'}</span>
            </div>
          </div>
        </div>
      </section>



      <section className="px-6">
        <article className="max-w-3xl mx-auto">
          {descripcion && (
            <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed font-medium mb-12 border-l-4 border-primary-main pl-6 italic">
              {descripcion}
            </p>
          )}

          <div className="text-neutral-600 leading-loose space-y-6 text-lg">
            <StrapiContent content={contenido} />
          </div>
        </article>
      </section>
    </div>
  );
}
