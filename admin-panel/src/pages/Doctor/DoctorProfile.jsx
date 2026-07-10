import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getProfileData = async () => {
    try {
      setLoading(true);

      const currentDoctor = auth.currentUser;

      if (!currentDoctor) {
        toast.error("Please login as a doctor first.");
        return;
      }

      const doctorRef = doc(db, "users", currentDoctor.uid);
      const doctorSnapshot = await getDoc(doctorRef);

      if (!doctorSnapshot.exists()) {
        toast.error("Doctor profile was not found.");
        return;
      }

      const doctorData = doctorSnapshot.data();

      if (doctorData.role !== "doctor") {
        toast.error("This account is not a doctor account.");
        return;
      }

      setProfileData({
        id: doctorSnapshot.id,
        ...doctorData,
        address: doctorData.address || {
          line1: "",
          line2: "",
        },
        available:
          doctorData.available === undefined ? true : doctorData.available,
        fees: doctorData.fees || 0,
        about: doctorData.about || "",
      });
    } catch (error) {
      console.error("Get doctor profile error:", error);
      toast.error("Could not load doctor profile.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);

      const currentDoctor = auth.currentUser;

      if (!currentDoctor) {
        toast.error("Please login again.");
        return;
      }

      const doctorRef = doc(db, "users", currentDoctor.uid);

      await updateDoc(doctorRef, {
        fees: Number(profileData.fees || 0),
        about: profileData.about || "",
        address: {
          line1: profileData.address?.line1 || "",
          line2: profileData.address?.line2 || "",
        },
        available: profileData.available,
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully.");
      setIsEdit(false);
      getProfileData();
    } catch (error) {
      console.error("Update doctor profile error:", error);
      toast.error("Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  if (loading) {
    return <div className="m-5 w-full">Loading profile...</div>;
  }

  if (!profileData) {
    return (
      <div className="m-5 w-full text-red-500">
        Doctor profile could not be loaded.
      </div>
    );
  }

  const speciality = profileData.specialty || profileData.speciality || "";

  return (
    <div className="m-5 w-full max-w-3xl">
      <div className="flex flex-col gap-4 p-8 bg-white rounded-lg border shadow-sm">
        <div>
          {profileData.image ? (
            <img
              className="w-full sm:max-w-64 h-64 bg-[#5F6FFF] rounded-lg object-cover"
              src={profileData.image}
              alt={profileData.name}
            />
          ) : (
            <div className="w-full sm:max-w-64 h-64 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-500 text-5xl font-semibold">
              {profileData.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
          )}
        </div>

        <div className="flex-1 text-sm text-zinc-600">
          <p className="text-3xl font-medium text-gray-800">
            {profileData.name || "Doctor"}
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profileData.degree || "Doctor"} - {speciality}
            </p>

            <button className="py-0.5 px-2 border text-xs rounded-full">
              {profileData.experience || "Experience not specified"}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              About:
            </p>

            {isEdit ? (
              <textarea
                className="border p-2 rounded w-full max-w-[700px] mt-1 outline-none resize-none"
                rows="5"
                placeholder="Write something about yourself..."
                value={profileData.about || ""}
                onChange={(event) =>
                  setProfileData((previous) => ({
                    ...previous,
                    about: event.target.value,
                  }))
                }
              />
            ) : (
              <p className="text-xs text-gray-600 max-w-[700px] mt-1">
                {profileData.about || "No information available."}
              </p>
            )}
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment Fee:{" "}
            <span className="text-gray-800">
              $
              {isEdit ? (
                <input
                  type="number"
                  min="0"
                  className="border px-2 py-0.5 w-24 rounded outline-none ml-1"
                  onChange={(event) =>
                    setProfileData((previous) => ({
                      ...previous,
                      fees: event.target.value,
                    }))
                  }
                  value={profileData.fees}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          <div className="flex gap-2 py-2 mt-2">
            <p className="font-medium text-gray-700">Address:</p>

            <div className="text-xs flex-1">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    placeholder="Address line 1"
                    className="border p-1 rounded w-full mb-1 outline-none"
                    onChange={(event) =>
                      setProfileData((previous) => ({
                        ...previous,
                        address: {
                          ...previous.address,
                          line1: event.target.value,
                        },
                      }))
                    }
                    value={profileData.address?.line1 || ""}
                  />

                  <input
                    type="text"
                    placeholder="Address line 2"
                    className="border p-1 rounded w-full outline-none"
                    onChange={(event) =>
                      setProfileData((previous) => ({
                        ...previous,
                        address: {
                          ...previous.address,
                          line2: event.target.value,
                        },
                      }))
                    }
                    value={profileData.address?.line2 || ""}
                  />
                </>
              ) : (
                <>
                  <p>{profileData.address?.line1 || "No address added"}</p>
                  <p>{profileData.address?.line2 || ""}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-1 pt-2 items-center">
            <input
              type="checkbox"
              id="available"
              onChange={() =>
                isEdit &&
                setProfileData((previous) => ({
                  ...previous,
                  available: !previous.available,
                }))
              }
              checked={profileData.available}
              disabled={!isEdit}
              className="cursor-pointer w-4 h-4"
            />

            <label
              htmlFor="available"
              className="text-sm text-gray-600 font-medium cursor-pointer select-none ml-1"
            >
              Available for Appointments
            </label>
          </div>

          {isEdit ? (
            <button
              onClick={updateProfile}
              disabled={saving}
              className="px-4 py-2 border border-[#5F6FFF] text-sm rounded-full mt-6 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 border border-gray-300 text-sm rounded-full mt-6 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;