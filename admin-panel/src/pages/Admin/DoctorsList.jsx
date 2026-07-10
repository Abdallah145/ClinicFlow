import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const {
  doctors,
  getAllDoctors,
  toggleDoctorAvailability,
} = useContext(AdminContext);

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      {doctors.length === 0 ? (
        <p className="mt-5 text-gray-500">No doctors found.</p>
      ) : (
        <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
          {doctors.map((item) => (
            <div
              className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden group"
              key={item.id}
            >
              {item.image ? (
                <img
                  className="w-56 h-48 object-cover bg-indigo-50"
                  src={item.image}
                  alt={item.name}
                />
              ) : (
                <div className="w-56 h-48 bg-indigo-50 flex items-center justify-center text-5xl text-indigo-400">
                  {item.name?.charAt(0)?.toUpperCase() || "D"}
                </div>
              )}

              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {item.name}
                </p>

                <p className="text-zinc-600 text-sm">
                  {item.specialty || "General physician"}
                </p>

                <p className="text-zinc-500 text-xs mt-1">
                  {item.experience || "Experience not specified"}
                </p>

                <p className="text-zinc-700 text-sm mt-1">
                  Fees: {item.fees ?? 0}
                </p>

<button
  type="button"
  onClick={() => toggleDoctorAvailability(item.id, item.available)}
  className={`mt-3 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
    item.available
      ? "bg-green-100 text-green-700 hover:bg-green-200"
      : "bg-red-100 text-red-700 hover:bg-red-200"
  }`}
>
  {item.available ? "Available" : "Not available"}
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;