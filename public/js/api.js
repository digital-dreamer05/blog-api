// Simple API helper
const api = {
  baseUrl: (window.__API_CONFIG__ && window.__API_CONFIG__.baseUrl) || '',
  tokens: {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  },
  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (this.tokens.accessToken)
      headers['Authorization'] = `Bearer ${this.tokens.accessToken}`;

    const res = await fetch(this.baseUrl + path, { ...options, headers });
    if (res.status === 401 && this.tokens.refreshToken && !options.__retried) {
      const rt = await fetch(this.baseUrl + '/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.tokens.refreshToken}`,
        },
      });
      if (rt.ok) {
        const data = await rt.json();
        if (data.accessToken) {
          this.tokens.accessToken = data.accessToken;
          localStorage.setItem('accessToken', data.accessToken);
          return this.request(path, { ...options, __retried: true });
        }
      }
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  },
  get(path) {
    return this.request(path);
  },
  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  },
  put(path, body) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) });
  },
  del(path) {
    return this.request(path, { method: 'DELETE' });
  },
};
