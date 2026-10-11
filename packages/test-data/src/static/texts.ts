import type { Texts, SwipeData, FormsData, PersistenceData } from "../schemas.js";

export const texts: Texts = {
  alerts: {
    loginSuccess: {
      title: "Success",
      message: "You are logged in!",
      button: "OK",
    },
    signUpSuccess: {
      title: "Signed Up!",
      message: "You successfully signed up!",
      button: "OK",
    },
    activeButton: {
      title: "This button is",
      message: "This button is active",
      button: "OK",
    },
  },
  errors: {
    invalidEmail: "Please enter a valid email address",
    shortPassword: "Please enter at least 8 characters",
    passwordMismatch: "Please enter the same password",
  },
};

export const swipeData: SwipeData = {
  cardTitles: [
    "FULLY OPEN SOURCE",
    "GREAT COMMUNITY",
    "JS.FOUNDATION",
    "SUPPORT VIDEOS",
    "EXTENDABLE",
    "COMPATIBLE",
  ],
  foundText: "You found me!!!",
};

export const formsData: FormsData = {
  text: "Hello from the lab",
  dropdownOption: "Appium is awesome",
};

export const persistenceData: PersistenceData = {
  value: "lab-persist-01",
};
