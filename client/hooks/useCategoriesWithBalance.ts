import { storeToRefs } from "pinia";
import { sumBy } from "lodash-es";
import { useCategoryStore } from "~/store/category";
import { useRecordStore } from "~/store/record";

export function useCategoriesWithBalance() {
  const categoryStore = useCategoryStore();
  const recordStore = useRecordStore();
  const { costs: categoryCosts } = storeToRefs(categoryStore);
  const { dist, costs } = storeToRefs(recordStore);

  const categoriesWithBalance = computed(() =>
    categoryCosts.value.map((c) => {
      const allDist = sumBy(
        dist.value.filter((r) => r.category === c.id),
        "amount"
      );
      const allCost = sumBy(
        costs.value.filter((r) => r.category === c.id),
        "amount"
      );

      const balance = allDist - allCost;
      const colorClass = balance < 0 ? "text-rose-300" : "";

      return {
        ...c,
        formattedBalance: numberWithSpaces(balance),
        balance,
        colorClass,
      };
    })
  );

  return { categoriesWithBalance };
}
