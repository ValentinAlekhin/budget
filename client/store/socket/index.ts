import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "~/store/auth";
import { useNotify } from "~/hooks/useNotify";

interface State {
  socket: null | Socket;
}

export const useSocketStore = defineStore("socket", {
  state: () => ({ socket: null } as State),
  actions: {
    init() {
      const authStore = useAuthStore();
      const notify = useNotify();

      this.socket = io("/", {
        auth: {
          token: authStore.computedToken,
        },
      });

      this.socket.on("connect", () => notify.info("Соединен с сервером"));
      this.socket.on("disconnect", () =>
        notify.error("Потеряно соединение с сервером")
      );
    },
  },
});
