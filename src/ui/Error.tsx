import { TRPCClientError, type TRPCClientErrorBase } from '@trpc/client';
import { type DefaultErrorShape } from '@trpc/server';

type ErrorProps = TRPCClientErrorBase<DefaultErrorShape> | null | undefined;

const Error = (error: ErrorProps) => {
  if (error instanceof TRPCClientError) {
    return error?.message;
  }
  return null;
};

export default Error;
