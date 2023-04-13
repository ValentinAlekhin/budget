import { message } from "ant-design-vue";
import { useSocketStore } from "~/store/socket";

export interface CudControllerOptions {
  action: string;
  dataField?: string;
}

const defaultOptions: CudControllerOptions = {
  action: "",
  dataField: "data",
};

export const cudController = (opt: CudControllerOptions) => {
  const { action, dataField }: CudControllerOptions = {
    ...defaultOptions,
    ...opt,
  };

  return {
    cudInit() {
      const socketStore = useSocketStore();
      if (socketStore.socket) {
        socketStore.socket.on(action, ({ info: { type }, payload }) =>
          this[`cud_${type}`](payload)
        );
      } else {
        console.error("No socket");
      }
    },
    cud_update(payload) {
      this[dataField] = this[dataField].map((item) =>
        item.id === payload.id ? payload : item
      );
    },
    cud_delete({ id }) {
      if (!id) return message.error("TEC: Нет id в экшене cud_delete");

      this[dataField] = this[dataField].filter((item) => item.id !== id);
    },
    cud_create(payload) {
      this[dataField] = [payload, ...this[dataField]];
    },
  };
};
