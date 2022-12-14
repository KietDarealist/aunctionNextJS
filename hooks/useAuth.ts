import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useSignInWithGoogle,
  useSignInWithFacebook,
} from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth } from "../common/config/firebase";
import { IRootState } from "../redux";
import { setAuth, setOpenEmailSentDialog, setUser } from "../redux/slices/auth";
import { isExistedEmail, loginService, registerService } from "../services/api";
import { IUser } from "../types/user";
import { useAppDispatch, useAppSelector } from "./useRedux";

export const useAuth = () => {
  const [loginWithGoogle, googleUser] = useSignInWithGoogle(auth);
  const [loginWithFacebook] = useSignInWithFacebook(auth);

  //login
  const [loginError, setLoginError] = useState<string>();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  //register
  const [registerError, setRegisterError] = useState<any>();
  const [regsiterLoading, setRegisterLoading] = useState<boolean>(false);

  //checkExisted
  const [existed, setExisted] = useState<boolean | null>(null);

  const { user } = useAppSelector((state: IRootState) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setLoginLoading(true);
      const data = await loginService(email, password);
      if (data) {
        toast.success("Đăng nhập thành công", {
          position: "top-right",
          autoClose: 0,
          theme: "colored",
          hideProgressBar: true,
        });
        console.log("LOGIN RESPONSE", data.data);
        dispatch(setUser(data?.data?.data as IUser));
        dispatch(setAuth(true));
      }
    } catch (error) {
      console.log(error);
      setLoginError(error as string);
    } finally {
      setLoginLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      setRegisterLoading(true);
      const data = await registerService(email, password, username);

      if (data?.data.success === true) {
        dispatch(setOpenEmailSentDialog(true));
        console.log("REGISTER DATA", data);
      }
    } catch (error) {
    } finally {
      setRegisterLoading(false);
    }
  };

  useEffect(() => {
    user && localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    googleUser && checkIsFirstTimeWithGoogle(googleUser?.user?.email as string);
  }, [googleUser]);

  useEffect(() => {
    if (googleUser) {
      if (existed === true) {
        login(
          googleUser?.user?.email as string,
          googleUser?.user?.uid as string
        );
      } else {
        registerService(
          googleUser.user.uid as string,
          googleUser.user.displayName as string,
          googleUser.user.email as string
        );
      }
    }
  }, [existed]);

  const checkIsFirstTimeWithGoogle = async (email: string) => {
    try {
      const isExisted = await isExistedEmail(email);
      isExisted && setExisted(true);
      isExisted && console.log("EXISTED EMAIL", isExisted);
    } catch (error) {
      setExisted(false);
      console.log("EXISTED ERROR", error);
    }
  };

  const googleLogin = async () => {
    try {
      setLoginLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    login,
    loginError,
    googleLogin,

    loginLoading,
    loginWithFacebook,
    loginWithGoogle,

    register,
    registerError,
    regsiterLoading,
  };
};
