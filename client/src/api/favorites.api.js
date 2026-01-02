import api from "./api";

// toggle save / unsave
export const toggleFavorite = carId =>
  api.post(`/favorites/${carId}`).then(res => res.data);

// get my saved cars
export const getMyFavorites = () =>
  api.get("/favorites").then(res => res.data);
