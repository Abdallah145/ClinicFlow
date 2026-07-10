import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold text-gray-800">
        Access Denied
      </h1>

      <p className="text-gray-500">
        You do not have permission to open this page.
      </p>

      <Link
        to="/"
        className="bg-primary text-white px-5 py-2 rounded-md"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;