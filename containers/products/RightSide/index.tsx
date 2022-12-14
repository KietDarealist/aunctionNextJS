import React, { useEffect, useState } from "react";
import PaypalLogo from "../../../assets/images/PayPalLogo.png";
import ZaloPayLogo from "../../../assets/images/ZaloPayLogo.png";
import MomoLogo from "../../../assets/images/MomoLogo.png";
import Image from "next/image";

interface IRightSideProps {
  product: IProduct;
  onPlaceBid: () => void;
}

const RightSide: React.FC<IRightSideProps> = (props) => {
  const { product, onPlaceBid } = props;
  let newBidClosingDate = new Date(product?.bidClosingDate);
  const [textDay, setTextDay] = useState<string>("");
  const [textHour, setTextHour] = useState<string>("");
  const [textMinute, setTextMinute] = useState<string>("");
  const [textSecond, setTextSecond] = useState<string>("");

  const countdown = () => {
    const countDate = newBidClosingDate.getTime();
    const now = new Date().getTime();
    const gap = countDate - now;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const textDay = Math.floor(gap / day);
    setTextDay(textDay.toString());
    const textHour = Math.floor((gap % day) / hour);
    setTextHour(textHour.toString());
    const textMinute = Math.floor((gap % hour) / minute);
    setTextMinute(textMinute.toString());
    const textSecond = Math.floor((gap % minute) / second);
    setTextSecond(textSecond.toString());
  };

  setInterval(countdown, 1000);

  return (
    <div className="px-8 py-4">
      <h1 className="text-gray-600 font-bold text-4xl">{product?.name}</h1>
      <div className="mt-2 flex items-center">
        <h3 className="text-gray-400 text-lg">Thương hiệu : </h3>
        <h3 className="text-gray-600 ml-1 text-lg cursor-pointer">Nike</h3>
      </div>
      <div className="mt-2 flex items-center">
        <h3 className="text-gray-400 text-lg">Giá khởi điểm : </h3>
        <h3 className="text-gray-500 text-lg ml-1  cursor-pointer">
          {product?.startPrice.toString().prettyMoney()} VND
        </h3>
      </div>
      <div className="mt-2 flex items-center">
        <h3 className="text-gray-400 text-lg">Bước giá : </h3>
        <h3 className="text-blue-500 ml-1 text-lg cursor-pointer">
          {(product?.bidIncrement).toString().prettyMoney()} VND
        </h3>
      </div>
      <div className="mt-2 flex items-center">
        <h3 className="text-gray-400 text-lg">Giá hiện tại : </h3>
        <h3 className="text-blue-500 ml-1 text-lg cursor-pointer">
          {(product?.currentPrice).toString().prettyMoney()} VND
        </h3>
      </div>
      <div className="mt-2 flex items-center">
        <h3 className="text-gray-400 text-lg">Ngày hết hạn : </h3>
        <h3 className="text-red-500 ml-1 text-lg  cursor-pointer">
          {`${textDay} ngày : ${textHour} giờ : ${textMinute} phút : ${textSecond} giây`}
        </h3>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onPlaceBid()}
          className="items-center rounded-lg px-4 py-2 text-center mt-4 w-fit flex hover:opacity-50 bg-blue-500 text-white font-semibold text-lg"
        >
          Đấu giá ngay
        </button>
        <button className="items-center rounded-lg px-4 py-2 text-center mt-4 w-fit flex hover:opacity-50 bg-white text-blue-500 border border-blue-500 font-semibold text-lg ml-2">
          Yêu thích
        </button>
      </div>
      <div className="mt-5">
        <div className="mt-2">
          <h3 className="text-gray-400 text-lg">Chấp nhận thanh toán : </h3>
          <div className="flex w-full items-center space-x-3">
            <div className="w-[120px] h-[70px] border border-gray-200 justify-center items-center flex rounded-lg cursor-pointer hover:opacity-70 p-[5px] ">
              <Image
                src={PaypalLogo}
                className="w-[100px] h-[50px] rounded-lg my-auto"
              />
            </div>
            <div className="w-[120px] h-[70px] border border-gray-200 justify-center items-center flex rounded-lg cursor-pointer hover:opacity-70 p-[5px] ">
              <Image
                src={ZaloPayLogo}
                className="rounded-lg my-auto"
                width={90}
                height={30}
              />
            </div>
            <div className="w-[120px] h-[70px] border border-gray-200 justify-center items-center flex rounded-lg cursor-pointer hover:opacity-70 p-[5px] ">
              <Image
                src={MomoLogo}
                className="rounded-lg my-auto"
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 max-w-[90%]">
          <h3 className="text-gray-400 text-lg leading-0">
            Chi tiết vận chuyển :{" "}
          </h3>
          <p className="text-gray-500 text-sm cursor-pointer italic">
            Ước tính đơn hàng được dự kiến giao từ ngày 17/12/2022 đến ngày
            19/12/2022
          </p>
          <p className="text-gray-500 text-sm cursor-pointer italic  ">
            Xin lưu ý rằng khoảng thời gian có thể chênh lệch từ 1 đến 10 ngày.
            Mọi thắc mắc về vận chuyển xin vui lòng liên hệ chúng tôi qua đường
            dây nóng 1900 0899
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSide;