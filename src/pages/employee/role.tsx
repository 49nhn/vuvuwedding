import type {NextPageWithLayout} from "~/pages/_app";
import type {ReactElement} from "react";
import MainLayout from "~/layouts/MainLayout";

const Role: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
         role
        </div>
    )


Role.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default Role