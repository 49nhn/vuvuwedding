import type {NextPageWithLayout} from "~/pages/_app";
import type {ReactElement} from "react";
import MainLayout from "~/layouts/MainLayout";

const MakeUp: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
         role
        </div>
    )


MakeUp.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="MakeUp">
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default MakeUp