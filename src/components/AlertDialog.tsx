import {
  CircularProgress,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useContext, type FC } from "react";
import DialogContext from "../contexts/DialogContext";

const AlertDialog: FC = () => {
  const { alertDialog } = useContext(DialogContext);

  return (
    <Modal
      open={alertDialog?.open ?? false}
      onClose={() => {
        alertDialog?.setOpen(false);
        alertDialog?.setTitle("");
        alertDialog?.setMessage("");
      }}
      className="dialog"
    >
      {alertDialog?.title === "" && alertDialog?.message === "" ? (
        <CircularProgress
          thickness={2}
          color="neutral"
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
          }}
        />
      ) : (
        <ModalDialog>
          <DialogTitle>{alertDialog?.title}</DialogTitle>
          <DialogContent>{alertDialog?.message}</DialogContent>
        </ModalDialog>
      )}
    </Modal>
  );
};

export default AlertDialog;
