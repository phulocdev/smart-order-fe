import ReservationScreen from '@/app/(public)/(auth)/reservation/reservation-screen'
import { getAuthSession } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getAuthSession()
  if (session) {
    redirect('/')
  }
  return <ReservationScreen />
}
