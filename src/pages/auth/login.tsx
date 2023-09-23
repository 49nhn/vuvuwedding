import { type FormEvent } from "react";
import AuthLayout from "~/layouts/AuthLayout";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'
import { InputUI } from "~/ui/Input";
import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import Logo from "~/ui/Logo";
export default function Login() {
    const login = api.Auth.login.useMutation();
    const { data } = api.Auth.me.useQuery();
    const router = useRouter()
    const submitLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login.mutate({
            username: (e.currentTarget.username as HTMLInputElement).value,
            password: (e.currentTarget.password as HTMLInputElement).value
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
            <Card isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                shadow="sm">
                <CardHeader className="text-center">
                    <Logo />
                    VUVUWEDDING
                </CardHeader>
                <CardBody className="w-full">
                    <form onSubmit={(e) => submitLogin(e)}>
                        {login.error && <div className="bg-red-500 text-white p-1 my-2 ">
                            {login.error?.message}
                        </div>}
                        <div className="w-full flex flex-col gap-4 border-spacing-4 card">
                            <InputUI label="Username" placeholder="admin" ></InputUI>
                            <InputUI type="password" label="Password" placeholder="*******" ></InputUI>
                        </div>
                        <div className="flex justify-center pt-3">
                            {
                                login.isLoading ? <Spinner />
                                    : <Button color="success" className="w-full" type="submit">Login</Button>
                            }
                        </div>
                    </form>
                </CardBody>
            </Card>
        </AuthLayout >

    );
}
