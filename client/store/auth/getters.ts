import { useCookie } from "#app";

export default {
  computedToken: () => {
    const { value } = useCookie("accessToken");

    return value;
  },
};
