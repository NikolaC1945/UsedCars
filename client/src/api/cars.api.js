const API_URL = "http://localhost:5000/api";

export function getCars() {
  return fetch(`${API_URL}/cars`).then((res) => res.json());
}

export function getCarById(id) {
  return fetch(`${API_URL}/cars/${id}`).then((res) => res.json());
}

export function createCar(data) {
  const token = localStorage.getItem("token");

  return fetch(`${API_URL}/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    return res.json();
  });
}
