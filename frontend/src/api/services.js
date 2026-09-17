import api from './axios';

// ---------- Auth ----------
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) => api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ---------- Appointments ----------
export const appointmentApi = {
  getAvailability: (date) => api.get('/availability', { params: { date } }),
  create: (data) => api.post('/appointments', data),
  lookup: (appointmentId, phone) => api.get(`/appointments/lookup/${appointmentId}`, { params: { phone } }),
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status, adminNotes) => api.put(`/appointments/${id}/status`, { status, adminNotes }),
  reschedule: (id, date, timeSlot) => api.put(`/appointments/${id}/reschedule`, { date, timeSlot }),
  delete: (id) => api.delete(`/appointments/${id}`),
  getDashboardStats: () => api.get('/appointments/stats/dashboard'),
};

// ---------- Services ----------
export const serviceApi = {
  getAll: (params) => api.get('/services', { params }),
  getOne: (idOrSlug) => api.get(`/services/${idOrSlug}`),
  create: (formData) => api.post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/services/${id}`),
};

// ---------- Products ----------
export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeImage: (id, publicId) => api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`),
  delete: (id) => api.delete(`/products/${id}`),
};

// ---------- Gallery ----------
export const galleryApi = {
  getAll: (params) => api.get('/gallery', { params }),
  upload: (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/gallery/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// ---------- Testimonials ----------
export const testimonialApi = {
  getAll: (params) => api.get('/testimonials', { params }),
  create: (formData) => api.post('/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/testimonials/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// ---------- FAQs ----------
export const faqApi = {
  getAll: (params) => api.get('/faqs', { params }),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

// ---------- About / Doctor ----------
export const aboutApi = {
  get: () => api.get('/about'),
  update: (formData) => api.put('/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ---------- Homepage ----------
export const homepageApi = {
  get: () => api.get('/homepage'),
  update: (data) => api.put('/homepage', data),
  addHeroImage: (formData) => api.post('/homepage/hero-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeHeroImage: (publicId) => api.delete(`/homepage/hero-image/${encodeURIComponent(publicId)}`),
};

// ---------- Settings ----------
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  updateLogo: (formData) => api.post('/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateOgImage: (formData) => api.post('/settings/og-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ---------- Business Hours ----------
export const businessHoursApi = {
  get: () => api.get('/business-hours'),
  update: (weeklySchedule) => api.put('/business-hours', { weeklySchedule }),
};

// ---------- Appointment Settings ----------
export const appointmentSettingsApi = {
  get: () => api.get('/appointment-settings'),
  update: (data) => api.put('/appointment-settings', data),
};