import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { uploadDoctorImage } from "../../cloudinary";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setDocImg(false);
    setName("");
    setEmail("");
    setPassword("");
    setExperience("1 Year");
    setFees("");
    setAbout("");
    setSpeciality("General physician");
    setDegree("");
    setAddress1("");
    setAddress2("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!docImg) {
      toast.error("Image Not Selected");
      return;
    }

    setIsSubmitting(true);

    try {
        const imageUrl = await uploadDoctorImage(docImg);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const doctor = userCredential.user;

      await setDoc(doc(db, "users", doctor.uid), {
        uid: doctor.uid,
        name,
        email,
        role: "doctor",
        phone: "",
        specialty: speciality,
        education: degree,
        experience,
        fees: Number(fees),
        about,
        address: {
          line1: address1,
          line2: address2,
        },
        available: true,
        image: imageUrl,
        createdAt: new Date(),
      });

      toast.success("Doctor added successfully");
      clearForm();
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already used");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters");
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium text-gray-700">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll shadow-sm text-sm text-gray-600">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer object-cover aspect-square border border-dashed border-gray-300"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload Area"
            />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
          />

          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
                type="text"
                placeholder="Education"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF]"
                type="text"
                placeholder="Address Line 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 border-gray-300 outline-[#5F6FFF] mt-2"
                type="text"
                placeholder="Address Line 2"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="mt-2 mb-1">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border rounded px-4 py-2 border-gray-300 outline-[#5F6FFF]"
            placeholder="Write brief info about the doctor"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#5F6FFF] px-10 py-3 mt-4 text-white rounded-full hover:bg-opacity-90 transition-all text-base disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add Doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;