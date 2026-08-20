import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm/page";

export default function Login({
  redirectTo,
}: {
  readonly redirectTo?: string;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-dvh px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Login
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <LoginForm redirectTo={redirectTo} />
      </Card>
    </div>
  );
}
