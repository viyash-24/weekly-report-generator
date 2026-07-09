// Footer component
export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface px-xl py-md flex justify-between items-center">
      <span className="font-body-sm text-body-sm text-secondary">© 2024 Weekly Report Generator. All rights reserved.</span>
      <div className="flex gap-md">
        <a href="#" className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors">Privacy</a>
        <a href="#" className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors">Terms</a>
        <a href="#" className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors">Support</a>
      </div>
    </footer>
  );
}
