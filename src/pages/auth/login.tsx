import AuthLayout from "~/layouts/AuthLayout";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Input, Image, Button } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import React from "react";
export default function Login() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const toggleVisibility = () => setIsVisible(!isVisible);
    const login = api.Auth.login.useMutation();
    const { data } = api.Auth.me.useQuery();
    const router = useRouter()
    const submitLogin = () => {
        login.mutate({
            username,
            password
        });
    }

    if (login.isSuccess || data?.username) {
        setTimeout(() => router.push('/'), 2e3);
        return (
            <AuthLayout>
                <div className="card ">Login Success</div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <Card isBlurred radius="lg" className="border-none min-w-[22em] w-[25rem] bg-gray-900/40 text-white  min-h-[20rem]">
                <CardHeader className="w-full flex justify-center" > <Image src="/images/logo-vuvu.png" className="h-[3rem]" alt="vuvuweding"></Image> </CardHeader>
                <CardBody className="bg-gradient-to-r from-sky-900/40 to-indigo-900/40 h-full flex items-center justify-center" >
                    <form className=""   >
                        {login.error && <div className="bg-red-500 text-white p-1 my-2 ">
                            {login.error?.message}
                        </div>}
                        <Input
                            label="Username:"
                            name="username"
                            labelPlacement="outside-left"
                            placeholder="Enter your Username"
                            variant="bordered"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}

                            isInvalid={true}
                            onClear={() => console.log("input cleared")}
                            classNames={{ input: "w-38", label: "text-white" }}
                            className="pb-4 "
                        />
                        <Input
                            label="Password:"
                            labelPlacement="outside-left"
                            variant="bordered"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={true}
                            placeholder="Enter your password"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeIcon className="h-6" />
                                    ) : (
                                        <EyeSlashIcon className="h-6" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs pb-4"
                            classNames={{ input: "max-w-xs", label: "text-white" }}
                        />
                        <div className="flex justify-center">
                            {
                                login.isLoading ? <div className="btn  btn-wide btn-sm btn-secondary text-white">Loading</div>
                                    : <Button className = "mt-3" color = "primary"  onClick={submitLogin}>Login</Button>
                            }
                        </div>
                    </form>
                </CardBody>
            </Card>
        </AuthLayout >

    );
}