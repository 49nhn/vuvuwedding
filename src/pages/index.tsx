// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import MainLayout from "~/layouts/MainLayout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout />
    </>
  );
}
