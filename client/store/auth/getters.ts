import { useCookie } from "#app";

export default {
  computedToken: () => {
    const { value } = useCookie<string>("accessToken");

    return value;
  },
};
