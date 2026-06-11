import LoginForm from "./LoginForm/page";

export default function Login({ redirectTo }: { redirectTo?: string }) {
  return <LoginForm redirectTo={redirectTo} />;
}
