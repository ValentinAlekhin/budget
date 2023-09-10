import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { uniq } from "lodash-es";
import { useCategoryStore } from "~/store/category";
import { useRecordStore } from "~/store/record";

const createRecordMapper = (categories: any[]) => (records: any[]) =>
  records.map((r) => {
    const date = dayjs(r.timestamp);

    return {
      ...r,
      year: date.year(),
      month: date.month(),
      day: date.day(),
      category: categories.find((c) => c.id === r.category),
    };
  });

export function useStat() {
  const categoryStore = useCategoryStore();
  const recordStore = useRecordStore();
  const categoryRefs = storeToRefs(categoryStore);
  const recordRefs = storeToRefs(recordStore);

  const mapper = createRecordMapper(categoryRefs.data.value);

  const cost = computed(() => mapper(recordRefs.costs.value));
  const inc = computed(() => mapper(recordRefs.inc.value));
  const dist = computed(() => mapper(recordRefs.dist.value));

  const records = computed(() => [...cost.value, ...inc.value, ...dist.value]);

  const years = computed(() => uniq(records.value.map(({ year }) => year)));

  return { cost, inc, dist, records, years };
}
