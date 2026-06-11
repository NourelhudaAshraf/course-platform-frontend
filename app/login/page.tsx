import Login from "@/components/Login/page";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <Login redirectTo={redirect} />;
}
