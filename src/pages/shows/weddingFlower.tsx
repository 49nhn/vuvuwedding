import type {NextPageWithLayout} from "~/pages/_app";
import type {ReactElement} from "react";
import MainLayout from "~/layouts/MainLayout";

const WeddingFlower: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
            WeddingFlower
        </div>
    )


WeddingFlower.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="WeddingFlower">
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default WeddingFlower