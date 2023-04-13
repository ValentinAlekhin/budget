export default {
  costs: (state) => state.data.filter((c) => c.type === "cost"),
  getById: (state) => (id) => state.data.find((c) => c.id === id),
};
