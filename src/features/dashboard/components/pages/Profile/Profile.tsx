import styles from "./Profile.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { clearReferenceInputValues, formCreator } from "@/libs/form.ts";
import { postChangePasswordRequest } from "@/features/auth/services/auth.service.ts";
import { toast } from "react-toastify";

const Profile = () => {
  const { setLoader } = useContext(LoaderContext);

  const inputRefs = {
    password: useRef<HTMLInputElement>(null),
    confirm__password: useRef<HTMLInputElement>(null),
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "password",
        data: inputRefs.password.current?.value || "",
      },
      {
        name: "confirm_password",
        data: inputRefs.confirm__password.current?.value || "",
      },
    ]);

    const { status } = await postChangePasswordRequest(formData);
    if (status == 200) {
      toast.success("Password changed successfully.");
      clearReferenceInputValues(inputRefs);
    } else toast.error("Password changed failed.");

    setLoader(false);
  };

  return (
    <div className={styles.settings}>
      <h1 className={styles.settings__title}>Profile Settings</h1>
      <form onSubmit={changePassword} className={styles.settings__form}>
        <Input inputRef={inputRefs.password} label={"New Password"} />
        <Input
          inputRef={inputRefs.confirm__password}
          label={"Rewrite New Password"}
        />
        <Button text={"Save"} type={"submit"} />
      </form>
    </div>
  );
};

export default Profile;
