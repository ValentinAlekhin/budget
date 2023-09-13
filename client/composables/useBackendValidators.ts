import { string } from "yup";

export function useBackendValidators() {
  const { api } = useApi();

  const isAvailableUsername = async (username: string) => {
    const { data } = await api.post("/user-field-validation/username", {
      username,
    });

    return data.valid;
  };

  const isAvailableEmail = async (email: string) => {
    const { data } = await api.post("/user-field-validation/email", {
      email,
    });

    return data.valid;
  };

  const usernameSchema = string()
    .required("Username required")
    .test(
      "isAvailableUsername",
      "Username is already taken",
      isAvailableUsername
    );

  const emailSchema = string()
    .required("Email required")
    .email()
    .test("isAvailableEmail", "Еmail is already taken", isAvailableEmail);

  return { isAvailableUsername, usernameSchema, isAvailableEmail, emailSchema };
}
