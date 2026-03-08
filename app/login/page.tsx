import { Suspense } from "react";
import { LoginContent } from "@/components/login-content";
import { Header } from "@/components/header";

export default function LoginPage() {
  return (
    <>
      <Header user={null} />
      <Suspense>
        <LoginContent />
      </Suspense>
    </>
  );
}
