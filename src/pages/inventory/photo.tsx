import type {NextPageWithLayout} from "~/pages/_app";
import type {ReactElement} from "react";
import MainLayout from "~/layouts/MainLayout";

const Photo: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
            Photo
        </div>
    )


Photo.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Photo">
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default Photo