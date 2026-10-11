import { z } from "zod/v4";

export const UserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const AlertTextSchema = z.object({
  title: z.string(),
  message: z.string(),
  button: z.string(),
});

export type AlertText = z.infer<typeof AlertTextSchema>;

export const TextsSchema = z.object({
  alerts: z.object({
    loginSuccess: AlertTextSchema,
    signUpSuccess: AlertTextSchema,
    activeButton: AlertTextSchema,
  }),
  errors: z.object({
    invalidEmail: z.string(),
    shortPassword: z.string(),
    passwordMismatch: z.string(),
  }),
});

export type Texts = z.infer<typeof TextsSchema>;

export const SwipeDataSchema = z.object({
  cardTitles: z.array(z.string()),
  foundText: z.string(),
});

export type SwipeData = z.infer<typeof SwipeDataSchema>;

export const FormsDataSchema = z.object({
  text: z.string(),
  dropdownOption: z.string(),
});

export type FormsData = z.infer<typeof FormsDataSchema>;

export const PersistenceDataSchema = z.object({
  value: z.string(),
});

export type PersistenceData = z.infer<typeof PersistenceDataSchema>;
