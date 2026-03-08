import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * SEO Service: manages document title and meta tags for search engines and social sharing.
 * Injected in page components to set per-page title, description, and Open Graph tags.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  /** Sets the document title (shown in browser tab and search results). */
  setPageTitle(title: string): void {
    this.title.setTitle(title);
  }

  /** Sets or updates a meta tag by name (e.g. "description", "keywords"). */
  setMeta(name: string, content: string): void {
    const selector = `name="${name}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  /**
   * Sets Open Graph tags for social sharing (Facebook, LinkedIn, etc.).
   * Use absolute URLs for imageUrl when possible for reliable previews.
   */
  setOgTags(title: string, description: string, imageUrl: string): void {
    const tags: { property: string; content: string }[] = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
    ];
    if (imageUrl) {
      tags.push({ property: 'og:image', content: imageUrl });
    }
    for (const tag of tags) {
      const selector = `property="${tag.property}"`;
      if (this.meta.getTag(selector)) {
        this.meta.updateTag(tag);
      } else {
        this.meta.addTag(tag);
      }
    }
  }
}
