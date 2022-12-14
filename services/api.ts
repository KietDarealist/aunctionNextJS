import axios from "axios";
import { toast } from "react-toastify";

export const loginService = async (email: string, password: string) => {
  try {
    const data = await axios.post(
      "https://sneakery.herokuapp.com/api/auth/signin",
      {
        email,
        password,
      }
    );
    if (data) return data;
  } catch (error: any) {
    console.log(error);
    console.log(error);
    console.log("REGISTER ERROR", error);
    toast.error(error.response.data.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};

export const registerService = async (
  password: string,
  username: string,
  email: string
) => {
  try {
    const data = await axios.post(
      "https://sneakery.herokuapp.com/api/auth/signup",
      {
        username,
        email,
        password,
      }
    );
    if (data) return data;
  } catch (error: any) {
    console.log(error);
    console.log("REGISTER ERROR", error);
    toast.error(error.response.data.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
};

export const isExistedEmail = async (email: string) => {
  try {
    const isExisted = await axios.get(
      `https://sneakery.herokuapp.com/api/auth/checkemail?email=${email}`
    );
    if (isExisted) {
      console.log("CALEED HERE BITCH");
      return isExisted;
    }
  } catch (error) {
    console.log(error);
  }
};
