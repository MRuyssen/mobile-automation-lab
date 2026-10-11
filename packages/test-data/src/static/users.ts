import type { User } from "../schemas.js";

export const validUser: User = {
  email: "lab.user@example.com",
  password: "LabPassw0rd!",
};

export const invalidEmailUser: Pick<User, "email"> = {
  email: "not-an-email",
};

export const shortPasswordUser: Pick<User, "password"> = {
  password: "short",
};

export function uniqueSignUpUser(runId: string): User {
  return {
    email: `lab+${runId}@example.com`,
    password: "LabPassw0rd!",
  };
}
