export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to Your Platform
      </h1>
      <p className="text-lg text-gray-700 mt-4">
        Collaborate, showcase, and innovate.
      </p>
      <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Get Started
      </button>
    </main>
  );
}
