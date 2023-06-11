import "@/styles/globals.css";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    posthog.init("phc_nXeFpt9M4MZFy6P5guwh95h0y53Ha5bYzzHrqc7Iidq", {
      api_host: "https://app.posthog.com",
      autocapture: true,
    });
  }, []);

  return <Component {...pageProps} />;
}
