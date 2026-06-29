import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useContext, type FC } from "react";
import DialogContext from "../contexts/DialogContext";
import Button from "./Button";

const ConfirmationDialog: FC = () => {
  const { confirmationDialog } = useContext(DialogContext);

  return (
    <Modal
      open={confirmationDialog?.open ?? false}
      onClose={() => confirmationDialog?.setOpen(false)}
      className="dialog"
    >
      <ModalDialog>
        <DialogTitle>{confirmationDialog?.title}</DialogTitle>
        <DialogContent>
          <p>{confirmationDialog?.issue}</p>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            text="Cancel"
            className="btn"
            onClick={() => confirmationDialog?.setOpen(false)}
          />
          <Button
            type="button"
            text="Confirm"
            className="btn btn-confirm"
            onClick={() => confirmationDialog?.confirmedAction()}
          />
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ConfirmationDialog;
