/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useRouter } from 'next/router';
import { GlobalConfig } from '~/config/GlobalConfig';
import MainLayout from '~/layouts/MainLayout';
import { api } from '~/utils/api';


const User = () => {
  
  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const { data, isLoading, isError } = api.User.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption);
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }
  if (!data) {
    return <div>No data</div>
  }


  return (
    <MainLayout>
  



    </MainLayout>
  )
}

export default User