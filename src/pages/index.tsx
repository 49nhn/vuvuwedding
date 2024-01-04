import MainLayout from "~/layouts/MainLayout";
import {NextPageWithLayout} from "~/pages/_app";
import {ReactElement} from "react";

const Page: NextPageWithLayout = () => {
    return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
                {page}
        </MainLayout>
    )
}

export default Page
//vuvuwedding VuvuWedding@2021