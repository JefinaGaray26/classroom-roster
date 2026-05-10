const axios = require('axios');
require('dotenv').config();

const JSON_SERVER_URL = `http://localhost:${process.env.JSON_SERVER_PORT || 3001}`;

const db = {
  // Generic GET
  get: async (resource, params = '') => {
    const res = await axios.get(`${JSON_SERVER_URL}/${resource}${params}`);
    return res.data;
  },

  // GET by ID
  getById: async (resource, id) => {
    const res = await axios.get(`${JSON_SERVER_URL}/${resource}/${id}`);
    return res.data;
  },

  // POST (Create)
  post: async (resource, data) => {
    const res = await axios.post(`${JSON_SERVER_URL}/${resource}`, data);
    return res.data;
  },

  // PUT (Full Update)
  put: async (resource, id, data) => {
    const res = await axios.put(`${JSON_SERVER_URL}/${resource}/${id}`, data);
    return res.data;
  },

  // PATCH (Partial Update)
  patch: async (resource, id, data) => {
    const res = await axios.patch(`${JSON_SERVER_URL}/${resource}/${id}`, data);
    return res.data;
  },

  // DELETE
  delete: async (resource, id) => {
    const res = await axios.delete(`${JSON_SERVER_URL}/${resource}/${id}`);
    return res.data;
  },

  // Query with filters
  query: async (resource, queryParams) => {
    const params = new URLSearchParams(queryParams).toString();
    const res = await axios.get(`${JSON_SERVER_URL}/${resource}?${params}`);
    return res.data;
  }
};

module.exports = db;