import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
      </div>
    </div>
  );
}