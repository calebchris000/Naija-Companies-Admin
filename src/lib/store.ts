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
    currentPath: string[];
  };
  organization: {
    addModalOpen: boolean;
    uploadImageStatus: "inactive" | "pending" | "success" | "failure";
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
    currentPath: [],
  },
  organization: {
    addModalOpen: false,
    uploadImageStatus: "inactive",
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
