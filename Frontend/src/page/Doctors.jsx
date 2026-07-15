import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();

  const { doctors, doctorsLoading } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  // Rating Filter
  const [ratingFilter, setRatingFilter] = useState("all");

  // Available Filter
  const [availableOnly, setAvailableOnly] = useState(false);

  // Sort
  const [sortBy, setSortBy] = useState("");

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  

  useEffect(() => {
    let filtered = [...doctors];

    // Speciality
    if (speciality) {
      filtered = filtered.filter((doc) => {
        const doctorSpeciality = (doc.speciality || doc.specialty || "").trim();

        return doctorSpeciality === speciality.trim();
      });
    }

    // Search
    if (search.trim() !== "") {
      filtered = filtered.filter((doc) => {
        const name = (doc.name || "").toLowerCase();

        const spec = (doc.speciality || doc.specialty || "").toLowerCase();

        return (
          name.includes(search.toLowerCase()) ||
          spec.includes(search.toLowerCase())
        );
      });
    }

    // Rating Filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter((doc) => doc.rating >= Number(ratingFilter));
    }

    // Available
    if (availableOnly) {
      filtered = filtered.filter((doc) => doc.available);
    }

    // Sort
    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "experience") {
      filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
filtered.sort((a, b) => {
  const aAvailable = a.available !== false;
  const bAvailable = b.available !== false;

  if (aAvailable === bAvailable) {
    return 0;
  }

  return aAvailable ? -1 : 1;
});
    setFilterDoc(filtered);
  }, [doctors, speciality, search, ratingFilter, availableOnly, sortBy]);

  return (
    <div className="pb-8">
      {/* Header */}

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-3 px-4 mb-6">

  <div className="flex items-center gap-3">

    {/* Search */}
    <div className="flex-1">
      <input
        type="text"
        placeholder="🔍 Search doctors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-11 px-5 rounded-xl border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Filter Button */}
    <details className="relative">

      <summary className="list-none cursor-pointer bg-primary text-white px-5 h-11 rounded-xl flex items-center gap-2 hover:opacity-90">
        ⚙ Filters
      </summary>

      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border p-5 z-50">

        <p className="font-semibold mb-3">Sort By</p>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        >
          <option value="">Default</option>
          <option value="rating">Highest Rating</option>
          <option value="experience">Most Experience</option>
          <option value="name">A-Z</option>
        </select>

        <p className="font-semibold mb-3">Minimum Rating</p>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        >
          <option value="all">All Ratings</option>
          <option value="4.2">4.2+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={() => setAvailableOnly(!availableOnly)}
          />
          Available Only
        </label>

      </div>

    </details>

  </div>

</div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`lg:hidden py-3 rounded-xl border ${
            showFilter ? "bg-primary text-white" : "bg-white border-gray-300"
          }`}
        >
          Filters
        </button>

        {/* Sidebar */}
        <div
          className={`${
            showFilter ? "flex" : "hidden lg:flex"
          } flex-col gap-3 lg:w-64`}
        >
          {specialities.map((sp) => (
            <button
              key={sp}
              onClick={() =>
                speciality === sp
                  ? navigate("/doctors")
                  : navigate(`/doctors/${sp}`)
              }
              className={`text-left px-5 py-3 rounded-xl border transition-all duration-300 ${
                speciality === sp
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="flex-1">
          {doctorsLoading ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-lg text-gray-500">Loading Doctors...</p>
            </div>
          ) : filterDoc.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80">
              <h2 className="text-2xl font-semibold text-gray-700">
                No Doctors Found 😕
              </h2>

              <p className="text-gray-500 mt-2">
                Try another speciality or search keyword.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-5">
                <p className="text-gray-600">
                  Showing
                  <span className="font-semibold text-primary">
                    {" "}
                    {filterDoc.length}{" "}
                  </span>
                  Doctors
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterDoc.map((item) => (
                  <DoctorCard key={item.id || item._id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
