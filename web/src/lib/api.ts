/**
 * Strapi API Client
 * Build-time'da Strapi'den veri çekmek için kullanılır
 */

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_READ_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface OturmaGrubu {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  menuLabel: string | null;
  summary: string | null;
  bodyRich: any; // Strapi blocks content
  dimensions: string | null;
  materials: string | null;
  order: number;
  heroImage: StrapiImage | null;
  gallery: StrapiImage[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Tüm oturma gruplarını getir (liste için)
 */
export async function getOturmaGruplari(): Promise<{ slug: string; menuLabel: string; title: string; summary: string | null; heroImage: StrapiImage | null; order: number }[]> {
  try {
    const response = await fetchAPI<StrapiResponse<OturmaGrubu[]>>(
      '/oturma-gruplari?populate=heroImage&sort=order:asc&filters[publishedAt][$notNull]=true'
    );

    return response.data.map((item) => ({
      slug: item.slug,
      menuLabel: item.menuLabel || item.title,
      title: item.title,
      summary: item.summary,
      heroImage: item.heroImage,
      order: item.order,
    }));
  } catch (error) {
    console.error('Oturma grupları alınamadı:', error);
    return [];
  }
}

/**
 * Tekil oturma grubu getir (detay sayfası için)
 */
export async function getOturmaGrubuBySlug(slug: string): Promise<OturmaGrubu | null> {
  try {
    const response = await fetchAPI<StrapiResponse<OturmaGrubu[]>>(
      `/oturma-gruplari?filters[slug][$eq]=${slug}&populate=*`
    );

    if (response.data.length === 0) {
      return null;
    }

    return response.data[0];
  } catch (error) {
    console.error(`Oturma grubu alınamadı (${slug}):`, error);
    return null;
  }
}

/**
 * Tüm oturma grubu slug'larını getir (SSG için)
 */
export async function getAllOturmaGrubuSlugs(): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiResponse<{ slug: string }[]>>(
      '/oturma-gruplari?fields[0]=slug&filters[publishedAt][$notNull]=true'
    );

    return response.data.map((item) => item.slug);
  } catch (error) {
    console.error('Oturma grubu slug\'ları alınamadı:', error);
    return [];
  }
}

/**
 * Strapi blocks içeriğini HTML'e dönüştür
 */
export function blocksToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }

  return blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        const text = block.children?.map((child: any) => {
          let content = child.text || '';
          if (child.bold) content = `<strong>${content}</strong>`;
          if (child.italic) content = `<em>${content}</em>`;
          if (child.underline) content = `<u>${content}</u>`;
          if (child.strikethrough) content = `<s>${content}</s>`;
          if (child.code) content = `<code>${content}</code>`;
          return content;
        }).join('') || '';
        return `<p>${text}</p>`;
      
      case 'heading':
        const level = block.level || 2;
        const headingText = block.children?.map((child: any) => child.text || '').join('') || '';
        return `<h${level}>${headingText}</h${level}>`;
      
      case 'list':
        const listTag = block.format === 'ordered' ? 'ol' : 'ul';
        const listItems = block.children?.map((item: any) => {
          const itemText = item.children?.map((child: any) => child.text || '').join('') || '';
          return `<li>${itemText}</li>`;
        }).join('') || '';
        return `<${listTag}>${listItems}</${listTag}>`;
      
      case 'quote':
        const quoteText = block.children?.map((child: any) => child.text || '').join('') || '';
        return `<blockquote>${quoteText}</blockquote>`;
      
      case 'image':
        const imgUrl = block.image?.url ? `${STRAPI_URL}${block.image.url}` : '';
        const imgAlt = block.image?.alternativeText || '';
        return imgUrl ? `<figure><img src="${imgUrl}" alt="${imgAlt}" loading="lazy" />${block.image?.caption ? `<figcaption>${block.image.caption}</figcaption>` : ''}</figure>` : '';
      
      default:
        return '';
    }
  }).join('\n');
}

/**
 * Strapi görsel URL'ini tam URL'e çevir
 */
export function getStrapiImageUrl(image: StrapiImage | null, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!image) {
    return '/placeholder.jpg';
  }

  let url = image.url;
  
  if (size && image.formats?.[size]) {
    url = image.formats[size]!.url;
  }

  // Eğer URL zaten http ile başlıyorsa olduğu gibi döndür
  if (url.startsWith('http')) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}

