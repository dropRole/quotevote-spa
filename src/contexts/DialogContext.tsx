import { createContext, type Dispatch, type SetStateAction } from "react";

type DialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
};

type DialogContext = {
  [key in "alertDialog"]: DialogProps | undefined;
};

const DialogContext = createContext<DialogContext>({ alertDialog: undefined });

export default DialogContext;
