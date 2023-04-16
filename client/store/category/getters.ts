export default {
  costs: (state) =>
    state.data
      .filter((c) => c.type === "cost")
      .sort((a, b) => a.order - b.order),
  incoming: (state) =>
    state.data
      .filter((c) => c.type === "inc")
      .sort((a, b) => a.order - b.order),
  getById: (state) => (id) => state.data.find((c) => c.id === id),
};
