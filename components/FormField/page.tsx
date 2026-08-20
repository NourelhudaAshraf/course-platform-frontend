import { Label } from "@/components/ui/label";

export default function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
