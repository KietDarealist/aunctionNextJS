import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import useWindowDimensions from "../../../hooks/useWindowDimension";

interface ILeftSideProps {
  product?: IProduct;
}

const LeftSide: React.FC<ILeftSideProps> = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { product } = props;
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
  }, []);

  console.log("is mobile", isMobile);

  return (
    <div className="border-r border-r-gray-200 h-full py-8 px-4">
      <Slider
        {...settings}
        className={`block justify-center  laptop:w-[500px] w-[300px] laptop:h-[375px] h-[200px] rounded-lg mx-auto`}
      >
        {product?.imagePath?.map((item, index) => (
          <div className="desktop:w-[500px] laptop:w-[400px] laptop:h[300px] w-[300px] desktop:h-[375px] h-[200px] block">
            <Image
              src={item}
              key={product.id.toString()}
              width={500}
              alt="product-thumbnail"
              height={375}
              layout="responsive"
              className="rounded-lg cursor-pointer hover:opacity-80 mx-auto"
            />
          </div>
        ))}
      </Slider>
      <div className={`grid grid-cols-4 gap-x-5 mt-20`}>
        {product?.imagePath?.map((item, index) => (
          <div className="p-2 border border-gray-200 rounded-xl cursor-pointer hover:opacity-50">
            <Image src={item} key={index.toString()} width={120} height={90} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSide;
