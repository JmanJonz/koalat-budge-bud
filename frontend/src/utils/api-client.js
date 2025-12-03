// Centralized API client with authentication handling
const BACKEND_TARGET_URL = import.meta.env.VITE_BACKEND_TARGET_URL;

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      credentials: 'include', // Always include cookies for JWT
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      
      // Provide more specific error messages
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        return { 
          success: false, 
          error: 'Unable to connect to the server. Please check if the backend is running on port 5000.' 
        };
      }
      
      return { success: false, error: error.message };
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // --- User Endpoints ---
  async getCurrentUser() {
    return this.get('/gateways/user/current-user-info');
  }

  async login(email, password) {
    return this.post('/gateways/user/login', { email, password });
  }

  async createAccount(username, email, password) {
    return this.post('/gateways/user/create', { username, email, password });
  }

  async logout() {
    return this.post('/gateways/user/logout');
  }

  // --- Category Endpoints ---
  async getCategories() {
    return this.get('/gateways/category/get-cats');
  }

  async createCategory(categoryName, categoryType) {
    return this.post('/gateways/category/create', { categoryName, categoryType });
  }

  async deleteCategory(id) {
    return this.delete(`/gateways/category/delete/${id}`);
  }

  // --- Sub-Category Endpoints ---
  async getSubCategories(parentCatID) {
    return this.get(`/gateways/sub-cats/get-all?parentCatID=${parentCatID}`);
  }

  async createSubCategory(subCatName, parentCatID) {
    return this.post('/gateways/sub-cats/create', { subCatName, parentCatID });
  }

  async deleteSubCategory(id) {
    return this.delete(`/gateways/sub-cats/delete/${id}`);
  }

  // --- Transaction Endpoints ---
  async createTransaction(transactionData) {
    return this.post('/gateways/transaction/create', transactionData);
  }

  async getTransactions(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.get(`/gateways/transaction/get-all${queryString ? `?${queryString}` : ''}`);
  }

  async updateTransaction(id, updates) {
    return this.put(`/gateways/transaction/update/${id}`, updates);
  }

  async deleteTransaction(id) {
    return this.delete(`/gateways/transaction/delete/${id}`);
  }

  async getTransactionSummary(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.get(`/gateways/transaction/summary${queryString ? `?${queryString}` : ''}`);
  }

  // --- Household Endpoints ---
  async getHouseholdInfo() {
    return this.get('/gateways/household/info');
  }

  async createHousehold(name) {
    return this.post('/gateways/household/create', { name });
  }

  async joinHousehold(invite_code) {
    return this.post('/gateways/household/join', { invite_code });
  }

  async leaveHousehold() {
    return this.post('/gateways/household/leave');
  }
}

// Export singleton instance
export const apiClient = new APIClient(BACKEND_TARGET_URL);
