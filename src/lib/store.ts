import { writable } from "svelte/store";

type StoreType = {
  isAuth: boolean;
  selected: { index: number; url: string };
  global: {
    searchValue: string;
  };
};

const defaultStore: StoreType = {
  isAuth: false,
  selected: {
    index: 0,
    url: "/organizations",
  },
  global: {
    searchValue: "",
  },
};

export const store = writable(defaultStore);
