import MainLayout from "~/layouts/MainLayout";
import api from './api/trpc/[trpc]'
import { authRouter } from "~/server/api/routers/User";

export default function Home() {
  const data = authRouter.authenticate.use
    return(
      <MainLayout title="Home">
        {/* <button onClick={() => signIn("credentials", { username: 'admin', password: 'VuvuWedding@2021' })}>SignIn</button> */}
      </MainLayout>
    );
}
//vuvuwedding VuvuWedding@2021