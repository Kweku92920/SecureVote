const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const parseResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data;
};

export const api = {
  request(path, options = {}) {
    return fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }).then(parseResponse);
  },
  get(path) {
    return this.request(path);
  },
  post(path, body) {
    return this.request(path, { method: "POST", body: JSON.stringify(body) });
  },
  patch(path, body) {
    return this.request(path, { method: "PATCH", body: JSON.stringify(body) });
  },
  put(path, body) {
    return this.request(path, { method: "PUT", body: JSON.stringify(body) });
  },
  delete(path) {
    return this.request(path, { method: "DELETE" });
  },
};

export const formatDateRange = (startTime, endTime) => {
  const format = (value) => {
    if (!value) return "TBD";
    return new Date(value).toLocaleDateString();
  };
  return `${format(startTime)} - ${format(endTime)}`;
};
