import { Navbar } from "../navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="w-full">
      <Navbar title={title} />
      <div className="w-full px-4 pb-8 pt-8 sm:px-8">{children}</div>
    </div>
  );
}
