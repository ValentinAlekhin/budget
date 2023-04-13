import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { message } from "ant-design-vue";
import { useAuthStore } from "~/store/auth";

interface State {
  socket: null | Socket;
}

export const useSocketStore = defineStore("socket", {
  state: () => ({ socket: null } as State),
  actions: {
    init() {
      const authStore = useAuthStore();

      this.socket = io("http://localhost:3000", {
        extraHeaders: {
          access_token: authStore.computedToken,
        },
      });

      this.socket.on("connect", () => message.info("Соединен с сервером"));
      this.socket.on("disconnect", () =>
        message.error("Потеряно соединение с сервером")
      );
    },
  },
});
