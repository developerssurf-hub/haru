import React from 'react';
import { getStrapiMedia } from '@/lib/strapi';

interface Block {
  type: string;
  level?: number;
  children?: { text: string; bold?: boolean; italic?: boolean; underline?: boolean }[];
  image?: { url: string; alternativeText?: string };
  format?: 'unordered' | 'ordered';
  items?: Block[];
}

export default function StrapiContent({ content }: { content: any }) {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className="strapi-content space-y-6">
      {content.map((block: Block, index: number) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-neutral-600 leading-loose text-lg">
                {block.children?.map((child, i) => (
                  <span key={i} className={`
                    ${child.bold ? 'font-bold' : ''} 
                    ${child.italic ? 'italic' : ''} 
                    ${child.underline ? 'underline' : ''}
                  `}>
                    {child.text}
                  </span>
                ))}
              </p>
            );

          case 'heading':
            const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
            const headingClass = block.level === 1 ? 'text-4xl' : block.level === 2 ? 'text-3xl' : 'text-2xl';
            return (
              <HeadingTag key={index} className={`${headingClass} font-serif text-neutral-900 mt-12 mb-6 font-bold`}>
                {block.children?.map((child, i) => child.text)}
              </HeadingTag>
            );

          case 'list':
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            const listClass = block.format === 'ordered' ? 'list-decimal' : 'list-disc';
            return (
              <ListTag key={index} className={`${listClass} pl-8 space-y-3 text-neutral-600 text-lg`}>
                {block.items?.map((item, i) => (
                  <li key={i}>
                    {item.children?.map((child, j) => child.text)}
                  </li>
                ))}
              </ListTag>
            );

          case 'image': {
            const src = getStrapiMedia(block.image?.url ?? null);
            if (!src) return null;
            return (
              <div key={index} className="my-10 rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={src}
                  alt={block.image?.alternativeText || 'Image'}
                  className="w-full h-auto"
                />
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
