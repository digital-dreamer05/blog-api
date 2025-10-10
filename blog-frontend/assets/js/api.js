// API client with token refresh and helpers
const api = {
  baseUrl: (window.__API_CONFIG__ && window.__API_CONFIG__.baseUrl) || '',
  tokens: {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  },
  setTokens(at, rt) {
    if (at) { this.tokens.accessToken = at; localStorage.setItem('accessToken', at); }
    if (rt) { this.tokens.refreshToken = rt; localStorage.setItem('refreshToken', rt); }
  },
  clearTokens() { this.tokens.accessToken = ''; this.tokens.refreshToken = ''; localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); },
  async request(path, options = {}) {
    const isForm = options && options.body && typeof options.body === 'object' && typeof options.body.append === 'function';
    const baseHeaders = isForm ? {} : { 'Content-Type': 'application/json' };
    const headers = { ...baseHeaders, ...(options.headers || {}) };
    if (this.tokens.accessToken) headers['Authorization'] = `Bearer ${this.tokens.accessToken}`;
    const res = await fetch(this.baseUrl + path, { ...options, headers });
    if (res.status === 401 && this.tokens.refreshToken && !options.__retried) {
      const rt = await fetch(this.baseUrl + '/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.tokens.refreshToken}` } });
      if (rt.ok) {
        const data = await rt.json();
        if (data.accessToken) { this.setTokens(data.accessToken, this.tokens.refreshToken); return this.request(path, { ...options, __retried: true }); }
      }
      this.clearTokens();
    }
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return data;
  },
  get(path) { return this.request(path); },
  post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); },
  put(path, body) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); },
  del(path) { return this.request(path, { method: 'DELETE' }); },
  form(path, formData, method='POST') { return this.request(path, { method, body: formData }); },
};


