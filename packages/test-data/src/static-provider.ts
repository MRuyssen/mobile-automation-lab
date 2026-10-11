import type { TestDataProvider, UsersProvider } from "./provider.js";
import { validUser, invalidEmailUser, shortPasswordUser, uniqueSignUpUser } from "./static/users.js";
import { texts, swipeData, formsData, persistenceData } from "./static/texts.js";

const users: UsersProvider = {
  valid: async () => validUser,
  invalidEmail: async () => invalidEmailUser,
  shortPassword: async () => shortPasswordUser,
  uniqueSignUp: async (runId: string) => uniqueSignUpUser(runId),
};

export const StaticProvider: TestDataProvider = {
  users,
  texts: async () => texts,
  swipe: async () => swipeData,
  forms: async () => formsData,
  persistence: async () => persistenceData,
};
