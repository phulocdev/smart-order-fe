"use client";

import React, { useEffect, useState } from "react";
import AvailableTableDialog from "./available-tables-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import CategoriesCard from "./categories-card";
import DishesGroupCard from "./dishes-group-card";
import OrdersCard from "./orders-card";
import ScrollToTopButton from "./scroll-to-top-button";
import { ICategory, IDish, ITable } from "@/types/backend.type";

interface Props {
  dishListData: IDish[];
  categoryListData: ICategory[];
  tableListData: ITable[];
  isLoggedIn?: boolean;
}

export default function HomeClient({
  dishListData,
  categoryListData,
  tableListData,
  isLoggedIn = false,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(isLoggedIn ? false : true);

  return (
    <>
      <AvailableTableDialog
        tables={tableListData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <div>
        <Carousel className="relative">
          <CarouselContent className="h-[30vh] md:h-[60vh]">
            <CarouselItem>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full object-cover"
                src={"/banner1.webp"}
                alt="banner"
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full object-cover"
                src={"/banner2.jpg"}
                alt="banner"
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full object-cover"
                src={"/banner3.jpg"}
                alt="banner"
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full object-cover"
                src={"/banner4.jpg"}
                alt="banner"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-[50%] h-12 w-12 opacity-60 hover:opacity-100" />
          <CarouselNext className="absolute right-3 top-[50%] h-12 w-12 opacity-60 hover:opacity-100" />
        </Carousel>

        <section className="lg:container">
          <h2 className="scroll-m-20 bg-gray-100 py-10 text-center font-heading text-3xl font-medium tracking-wide text-third first:mt-0 md:bg-white md:py-20 md:text-4xl lg:bg-white">
            Thực đơn
          </h2>
          {/* ------------------------ Category List ------------------------  */}
          <div className="lg:grid lg:grid-cols-24 lg:gap-x-7">
            <div className="col-span-5">
              <CategoriesCard categoryListData={categoryListData} />
            </div>

            {/* -------------------- Dish list of each category   --------------------*/}
            <div className="px-3 md:px-10 lg:col-span-12 lg:px-0">
              {categoryListData.map((category, catIdx) => {
                const totalDishRow = 0;
                const dishList = dishListData.filter(
                  (dish) => dish.category?._id === category._id,
                );
                return (
                  <DishesGroupCard
                    key={category._id}
                    catIdx={catIdx}
                    category={category}
                    dishList={dishList}
                    totalDishRow={totalDishRow}
                  />
                );
              })}
            </div>

            {/* -------------------- Orders List   --------------------*/}
            <div className="col-span-7">
              <OrdersCard />
            </div>
          </div>
        </section>

        {/*  ---------------Scroll to top button ---------------*/}
        <ScrollToTopButton />
      </div>
    </>
  );
}
