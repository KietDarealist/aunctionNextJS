//utils and types
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/types/user'
import { boolean } from 'yup'

export type IInputMode = 'INPUT_OTP' | 'INPUT_PHONE_NUMBER'
interface IInitialState {
  isAuth: boolean
  user: IUser | null
  accessToken: string
  openEmailSentDialog: boolean
  openVerifyPhoneNumberDialog: boolean
  balance: number
}

const initialState: IInitialState = {
  isAuth: false,
  user: null,
  accessToken: '',
  openEmailSentDialog: false,
  openVerifyPhoneNumberDialog: false,
  balance: 0,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, actions: PayloadAction<boolean>) => {
      state.isAuth = actions.payload
    },
    setAccessToken: (state, actions: PayloadAction<string>) => {
      state.accessToken = actions.payload
    },
    setUser: (state, actions: PayloadAction<IUser | null>) => {
      state.user = actions.payload
    },
    setOpenEmailSentDialog: (state, actions: PayloadAction<boolean>) => {
      state.openEmailSentDialog = actions.payload
    },
    setOpenVerifyPhoneNumberDialog: (
      state,
      actions: PayloadAction<boolean>,
    ) => {
      state.openVerifyPhoneNumberDialog = actions.payload
    },
    setUserBalance: (state, actions: PayloadAction<number>) => {
      state.balance = actions.payload
    },
  },
})

export const {
  setAuth,
  setUser,
  setOpenEmailSentDialog,
  setOpenVerifyPhoneNumberDialog,
  setUserBalance,
  setAccessToken,
} = authSlice.actions
export default authSlice.reducer
