import type {NextPageWithLayout} from "~/pages/_app";
import type {ReactElement} from "react";
import MainLayout from "~/layouts/MainLayout";
import { UploadButton } from "~/utils/uploadthing";
import { Image } from "@nextui-org/react";

const Other: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
           <Image src="https://utfs.io/f/379f8bf1-8b56-4fee-bb12-a49c89b9fa68-10tj5.jpg" />
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </div>
    )


Other.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Other">
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default Other
