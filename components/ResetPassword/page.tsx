import ResetPasswordForm from "./ResetPasswordForm/page";

export default function ResetPassword({ token }: { token: string }) {
  return <ResetPasswordForm token={token} />;
}
