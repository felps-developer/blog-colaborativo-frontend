import AuthLayout from '@/components/layouts/AuthLayout';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}

