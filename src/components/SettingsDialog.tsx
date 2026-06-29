import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Tab,
  TabList,
  Tabs,
} from "@mui/joy";
import { tabClasses } from "@mui/joy";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type FC,
  type SyntheticEvent,
} from "react";
import DialogContext from "../contexts/DialogContext";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./settings-dialog.css";
import InputField from "./InputField";
import Button from "./Button";
import UsersService, { type User } from "../api/quotevote/users.service";
import { UserContext } from "../contexts/UserContext";
import { depictUserAvatar } from "../utils/functions";

const basicsSchema = z.object({
  email: z.email().max(255),
  name: z
    .string()
    .nonempty("Name must be provided")
    .max(100, "Name cannot be longer than 100 characters"),
  surname: z
    .string()
    .nonempty("Surname must be provided")
    .max(100, "Surname cannot be longer than 100 characters"),
  username: z
    .string("Username must be provided")
    .min(6, "Username cannot be shorter than 6 character")
    .max(20, "Username cannot be longer than 20 characters"),
});

const passwordSchema = z
  .object({
    currentPass: z
      .string("Password must be provided")
      .min(8, "Password cannot be shorter than 8 characters")
      .max(20, "Password cannot be longer than 20 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]*$/,
        "Password must contain a capital, numeric and special character",
      ),
    newPass: z
      .string("Password must be provided")
      .min(8, "Password cannot be shorter than 8 characters")
      .max(20, "Password cannot be longer than 20 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]*$/,
        "Password must contain a capital, numeric and special character",
      ),
    confirmPass: z
      .string("Password must be provided")
      .min(8, "Password cannot be shorter than 8 characters")
      .max(20, "Password cannot be longer than 20 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]*$/,
        "Password must contain a capital, numeric and special character",
      ),
  })
  .refine(({ newPass, confirmPass }) => newPass === confirmPass, {
    error: "Passwords must match",
    path: ["confirmPass"],
  });

const avatarSchema = z.object({
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Avatar must be uploaded")
    .refine(
      (files) => /^image\/[\w.+-]+$/.test(files?.[0]?.type),
      "Only image files are allowed",
    )
    .refine(
      (files) => files?.[0]?.size <= 2 * 1024 * 1024,
      "Max file size is 2MB.",
    ),
});

type BasicsValidationSchema = z.infer<typeof basicsSchema>;

type PasswordValidationSchema = z.infer<typeof passwordSchema>;

type AvatarValidationSchema = z.infer<typeof avatarSchema>;

