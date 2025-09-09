import { cache } from 'react';
import { getSSRBlazeBlogClient, SiteConfig } from './blazeblog';

export const getCachedSiteConfig = cache(async (): Promise<SiteConfig | null> => {
  try {
    const client = await getSSRBlazeBlogClient();
    const config = await client.getSiteConfig();
    return config;
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return null;
  }
});
