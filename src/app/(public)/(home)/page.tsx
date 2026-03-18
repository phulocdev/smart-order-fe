import categoryApiRequest from "@/apiRequests/category.api";
import dishApiRequest from "@/apiRequests/dish.api";
import tableApiRequest from "@/apiRequests/table.api";
import HomeClient from "@/app/(public)/_components/home-client";
import { getAuthSession } from "@/auth";

export default async function Page() {
  const session = await getAuthSession();

  const [
    { data: dishListData },
    { data: categoryListData },
    { data: tableListData },
  ] = await Promise.all([
    dishApiRequest.getList(),
    categoryApiRequest.getList(),
    tableApiRequest.getList({ sort: "number.asc" }),
  ]);

  return (
    <HomeClient
      dishListData={dishListData}
      categoryListData={categoryListData}
      tableListData={tableListData}
      isLoggedIn={!!session}
    />
  );
}

/* <Carousel>
  <CarouselContent className='-ml-8'>
    {dishList.map((dish) => (
      <CarouselItem key={dish._id} className='basis-[100%] pl-8 md:basis-1/2 xl:basis-1/3'>
        <DishCard dish={dish} session={session} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className='absolute -top-7 right-12 flex items-center justify-center'>
    <CarouselPrevious className='relative left-0 translate-x-0 hover:translate-x-0' />
  </div>
  <div className='absolute -top-7 right-2 flex items-center justify-center'>
    <CarouselNext className='relative right-0 translate-x-0 hover:translate-x-0' />
  </div>
</Carousel> */
