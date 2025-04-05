import categoryApiRequest from '@/apiRequests/category.api'
import dishApiRequest from '@/apiRequests/dish.api'
import CategoriesCard from '@/app/(public)/_components/categories-card'
import DishList from '@/app/(public)/_components/dish-list'
import OrdersCard from '@/app/(public)/_components/orders-card'
import { getAuthSession } from '@/auth'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from 'next/image'

export default async function Page() {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''

  const [{ data: dishListData }, { data: categoryListData }] = await Promise.all([
    dishApiRequest.getList(accessToken),
    categoryApiRequest.getList(accessToken)
  ])

  return (
    <div>
      <Carousel className='relative'>
        <CarouselContent className='h-[30vh] md:h-[60vh]'>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner1.webp'}
              alt='banner'
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner2.jpg'}
              alt='banner'
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner3.jpg'}
              alt='banner'
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner4.jpg'}
              alt='banner'
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className='absolute left-3 top-[50%] h-12 w-12 opacity-60 hover:opacity-100' />
        <CarouselNext className='absolute right-3 top-[50%] h-12 w-12 opacity-60 hover:opacity-100' />
      </Carousel>

      <section className='lg:container'>
        <h2 className='scroll-m-20 bg-gray-100 py-10 text-center font-heading text-3xl font-medium tracking-wide text-third first:mt-0 md:bg-white md:py-20 md:text-4xl lg:bg-white'>
          Thực đơn
        </h2>
        {/* ------------------------ Category List ------------------------  */}
        <div className='lg:grid lg:grid-cols-24 lg:gap-x-7'>
          <div className='col-span-5'>
            <CategoriesCard categoryListData={categoryListData} />
          </div>

          {/* -------------------- Dish list for each category   --------------------*/}
          <div className='px-3 md:px-10 lg:col-span-12 lg:px-0'>
            <DishList categoryListData={categoryListData} dishListData={dishListData} session={session} />
          </div>

          {/* -------------------- Orders List   --------------------*/}
          <div className='col-span-7'>
            <OrdersCard session={session} />
          </div>
        </div>
      </section>
    </div>
  )
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
