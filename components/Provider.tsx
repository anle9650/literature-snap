"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
    children: React.JSX.Element[];
    session?: Session;
}

const Provider = ({ children, session }: Props) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;