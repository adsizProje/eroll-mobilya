/**
 * Strapi API Client
 * Build-time'da Strapi'den veri cekmek icin kullanilir
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

export interface RenkVaryanti {
  id: number;
  renkAdi: string;
  renkKodu: string | null;
  gorsel: StrapiImage | null;
  resimSirasi: number;
}

export interface OturmaGrubu {
  id: number;
  documentId: string;
  baslik: string;
  slug: string;
  detayliAciklama: any; // Strapi blocks content
  anaGorsel: StrapiImage | null;
  galeriGorselleri: StrapiImage[];
  anasaydaGoster: boolean;
  renkVaryantlari: RenkVaryanti[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UrunDetayBolumu {
  bolumBaslik: string | null;
  bolumAciklama: string | null;
  bolumGorselleri: StrapiImage[];
}

export interface UstalikGorseli {
  id: number;
  gorsel: StrapiImage;
  etiket: string | null;
}

export interface AnasayfaAyarlari {
  bolumBaslik: string | null;
  bolumAciklama: string | null;
  bolumGorselleri: UstalikGorseli[];
}

export interface VideoItem {
  id: number;
  baslik: string;
  video: StrapiImage; // media type (video)
  dikeyVideo: boolean;
}

export interface HakkimizdaAyarlari {
  videolar: VideoItem[];
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
    const body = await response.text();
    let errMsg = `Strapi API error: ${response.status} ${response.statusText}`;
    try {
      const parsed = JSON.parse(body);
      if (parsed.error?.message) errMsg += ` - ${parsed.error.message}`;
    } catch {
      if (body) errMsg += ` - ${body.slice(0, 200)}`;
    }
    throw new Error(errMsg);
  }

  return response.json();
}

/**
 * Strapi blocks iceriginden ilk paragrafin metnini cikart (ozet olarak kullanilir)
 */
export function blocksToSummary(blocks: any[], maxLength: number = 160): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  for (const block of blocks) {
    if (block.type === 'paragraph' && block.children) {
      const text = block.children
        .map((child: any) => child.text || '')
        .join('')
        .trim();
      if (text) {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
      }
    }
  }

  return '';
}

/**
 * Tum oturma gruplarini getir (liste icin)
 */
export async function getOturmaGruplari(): Promise<{ slug: string; baslik: string; anaGorsel: StrapiImage | null; detayliAciklama: any }[]> {
  try {
    const response = await fetchAPI<StrapiResponse<OturmaGrubu[]>>(
      '/oturma-gruplari?populate=anaGorsel&sort=createdAt:desc&filters[publishedAt][$notNull]=true'
    );

    return response.data.map((item) => ({
      slug: item.slug,
      baslik: item.baslik,
      anaGorsel: item.anaGorsel,
      detayliAciklama: item.detayliAciklama,
    }));
  } catch (error) {
    console.error('Oturma gruplari alinamadi:', error);
    return [];
  }
}

/**
 * Anasayfada gosterilecek urunleri getir (anasaydaGoster=true)
 */
export async function getAnasaydaUrunleri(): Promise<{ slug: string; baslik: string; anaGorsel: StrapiImage | null; detayliAciklama: any }[]> {
  try {
    const response = await fetchAPI<StrapiResponse<OturmaGrubu[]>>(
      '/oturma-gruplari?populate=anaGorsel&sort=createdAt:desc&filters[publishedAt][$notNull]=true&filters[anasaydaGoster][$eq]=true'
    );

    return response.data.map((item) => ({
      slug: item.slug,
      baslik: item.baslik,
      anaGorsel: item.anaGorsel,
      detayliAciklama: item.detayliAciklama,
    }));
  } catch (error) {
    console.error('Anasayfa urunleri alinamadi:', error);
    return [];
  }
}

/**
 * Tekil oturma grubu getir (detay sayfasi icin)
 */
export async function getOturmaGrubuBySlug(slug: string): Promise<OturmaGrubu | null> {
  try {
    const response = await fetchAPI<StrapiResponse<OturmaGrubu[]>>(
      `/oturma-gruplari?filters[slug][$eq]=${encodeURIComponent(slug)}&filters[publishedAt][$notNull]=true&populate[anaGorsel]=true&populate[galeriGorselleri]=true&populate[renkVaryantlari][populate][gorsel]=true`
    );

    if (response.data.length === 0) {
      return null;
    }

    return response.data[0];
  } catch (error) {
    console.error(`Oturma grubu alinamadi (${slug}):`, error);
    return null;
  }
}

/**
 * Tum oturma grubu slug'larini getir (SSG icin)
 */
export async function getAllOturmaGrubuSlugs(): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiResponse<{ slug: string }[]>>(
      '/oturma-gruplari?fields[0]=slug&filters[publishedAt][$notNull]=true'
    );

    return response.data.map((item) => item.slug);
  } catch (error) {
    console.error('Oturma grubu slug\'lari alinamadi:', error);
    return [];
  }
}

/**
 * Urun Detay Bolumu Single Type'i getir
 */
export async function getUrunDetayBolumu(): Promise<UrunDetayBolumu | null> {
  try {
    const response = await fetchAPI<StrapiResponse<UrunDetayBolumu>>(
      '/urun-detay-bolumu?populate=bolumGorselleri'
    );

    return response.data;
  } catch (error) {
    console.error('Urun detay bolumu alinamadi:', error);
    return null;
  }
}

/**
 * Anasayfa Ayarlari Single Type'i getir
 */
export async function getAnasayfaAyarlari(): Promise<AnasayfaAyarlari | null> {
  try {
    const response = await fetchAPI<StrapiResponse<AnasayfaAyarlari>>(
      '/anasayfa-ayarlari?populate[bolumGorselleri][populate]=gorsel'
    );

    return response.data;
  } catch (error) {
    console.error('Anasayfa ayarlari alinamadi:', error);
    return null;
  }
}

/**
 * Hakkimizda Ayarlari Single Type'i getir
 */
export async function getHakkimizdaAyarlari(): Promise<HakkimizdaAyarlari | null> {
  try {
    const response = await fetchAPI<StrapiResponse<HakkimizdaAyarlari>>(
      '/hakkimizda-ayarlari?populate[videolar][populate]=video'
    );

    return response.data;
  } catch (error) {
    console.error('Hakkimizda ayarlari alinamadi:', error);
    return null;
  }
}

/**
 * Strapi blocks icerigini HTML'e donustur
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
 * Strapi gorsel URL'ini tam URL'e cevir
 */
export function getStrapiImageUrl(image: StrapiImage | null, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!image) {
    return '/placeholder.jpg';
  }

  let url = image.url;

  if (size && image.formats?.[size]) {
    url = image.formats[size]!.url;
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}
