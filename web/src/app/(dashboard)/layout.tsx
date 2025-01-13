export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header>
        <h1>Dashboard Header</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
