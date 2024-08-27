import { writable } from "svelte/store";

type FormDataType = {
  name: string | null;
  website: string | null;
  email: string | null;
  logoUrl: string | null;
  capital: string | null;
  industry: string | null;
  foundedYear: string | null;
  size: string | null;
  verified: string | null;
  postalCode: string | null;
  description: string | null;
  city: string | null;
};

type StoreType = {
  isAuth: boolean;
  selected: { index: number; url: string };
  global: {
    searchValue: string;
  };
  organization: {
    addModalOpen: boolean;
    addFormData: FormDataType;
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
  organization: {
    addModalOpen: false,
    addFormData: {
      name: null,
      website: null,
      email: null,
      logoUrl: null,
      capital: null,
      industry: null,
      foundedYear: null,
      size: null,
      verified: null,
      postalCode: null,
      description: null,
      city: null,
    },
  },
};

export const store = writable(defaultStore);
