import { atom } from "recoil";

export const pdfFileState = atom<File | null>({
  key: "pdfFileState",
  default: null,
});
 