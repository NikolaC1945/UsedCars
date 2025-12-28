import api from "./api";

export const getCars = async () => {
  const res = await api.get("/cars");
  return res.data;
};

export const getCarById = async id => {
  const res = await api.get(`/cars/${id}`);
  return res.data;
};

export const createCar = async data => {
  const res = await api.post("/cars", data);
  return res.data;
};

export const updateCar = async (id, data) => {
  const res = await api.put(`/cars/${id}`, data);
  return res.data;
};

/* ✅ FINAL, CORRECT DELETE */
export const deleteCarImage = async (id, image) => {
  // image = "/uploads/1766880404908-274176794.jfif"
  const filename = image.split("/").pop();

  const res = await api.delete(
    `/cars/${id}/image/${filename}`
  );

  return res.data;
};
