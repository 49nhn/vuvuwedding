import type {NextPageWithLayout} from "~/pages/_app";
import type {ReactElement} from "react";
import MainLayout from "~/layouts/MainLayout";

const Permission: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
         role
        </div>
    )


Permission.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default Permission