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
  [key in "alertDialog" | "settingsDialog" | "quoteCreationDialog"]:
    | (Pick<DialogProps, "open" | "setOpen"> &
        Partial<Omit<DialogProps, "open" | "setOpen">>)
    | undefined;
};

const DialogContext = createContext<DialogContext>({
  alertDialog: undefined,
  settingsDialog: undefined,
  quoteCreationDialog: undefined,
});

export default DialogContext;
