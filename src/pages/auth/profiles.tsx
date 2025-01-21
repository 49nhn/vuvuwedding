/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import { NextPageWithLayout } from "~/pages/_app";
import React, { ReactElement, useContext } from "react";
import MainLayout, { AuthContext } from "~/layouts/MainLayout";
import { Card, CardBody, CardFooter, Divider, Image, Link } from "@nextui-org/react";
import { UploadButton } from "~/utils/uploadthing";
import { OurFileRouter } from "~/server/uploadthing";
import { api, type CurrentUserInput } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

const Profiles: NextPageWithLayout = () => {
    const currentUser = useContext(AuthContext);
    const editProfile = api.Auth.editProfile.useMutation(GlobalConfig.tanstackOption);
    const {
        register,
        handleSubmit,

        formState: { errors, isSubmitting, dirtyFields },
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
                <CardBody>
                    <div className="grid md:grid-cols-3 grid-cols-1">
                        <div className="flex col-span-1 flex-col gap-y-2 items-center">
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
                        <div className="flex col-span-2 flex-col border-l-1 p-2 ">
                            <form onSubmit={handleSubmit(onSubmit)}
                                  className="flex flex-col md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    labelPlacement={"outside-left"}
                                    classNames={{ label: "w-1/4", mainWrapper: "w-full" }}
                                    label="Username"
                                    fullWidth={true}
                                    id="username"
                                    isReadOnly={true}
                                    value={currentUser?.username}

                                />
                                <Input
                                    {...register("fullName")}
                                    type="text"
                                    fullWidth={true}
                                    classNames={{ label: "w-1/4", mainWrapper: "w-full" }}

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
                                       classNames={{ label: "w-1/4", mainWrapper: "w-full" }}

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
                                       classNames={{ label: "w-1/4", mainWrapper: "w-full" }}

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
                                       classNames={{ label: "w-1/4", mainWrapper: "w-full" }}

                                       labelPlacement={"outside-left"}
                                       label="Address"
                                       id="address"
                                       defaultValue={currentUser?.address || ""}
                                />
                                <div className="flex justify-end ">
                                    <Button type="submit" color="primary" isLoading={isSubmitting}
                                            isDisabled={!dirtyFields.phone || dirtyFields.fullName||dirtyFields.address || dirtyFields.email }>Submit</Button>
                                </div>
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