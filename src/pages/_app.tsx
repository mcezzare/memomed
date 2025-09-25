import type { AppProps } from "next/app";
import { useEffect } from "react";
import { subscribePush } from "@/utils/push";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    subscribePush();
  }, []);

  return <Component {...pageProps} />;
}