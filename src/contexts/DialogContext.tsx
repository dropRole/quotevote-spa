import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Quote } from "../api/quotevote/quotes.service";

type DialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type DialogContext = {
  alertDialog:
    | (DialogProps & {
        title: string;
        setTitle: Dispatch<SetStateAction<string>>;
        message: string;
        setMessage: Dispatch<SetStateAction<string>>;
      })
    | undefined;
  settingsDialog: DialogProps | undefined;
  quoteCreationDialog:
    | (DialogProps & {
        quoteToEdit: Pick<Quote, "id" | "content"> | undefined;
        setQuoteToEdit: Dispatch<
          SetStateAction<Pick<Quote, "id" | "content"> | undefined>
        >;
        afterEditAction: () => () => void;
        setAfterEditAction: Dispatch<SetStateAction<() => () => void>>;
      })
    | undefined;
  confirmationDialog:
    | (DialogProps & {
        title: string;
        setTitle: Dispatch<SetStateAction<string>>;
        issue: string;
        setIssue: Dispatch<SetStateAction<string>>;
        confirmedAction: () => () => Promise<void>;
        setConfirmedAction: Dispatch<SetStateAction<() => () => Promise<void>>>;
      })
    | undefined;
};

const DialogContext = createContext<DialogContext>({
  alertDialog: undefined,
  settingsDialog: undefined,
  quoteCreationDialog: undefined,
  confirmationDialog: undefined,
});

export default DialogContext;
