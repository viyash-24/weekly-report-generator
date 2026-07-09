// Shared layout for all authenticated pages (sidebar + header)
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children, activePage, activeTab, searchPlaceholder }) {
  return (
    <div className="bg-background text-on-background font-body-md antialiased h-screen overflow-hidden flex">
      <Sidebar activePage={activePage} />
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        <Header activeTab={activeTab} searchPlaceholder={searchPlaceholder} />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-surface-container-lowest w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
