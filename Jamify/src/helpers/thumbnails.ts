export function extractThumbnail(thumbnails?: gapi.client.youtube.ThumbnailDetails): string | undefined {
  if (!thumbnails) {
    return "";
  }

  if (thumbnails.maxres) {
    const { maxres } = thumbnails;
    if (maxres.url) {
      return maxres.url;
    }
  } else if (thumbnails.standard) {
    const { standard } = thumbnails;
    if (standard.url) {
      return standard.url;
    }
  } else if (thumbnails.high) {
    const { high } = thumbnails;
    if (high.url) {
      return high.url;
    }
  }

  return thumbnails.default?.url;
}
