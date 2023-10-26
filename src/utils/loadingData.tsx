import { AnyRouter, inferRouterInputs } from "@trpc/server";
import { GlobalConfig } from "~/config/GlobalConfig";
import { AppRouter } from "~/server/api/root";
import { api } from "./api";
import { CreateTRPCNextBase } from "@trpc/next/dist/createTRPCNext";
import { input } from "@nextui-org/react";
import { NextPageContext } from "next/dist/shared/lib/utils";


type TRouter = AppRouter
type SSRContext = NextPageContext


const LoadingDataAPI = (router: TRouter, SSRContext: SSRContext, page: number) => {

  console.log(router);
  console.log(SSRContext);
 

}

export default LoadingDataAPI
