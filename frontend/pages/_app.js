import { useEffect } from "react";
import Router from "next/router";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const isPublic = ["/login"].includes(Router.pathname);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !isPublic) Router.replace("/login");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
