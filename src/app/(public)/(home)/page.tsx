import dishApiRequest from '@/apiRequests/dish.api'
import DishCard from '@/app/(public)/_components/dish-card'
import OrderCart from '@/app/(public)/_components/order-cart'
import { getAuthSession } from '@/auth'

export default async function Page() {
  const session = await getAuthSession()
  const accessToken = session?.accessToken ?? ''
  const res = await dishApiRequest.getList(accessToken)
  const dishList = res.data
  return (
    <div className='mt-8 md:mt-12'>
      <section className='px-14 md:px-3 lg:px-0'>
        <h2 className='scroll-m-20 pb-2 text-center text-2xl font-semibold tracking-tight first:mt-0 md:text-3xl'>
          Menu 🍰
        </h2>
        <div className='py-4 md:py-6 lg:py-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-5'>
            {dishList.map((dish) => (
              <div key={dish._id}>
                <DishCard dish={dish} session={session} />
              </div>
            ))}
          </div>
        </div>
        {/* <div className='py-8'>
          <Carousel>
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
          </Carousel>
        </div> */}
      </section>
      <div className='fixed bottom-[50%] right-2 z-20 translate-y-[50%]'>
        <OrderCart session={session} />
      </div>
    </div>
  )
}
