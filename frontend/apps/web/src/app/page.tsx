import PagesOverview from '@/components/PagesOverview'
import UserSession from '@/components/UserSession'

const Home = async () => {
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight text-gray-900">
        RealWise - A real state management system
      </h1>

      <UserSession />

      <hr className="my-8" />

      <PagesOverview />
    </>
  )
}

export default Home
