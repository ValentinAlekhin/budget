import {
  BankOutlined,
  BranchesOutlined,
  DatabaseOutlined,
  FundOutlined,
} from "@ant-design/icons-vue";

export function useMainLinks() {
  const links = [
    { name: "Расходы", icon: BankOutlined, to: "/" },
    { name: "Распределение", icon: BranchesOutlined, to: "/dist" },
    { name: "База данных", icon: DatabaseOutlined, to: "/db" },
    { name: "Статистика", icon: FundOutlined, to: "/stat" },
  ];

  return { links };
}
