import { Box, DialogContent, DialogTitle, Modal, ModalDialog } from "@mui/joy";
import { useContext, useRef, type FC } from "react";
import DialogContext from "../contexts/DialogContext";
import "./quote-creation-dialog.css";
import Button from "./Button";
import QuotesService from "../api/quotevote/quotes.service";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const quoteSchema = z.object({
  content: z
    .string()
    .nonempty("Quote must be provided")
    .max(500, "Quote length cannot exceed 500 characters"),
});

type QuoteValidationSchema = z.infer<typeof quoteSchema>;

const QuoteCreationDialog: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<QuoteValidationSchema>({
    resolver: zodResolver(quoteSchema),
  });

  const { quoteCreationDialog, alertDialog } = useContext(DialogContext);

  const quotesService = useRef(new QuotesService());

  const postQuote = async (data: { content: string }) => {
    alertDialog?.setOpen(true);

    const { message } = await quotesService.current.createQuote(data.content);

    if (
      message &&
      alertDialog &&
      alertDialog.setTitle &&
      alertDialog.setMessage
    ) {
      alertDialog?.setTitle("Quote post");

      alertDialog?.setMessage(message);
    }
  };

  return (
    <Modal
      open={quoteCreationDialog?.open ?? false}
      onClose={() => quoteCreationDialog?.setOpen(false)}
      className="dialog"
    >
      <ModalDialog id="quoteCreationDialogContent">
        <DialogTitle id="quoteCreationDialogTitle">
          Are you feeling <span>inspired?</span>
        </DialogTitle>
        <DialogContent>
          <p>Post and review your quotes.</p>
          <form id="quoteCreationForm" onSubmit={handleSubmit(postQuote)}>
            <div
              {...(errors?.content?.message && {
                "data-error": errors.content.message,
              })}
            >
              <textarea {...register("content")}></textarea>
            </div>
            <Box
              sx={{
                display: "flex",
                columnGap: "10px",
                marginTop: "20px",
                padding: "10px 0",
              }}
            >
              <Button type="submit" text="Submit" className="btn btn-submit" />
              <Button type="button" text="Cancel" className="btn " />
            </Box>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default QuoteCreationDialog;
