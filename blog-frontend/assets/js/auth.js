// Auth utilities
const auth = {
  async me() { return api.get('/auth/me'); },
  async login(body) { return api.post('/auth/login', body); },
  async register(body) { return api.post('/auth/register', body); },
  async verifyOtp(body) { return api.post('/auth/verify-otp', body); },
  async logout() { api.clearTokens(); location.href = '/login.html'; },
};


