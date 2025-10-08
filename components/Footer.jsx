// Footer component: App footer
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4 mt-8 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} PropertyApp. All rights reserved.
    </footer>
  );
}
