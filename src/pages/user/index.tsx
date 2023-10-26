import { Tab, Tabs } from '@nextui-org/react';
import MainLayout from '~/layouts/MainLayout';
import User from './component/user';
import Permission from './component/permissions';
import Employee from '../manager/employee';
const Index = () => {
  return (
    <MainLayout title='User'>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="users" title="Users">
            <User />
          </Tab>
          <Tab key="permission" title="Permission">
            <Permission />
          </Tab>
          <Tab key="Employee" title="Employee">
            <Employee />
          </Tab>
        </Tabs>
      </div>

    </MainLayout >
  )
}

export default Index