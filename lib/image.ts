interface ResizeOptions {
  width: number;
  height: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

export const resizeImageUrl = (url: string, options: ResizeOptions): string => {
  if (!url) {
    return "";
  }

  const params = new URLSearchParams();
  params.append('width', options.width.toString());
  params.append('height', options.height.toString());
  if (options.fit) {
    params.append('fit', options.fit);
  }
  if (options.format) {
    params.append('format', options.format);
  }

  // Check if the URL already has query parameters
  if (url.includes('?')) {
    return `${url}&${params.toString()}`;
  } else {
    return `${url}?${params.toString()}`;
  }
};
