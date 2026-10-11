import type { User, Texts, SwipeData, FormsData, PersistenceData } from "./schemas.js";

export interface UsersProvider {
  valid(): Promise<User>;
  invalidEmail(): Promise<Pick<User, "email">>;
  shortPassword(): Promise<Pick<User, "password">>;
  uniqueSignUp(runId: string): Promise<User>;
}

export interface TestDataProvider {
  users: UsersProvider;
  texts(): Promise<Texts>;
  swipe(): Promise<SwipeData>;
  forms(): Promise<FormsData>;
  persistence(): Promise<PersistenceData>;
}

export { StaticProvider } from "./static-provider.js";
