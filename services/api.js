// src/services/api.js


export const getHomes = async () => {
  return [
    { id: "1", name: "My House" },
    { id: "2", name: "Apartment" },
  ];
};

export const getRooms = async (homeId) => {
  return [
    { id: "1", name: "Kitchen" },
    { id: "2", name: "Bedroom" },
  ];
};