const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_REQUEST_TIMEOUT_MS = 12000;

function buildUrl(path, params = {}) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = TMDB_BASE_URL.endsWith('/') ? TMDB_BASE_URL : `${TMDB_BASE_URL}/`;
  const url = new URL(normalizedPath, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function request(path, params = {}) {
  const url = buildUrl(path, {
    ...params,
    api_key: TMDB_API_KEY,
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), TMDB_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `TMDb request failed with status ${response.status}${errorText ? `: ${errorText}` : ''}`,
      );
    }

    return response.json();
  } catch (requestError) {
    if (requestError.name === 'AbortError') {
      throw new Error('TMDb request timed out.');
    }

    throw requestError;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function getImageUrl(path, size = 'w500') {
  if (!path) {
    return '';
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getTrendingMovies(timeWindow = 'week') {
  return request(`/trending/movie/${timeWindow}`);
}

export function searchMovies(query) {
  return request('/search/movie', { query });
}

export function getMovieDetails(movieId) {
  return request(`/movie/${movieId}`);
}

export function getMovieReviews(movieId) {
  return request(`/movie/${movieId}/reviews`);
}