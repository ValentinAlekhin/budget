export function useMainLinks() {
  const route = useRoute();

  const links = computed(() =>
    [
      { name: "Costs", icon: "i-heroicons-banknotes", to: "/" },
      {
        name: "Distribution",
        icon: "i-heroicons-inbox-arrow-down",
        to: "/dist",
      },
      { name: "Data", icon: "i-heroicons-circle-stack", to: "/db" },
      {
        name: "Statistic",
        icon: "i-heroicons-presentation-chart-line",
        to: "/stat",
      },
    ].map((l) => {
      let active = false;
      if (route.path === "/" || l.to === "/") {
        active = l.to === route.path;
      } else {
        active = route.path.includes(l.to);
      }

      return { ...l, active };
    })
  );

  const activeIndex = computed(() => links.value.findIndex((l) => l.active));

  return { links, activeIndex };
}
