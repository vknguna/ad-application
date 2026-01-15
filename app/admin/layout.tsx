import { checkSiteAuth } from '@/lib/auth-check';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await checkSiteAuth();
    return <>{children}</>;
}
