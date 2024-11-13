/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import { NextPageWithLayout } from "~/pages/_app";
import React, { ReactElement, useContext } from "react";
import MainLayout, { AuthContext } from "~/layouts/MainLayout";
import { Card, CardBody, CardFooter, Divider, Image, Input, Link } from "@nextui-org/react";
import { UploadButton } from "~/utils/uploadthing";
import { OurFileRouter } from "~/server/uploadthing";
import { api, type CurrentUserInput } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Profiles: NextPageWithLayout = () => {
    const currentUser = useContext(AuthContext);
    const editProfile = api.Auth.editProfile.useMutation(GlobalConfig.tanstackOption);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<CurrentUserInput>({
        criteriaMode: "all",
    });
    const onSubmit: SubmitHandler<CurrentUserInput> = async (data) => {
        if (!data) return;
        data.username = currentUser?.username || ""
        await editProfile.mutateAsync(data).catch((error) => {
            toast(error.message, { type: "error", position: "bottom-left" })
            throw new Error(error.message)
        })
        toast("Save success", { type: "success", position: "bottom-left" })
    }

    return (
        <div>
            <Card className="bg-opacity-35">

                <CardBody className="grid-cols-2 ">
                    <div className="flex justify-around">
                        <div className="flex flex-col gap-y-2 items-center w-1/3">
                            <Image
                                classNames={{ img: "rounded-full object-cover  " }}
                                alt="nextui logo"
                                width={250}
                                height={250}
                                radius="sm"
                                loading={"eager"}
                                src={currentUser?.avatar || "/images/avatar.jpg"}
                            />

                            <UploadButton<keyof OurFileRouter>
                                endpoint="imageUploader"
                                appearance={{
                                    button:
                                        "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed p-2 rounded-t-none" +
                                        " bg-primary-500" +
                                        " bg-none after:bg-orange-400",
                                    container: "w-max rounded-md border-cyan-300 bg-slate-800",
                                    allowedContent:
                                        "flex h-8 flex-col items-center justify-center px-2 text-white",
                                }}
                                onClientUploadComplete={(res) => {
                                    // Do something with the response
                                    console.log("Files: ", res);
                                    onSubmit({
                                        avatar: res[0]?.url || "",
                                        username: currentUser?.username || ""
                                    })
                                    if (currentUser) currentUser.avatar = res[0]?.url || "";
                                }}
                                onUploadError={(error: Error) => {
                                    // Do something with the error.
                                    alert(`ERROR! ${error.message}`);
                                }}
                                onUploadBegin={(name) => {
                                    // Do something once upload begins
                                    console.log("Uploading: ", name);
                                }}
                            />
                        </div>
                        <div className="flex flex-col border-l-1 p-2 w-2/3">
                            <form onSubmit={handleSubmit(onSubmit)}
                                  className="flex flex-col w-full  md:flex-nowrap gap-4">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="text"
                                        fullWidth={true}
                                        labelPlacement={"outside-left"}
                                        label="Username"
                                        id="username"
                                        disabled={true}
                                        value={currentUser?.username}

                                    />
                                    <Input
                                        {...register("fullName")}
                                        type="text"
                                        fullWidth={true}
                                        labelPlacement={"outside-left"}
                                        label="Fullname"
                                        id="fullname"
                                        defaultValue={currentUser?.fullName || ""}
                                    />
                                    <Input {
                                               ...register("email")
                                           }
                                           type="email"
                                           fullWidth={true}
                                           labelPlacement={"outside-left"}
                                           label="Email"
                                           id="email"
                                           defaultValue={currentUser?.email || ""}
                                    />
                                    <Input {
                                               ...register("phone")
                                           }
                                           type="text"
                                           fullWidth={true}
                                           labelPlacement={"outside-left"}
                                           label="Phone"
                                           id="phone"
                                           defaultValue={currentUser?.phone || ""}
                                    />
                                    <Input {
                                               ...register("address")
                                           }
                                           type="text"
                                           fullWidth={true}
                                           labelPlacement={"outside-left"}
                                           label="Address"
                                           id="address"
                                           defaultValue={currentUser?.address || ""}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>

                </CardBody>
                <Divider/>
                <CardFooter>
                    <Link
                        isExternal
                        showAnchorIcon
                        href="https://github.com/nextui-org/nextui"
                    >
                        Visit source code on GitHub.
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
Profiles.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}
export default Profiles