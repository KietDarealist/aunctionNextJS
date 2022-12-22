import { XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import Button from "../../designs/Button";
import OrderCard from "../../designs/OrderCard";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import { setUserBalance } from "../../redux/slices/auth";
import Spinner from "../Spinner";

interface IWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ITransactionHistory {
  amount: number;
  status: string;
  transactedAt: string;
  transactionCode: number;
}

const WalletDialog: React.FC<IWalletDialogProps> = (props) => {
  const { open, onClose } = props;
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const [money, setMoney] = useState<number | null>(null);
  const [isExisted, setIsExisted] = useState<boolean | null>(null);
  const [createSuccess, setCreateSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionCharge, setActionCharge] = useState<boolean>(false);
  const [chargeAmount, setChargeAmount] = useState<string | null>(null);
  const [isWatch, setIsWatch] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<ITransactionHistory[]>([]);

  const dispatch = useDispatch();

  const getWallet = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        `https://sneakery.herokuapp.com/api/wallet/get/${user?.id}`
      );
      data && console.log("WALLET DATA", data);
      if (data) {
        if (data.data?.data === null) {
          setIsExisted(false);
        } else {
          setIsExisted(true);
          setMoney(data.data?.data.balance);
          dispatch(setUserBalance(data.data?.data.balance));
        }
      }
    } catch (error) {
      console.log("GET WALLET ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async () => {
    try {
      const response = await axios.get(
        `https://sneakery.herokuapp.com/api/transaction/get`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      response && setTransactions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createWallet = async () => {
    try {
      setLoading(true);
      const data = await axios.post(
        "https://sneakery.herokuapp.com/api/wallet/create",
        {
          email: user?.email,
        }
      );
      if (data) {
        setCreateSuccess(true);
        await getWallet();
      }
    } catch (error) {
      console.log("CREATE WALLET ERROR", error);
      setCreateSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const charge = async () => {
    try {
      const data = await axios.post(
        "https://sneakery.herokuapp.com/api/transaction/deposit",
        {
          userId: Number(user?.id),
          amount: Number(chargeAmount?.split(",").join("")),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (data) {
        console.log("CHARGE DATA", data);
        window.open(data.data.message);
      }
    } catch (error) {
      console.log("CHARGE ERROR", error);
    } finally {
      setActionCharge(false);
    }
  };

  useEffect(() => {
    chargeAmount && localStorage.setItem("currentCharge", chargeAmount);
  }, [chargeAmount]);

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    user && getTransactionHistory();
  }, [user]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      className="rounded-lg"
      maxWidth="xs"
      fullWidth={true}
    >
      {!isWatch ? (
        <DialogContent className="max-h-[600px]">
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-600 font-bold text-2xl">Ví của bạn</h1>
              <Tooltip onClick={() => onClose()} title="Đóng">
                <XMarkIcon className="w-8 h-8 p-1 hover:bg-gray-200 rounded-full cursor-pointer" />
              </Tooltip>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full text-white text-[60px] text-center items-center flex justify-center font-semibold">
                {user?.username?.[0].toUpperCase()}
              </div>
              <p className="text-gray-600 font-semibold text-xl mt-2">
                {user?.username}
              </p>
              <>
                {loading && (
                  <div className="mt-2">
                    <Spinner size={20} />{" "}
                  </div>
                )}

                {isExisted === true && loading === false ? (
                  <>
                    <div className="flex w-fit gap-x-2 justify-between items-center mt-2">
                      <p className="text-gray-500 text-sm font-semibold">
                        Số dư ví Paypal:
                      </p>
                      <p className="text-sm font-semibold px-2 py-1 bg-blue-50 text-blue-900 rounded-full">
                        {money}$
                      </p>
                    </div>
                    <Tooltip
                      onClick={() => getWallet()}
                      title="Refresh"
                      className="ml-1 p-1 hover:bg-gray-100 hover:rounded-full cursor-pointer"
                    >
                      <ArrowPathIcon className="w-8 h-8 text-gray-500" />
                    </Tooltip>
                    {actionCharge && (
                      <NumericFormat
                        placeholder="Nhập số tiền"
                        allowLeadingZeros
                        thousandSeparator=","
                        onChange={(e) => setChargeAmount(e.target.value)}
                        type="text"
                        className={`bg-gray-100 text-gray-700  w-[200px] my-2 h-8 px-2 text-sm ml-1 outline-none ring-0 outline-transparent border-transparent focus:border-transparent focus:ring-0 focus:outline-transparent focus:bg-blue-50 rounded-lg`}
                      />
                    )}
                    <p
                      className="text-sm font-semibold px-4 py-1 bg-blue-500 text-white rounded-full mt-3 cursor-pointer hover:opacity-80"
                      onClick={() => {
                        if (actionCharge === false) {
                          setActionCharge(true);
                        } else {
                          charge();
                        }
                      }}
                    >
                      {actionCharge ? "Nạp ngay" : "Nạp thêm tiền"}
                    </p>
                    <p
                      className="text-sm font-semibold px-4 py-1 bg-gray-200 text-gray-600 rounded-full mt-2 cursor-pointer hover:opacity-80"
                      onClick={() => {
                        if (actionCharge) {
                          setActionCharge(false);
                        } else {
                          setIsWatch(true);
                        }
                      }}
                    >
                      {actionCharge ? "Hủy hành động" : "Xem lịch sử giao dịch"}
                    </p>
                  </>
                ) : (
                  <>
                    {loading === false ? (
                      <>
                        <p className="text-gray-500 text-sm font-semibold mt-2 text-center">
                          Bạn hiện chưa liên tài khoản thanh toán PayPal trên hệ
                          thống của chúng tôi
                        </p>
                        <p
                          className="text-sm font-semibold px-4 py-1 bg-blue-50 text-blue-900 rounded-full mt-4 cursor-pointer hover:opacity-80"
                          onClick={() => createWallet()}
                        >
                          Tạo ngay bằng email của bạn
                        </p>
                      </>
                    ) : null}
                  </>
                )}
              </>
            </div>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="max-h-[600px]">
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-600 font-bold text-2xl">Ví của bạn</h1>
              <Tooltip onClick={() => onClose()} title="Đóng">
                <XMarkIcon className="w-8 h-8 p-1 hover:bg-gray-200 rounded-full cursor-pointer" />
              </Tooltip>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full text-white text-[60px] text-center items-center flex justify-center font-semibold">
                {user?.username?.[0].toUpperCase()}
              </div>
              <p className="text-gray-600 font-semibold text-xl mt-2">
                {user?.username}
              </p>
              <>
                {loading && (
                  <div className="mt-2">
                    <Spinner size={20} />{" "}
                  </div>
                )}
                <div className="flex w-fit gap-x-2 justify-between items-center mt-2">
                  <p className="text-gray-500 text-sm font-semibold">
                    Số dư ví Paypal:
                  </p>
                  <p className="text-sm font-semibold px-2 py-1 bg-blue-50 text-blue-900 rounded-full">
                    {money}$
                  </p>
                </div>
              </>
              <div className="mx-auto flex flex-col gap-y-0.5">
                {transactions.map((item, index) => (
                  <div
                    key={index.toString()}
                    className="flex mx-auto items-center mt-2 gap-x-5  gap-y-2 w-full justify-between"
                  >
                    <p className="text-gray-600 text-sm font-semibold ">
                      {item.transactedAt.toString().replace("T", " ")}
                    </p>
                    <p className="text-xs font-semibold text-blue-500">
                      {item.status === "DEPOSIT" || item.status === "RECEIVED"
                        ? "+"
                        : "-"}
                      {`${item.amount}$`}
                    </p>
                  </div>
                ))}
              </div>
              <p
                className=" rounded-lg text-sm font-bold mt-4 text-center cursor-pointer bg-gray-100 text-gray-600 px-4 py-1"
                onClick={() => setIsWatch(false)}
              >
                Quay về
              </p>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default WalletDialog;