const SettingsDialog: FC = () => {
  const [validationSchema, setValidationSchema] = useState<
    typeof basicsSchema | typeof passwordSchema | typeof avatarSchema
  >(basicsSchema);

  const [selectedTab, setSelectedTab] = useState<Tab>("basics");

  const { settingsDialog } = useContext(DialogContext);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<
    BasicsValidationSchema | PasswordValidationSchema | AvatarValidationSchema
  >({
    resolver: zodResolver(validationSchema),
  });

  type Tab = "basics" | "password" | "avatar";

  const usersService = useRef(new UsersService());

  const { alertDialog } = useContext(DialogContext);

  const updateBasics = async (data: Omit<User, "username">) => {
    alertDialog?.setOpen(true);

    const { message } = await usersService.current.updateBasics(data);

    if (alertDialog && alertDialog.setTitle && alertDialog.setMessage) {
      alertDialog?.setTitle("Basics update");

      alertDialog?.setMessage(message);
    }
  };

  const updatePass = async (data: { currentPass: string; newPass: string }) => {
    alertDialog?.setOpen(true);

    const { message } = await usersService.current.updatePass(data);

    if (alertDialog && alertDialog.setTitle && alertDialog.setMessage) {
      alertDialog?.setTitle("Password update");

      alertDialog?.setMessage(message);
    }
  };

  const uploadAvatar = async (data: FileList) => {
    alertDialog?.setOpen(true);

    const { success, message } = await usersService.current.uploadAvatar(data);

    if (alertDialog && alertDialog.setTitle && alertDialog.setMessage) {
      alertDialog?.setTitle("Avatar upload");

      alertDialog?.setMessage(message);
    }

    if (success) {
      const { data: userData } = await usersService.current.getInfo();

      if (!userData) return;

      if (userData.avatar && userContext && userContext.setUser) {
        const { data: streamedAvatar } = await usersService.current.getAvatar(
          userData.avatar,
        );

        userContext?.setUser({ ...userData, avatar: streamedAvatar as Blob });
      }
    }
  };

  const changeTab = (_e: SyntheticEvent, value: Tab) => {
    setSelectedTab(value as Tab);

    if (value === "basics") setValidationSchema(basicsSchema);

    if (value === "password") setValidationSchema(passwordSchema);

    if (value === "avatar") setValidationSchema(avatarSchema);
  };

  const userContext = useContext(UserContext);

  const renderDialogTabs = (tab: Tab) => {
    if (tab === "basics")
      return (
        <>
          <InputField
            label="E-mail"
            type="text"
            name="email"
            register={register}
            error={errors?.email?.message}
          />
          <InputField
            label="Name"
            type="text"
            name="name"
            register={register}
            error={errors?.name?.message}
          />
          <InputField
            label="Surname"
            type="text"
            name="surname"
            register={register}
            error={errors?.surname?.message}
          />
          <InputField
            label="Username"
            type="text"
            name="username"
            register={register}
            error={errors?.username?.message}
          />
        </>
      );

    if (tab === "password")
      return (
        <>
          <InputField
            label="Current password"
            type="password"
            name="currentPass"
            register={register}
            error={errors?.currentPass?.message}
          />
          <InputField
            label="New password"
            type="password"
            name="newPass"
            register={register}
            error={errors?.newPass?.message}
          />
          <InputField
            label="Confirm password"
            type="password"
            name="confirmPass"
            register={register}
            error={errors?.confirmPass?.message}
          />
        </>
      );

    if (tab === "avatar")
      return (
        <>
          {userContext &&
            userContext.user &&
            depictUserAvatar(userContext?.user?.avatar)}
          <InputField
            label="Pick avatar"
            type="file"
            name="avatar"
            register={register}
            error={errors?.avatar?.message}
          />
        </>
      );
  };

  useEffect(() => {
    reset({
      email: userContext?.user?.email,
      name: userContext?.user?.name,
      surname: userContext?.user?.surname,
      username: userContext?.user?.username,
      currentPass: "",
      newPass: "",
      confirmPass: "",
    });
  }, [userContext, validationSchema]);

  return (
    <Modal
      open={settingsDialog?.open ?? false}
      onClose={() => settingsDialog?.setOpen(false)}
      className="dialog"
    >
      <ModalDialog>
        <DialogTitle>Profile settings</DialogTitle>
        <DialogContent>
          <Tabs
            id="settingsDialogTabs"
            aria-label="tabs"
            value={selectedTab}
            sx={{ bgcolor: "transparent" }}
            onChange={changeTab}
          >
            <TabList
              tabFlex="auto"
              disableUnderline
              sx={{
                p: 0.5,
                gap: 0.5,
                borderRadius: "md",
                bgcolor: "background.level1",
                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                  boxShadow: "sm",
                  color: "#fff",
                  bgcolor: "var(--cta-bg)",
                },
              }}
            >
              <Tab value="basics" disableIndicator>
                Basics
              </Tab>
              <Tab value="password" disableIndicator>
                Password
              </Tab>
              <Tab value="avatar" disableIndicator>
                Avatar
              </Tab>
            </TabList>
          </Tabs>
          <form
            className="settings-form"
            onSubmit={handleSubmit((data) => {
              if (selectedTab === "basics") updateBasics(data);

              if (selectedTab === "password") updatePass(data);

              if (selectedTab === "avatar") uploadAvatar(data);
            })}
          >
            {renderDialogTabs(selectedTab)}
            <Button type="submit" text="Change" className="btn-submit w-100" />
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default SettingsDialog;
