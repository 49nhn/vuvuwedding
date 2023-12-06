import { Button, Tab, Tabs } from '@nextui-org/react';
import MainLayout from '~/layouts/MainLayout';
import User from './component/user';
import Permission from './component/permissions';
import { toast } from 'react-toastify';
const Index = () => {
  const notify = () => toast.success("🦄 Wow so easy!");

  return (
    <MainLayout title='User'>
      <Tabs aria-label="Options" className='w-fit'>
        <Tab key="users" title="Users">
          <Button onClick={ notify} >Button</Button>
          <User />
        </Tab>
        <Tab key="permission" title="Permission">
          <Permission />
        </Tab>
        <Tab key="Employee" title="Employee">
        </Tab>
      </Tabs>

    </MainLayout >
  )
}

export default Index