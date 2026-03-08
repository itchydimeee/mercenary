import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactContent } from "@/components/contact-content";

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userData = {
    name: user.user_metadata?.full_name ?? user.email ?? "User",
    email: user.email ?? "",
    profile_picture: user.user_metadata?.avatar_url ?? "",
  };

  return (
    <>
      <Header user={userData} />
      <ContactContent user={userData} />
      <Footer />
    </>
  );
}
