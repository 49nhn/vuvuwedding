import { type FormEvent } from "react";
import AuthLayout from "~/layouts/AuthLayout";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'
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
            <h2 className="text-2xl font-bold pb-8">VUVU WEDDING</h2>
            <form className="card p-6 border " onSubmit={(e) => submitLogin(e)}>

                {login.error && <div className="bg-red-500 text-white p-1 my-2 ">
                    {login.error?.message}
                </div>}
                <div className="form-group mb-2">
                    <label className="label-text mb-2" htmlFor="email">Username</label>
                    <input type="text" name="username" placeholder="username" className="input  input-sm input-bordered input-secondary w-full max-w-xs" />
                </div>
                <div className="form-group mb-2">
                    <label className="label-text mb-1" htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="********" className="input  input-sm input-bordered input-secondary w-full max-w-xs" />
                </div>
                <div className="flex justify-center">
                    {
                        login.isLoading ? <div className="btn  btn-wide btn-sm btn-secondary text-white">Loading</div>
                            : <button className="btn  btn-wide btn-sm btn-secondary text-white">Login</button>
                    }
                </div>
            </form>
        </AuthLayout >

    );
}