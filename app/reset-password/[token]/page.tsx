import ResetPassword from "@/components/ResetPassword/page";

export default async function ResetPasswordPage({
  params,
}: {
  readonly params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ResetPassword token={token} />;
}
