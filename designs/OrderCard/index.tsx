import React from "react";
import Image from "next/image";
import { WalletIcon } from "@heroicons/react/24/outline";
import { ICart } from "../../components/OrderHistoryDialog";

interface IOrderCardProps {
  order: ICart;
}

const OrderCard: React.FC<IOrderCardProps> = (props) => {
  const { order } = props;
  return (
    <div className="rounded-lg border border-gray-200 px-2 py-2 flex flex-col gap-y-5 w-full cursor-pointer hover:opacity-80">
      <div className="flex gap-x-3 items-center">
        <Image
          src={order.product.imagePath as string}
          width={120}
          height={80}
        />
        <div className="flex flex-col gap-y-2">
          <p className="text-sm text-gray-600 font-semibold">
            {order.product.name}
          </p>
          <div className="flex gap-x-1 items-center">
            <p className="text-xs text-gray-600">
              Mức đặt: {order.amount?.toString().prettyMoney()}$
            </p>
          </div>
          <div className="flex gap-x-1 items-center">
            <p className="text-xs text-gray-600">Bán bởi: </p>
            <div className="rounded-full bg-blue-200 text-blue-800 font-semibold px-[5px] py-[2px] text-[8px] w-fit">
              {order.product.username}
            </div>
          </div>
          {/* {order.status === "success" && (
            <div className="rounded-full bg-green-200 text-green-800 font-semibold px-[5px] py-[2px] text-[8px] w-fit">
              Thành công
            </div>
          )}
          {order.status === "pending" && (
            <div className="rounded-full bg-yellow-100 text-yellow-800 font-semibold px-[5px] py-[2px] text-[8px] w-fit">
              Đang chờ
            </div>
          )}
          {order.status === "failed" && (
            <div className="rounded-full bg-red-200 text-red-800 font-semibold px-[5px] py-[2px] text-[8px] w-fit">
              Thất bại
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
