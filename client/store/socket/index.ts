import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useNotify } from "~/composables/useNotify";

interface State {
  socket: null | Socket;
}

export const useSocketStore = defineStore("socket", {
  state: () => ({ socket: null } as State),
  actions: {
    init() {
      const notify = useNotify();
      const { tokensStore } = useApi();

      this.socket = io("/", {
        auth: {
          token: tokensStore.value.accessToken,
        },
      });

      this.socket.on("disconnect", () =>
        notify.error("Потеряно соединение с сервером")
      );
    },
  },
});
