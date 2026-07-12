import React, { useState, useRef, useEffect } from 'react'
import { assets } from "../assets/assets_frontend/assets";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadProfileImage } from "../cloudinary";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { currentUser, loading: authLoading, setUserData: setAuthUserData } = useAuth()
  const [isEdit, setIsEdit] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  const [userData, setUserData] = useState({
    name: "",
    image: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: ""
    },
    gender: "Male",
    dob: ""
  })

  // Keep a backup of userData to rollback if they cancel editing
  const [tempUserData, setTempUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        setProfileLoading(true)
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData({
            name: data.name || "",
            image: data.image || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || "",
            address: data.address || { line1: "", line2: "" },
            gender: data.gender || "Male",
            dob: data.dob || ""
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load profile data.")
      } finally {
        setProfileLoading(false)
      }
    }

    if (!authLoading) {
      fetchUserData()
    }
  }, [currentUser, authLoading])

  const handleEditToggle = async () => {
    if (!isEdit) {
      // Entering edit mode: store backup
      setTempUserData({ ...userData, address: { ...userData.address } })
      setIsEdit(true)
    } else {
      // Saving changes
      await handleSave()
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      let finalImageUrl = userData.image

      if (imageFile) {
        // Upload to Cloudinary
        const uploadToastId = toast.loading("Uploading profile image...")
        try {
          finalImageUrl = await uploadProfileImage(imageFile)
          toast.dismiss(uploadToastId)
        } catch (uploadError) {
          toast.dismiss(uploadToastId)
          throw new Error("Failed to upload image to Cloudinary: " + uploadError.message)
        }
      }

      const userRef = doc(db, "users", currentUser.uid)
      const updatedFields = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        dob: userData.dob,
        image: finalImageUrl
      }

      await updateDoc(userRef, updatedFields)

      const updatedProfile = {
        ...userData,
        ...updatedFields
      }

      setUserData(updatedProfile)
      setAuthUserData(updatedProfile)
      setImageFile(null)
      setImagePreview("")
      setIsEdit(false)
      toast.success("Profile saved successfully!")
    } catch (error) {
      console.error("Error saving profile details:", error)
      toast.error(error.message || "Failed to save profile.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (tempUserData) {
      setUserData(tempUserData)
    }
    setImageFile(null)
    setImagePreview("")
    setIsEdit(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="text-center my-20 text-gray-500">
        Please sign in to view your profile.
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-6 my-8 animate-fade-in'>
      {/* Profile Container Card */}
      <div className='bg-white rounded-3xl border border-zinc-100 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl'>

        {/* Banner/Header Block with Premium Gradient & Wave Pattern */}
        <div className='h-40 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 relative overflow-hidden'>
          <div className='absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]'></div>
          <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
          <div className='absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl'></div>
        </div>

        {/* Profile Details Body */}
        <div className='p-6 md:p-8 relative'>

          {/* Avatar wrapper scales cleanly on mobile viewports */}
          <div className='absolute -top-16 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 group z-10'>
            <div 
              onClick={() => isEdit && !isSubmitting && fileInputRef.current?.click()}
              className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-zinc-50 relative ${isEdit && !isSubmitting ? 'cursor-pointer group-hover:brightness-90 transition-all duration-300' : ''}`}
            >
              {imagePreview || userData.image ? (
                <img className='w-full h-full object-cover' src={imagePreview || userData.image} alt="Profile avatar" />
              ) : (
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-400">
                  <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}

              {isEdit && !isSubmitting && (
                <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className='text-xs font-semibold'>Change Photo</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className='hidden' 
              accept="image/*" 
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
          </div>

          {/* User identity details header area */}
          <div className='pt-16 sm:pt-10 md:pt-0 pl-0 sm:pl-40 md:pl-48 flex flex-col sm:flex-row justify-between items-center sm:items-start md:items-center gap-4 mb-8 text-center sm:text-left'>
            <div className='w-full max-w-md'>
              {isEdit ? (
                <div className='relative mt-2'>
                  <input
                    className='w-full bg-zinc-50 border-2 border-indigo-100 focus:border-indigo-500 rounded-xl px-4 py-2 text-2xl font-semibold text-neutral-800 focus:outline-none transition-all'
                    type="text"
                    value={userData.name}
                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <h1 className='text-2xl md:text-3xl font-bold text-neutral-800 tracking-tight flex items-center justify-center sm:justify-start gap-2.5'>
                  {userData.name}
                  <span className='inline-flex items-center p-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100' title="Verified Account">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </h1>
              )}
              <p className='text-sm text-zinc-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5'>
                <span className='w-2 h-2 bg-indigo-500 rounded-full animate-pulse' /> Patient Profile
              </p>
            </div>

            {/* Desktop Action Controls */}
            <div className='hidden sm:flex gap-3'>
              {isEdit ? (
                <>
                  <button 
                    className='border border-zinc-200 bg-white text-neutral-600 hover:bg-zinc-50 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm flex items-center gap-1.5'
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    className='bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-95 hover:shadow-indigo-100 hover:shadow-lg px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center gap-1.5' 
                    onClick={handleEditToggle}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button 
                  className='border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center gap-1.5' 
                  onClick={handleEditToggle}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Two-Column Information Dashboard Grids */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>

            {/* Column 1: Contact Segment */}
            <div className='p-6 bg-gradient-to-b from-zinc-50/50 to-white rounded-2xl border border-zinc-100 shadow-sm'>
              <div className='flex items-center gap-2 mb-5 pb-3 border-b border-zinc-100'>
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className='text-sm font-bold uppercase tracking-wider text-zinc-700'>Contact Information</h2>
              </div>

              <div className='space-y-5'>
                <div>
                  <label className='text-xs font-semibold text-zinc-400 block mb-1.5'>Email Address</label>
                  <div className='relative'>
                    <p className='text-sm font-medium text-neutral-800 bg-zinc-50/70 p-3 pl-10 rounded-xl border border-zinc-200/50 select-all'>
                      {userData.email}
                    </p>
                    <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold text-zinc-400 block mb-1.5'>Phone Number</label>
                  {isEdit ? (
                    <div className='relative'>
                      <input
                        className='w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 pl-10 text-sm font-medium text-neutral-800 focus:outline-none transition-all'
                        type="text"
                        value={userData.phone}
                        onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={isSubmitting}
                      />
                      <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center gap-3 bg-zinc-50/30 p-3 rounded-xl border border-zinc-100'>
                      <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <p className='text-sm font-medium text-neutral-800'>{userData.phone || "No phone added"}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className='text-xs font-semibold text-zinc-400 block mb-1.5'>Residential Address</label>
                  {isEdit ? (
                    <div className='space-y-2.5'>
                      <div className='relative'>
                        <input
                          className='w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 pl-10 text-sm focus:outline-none transition-all'
                          onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                          value={userData.address.line1}
                          type="text"
                          placeholder="Street line 1"
                          disabled={isSubmitting}
                        />
                        <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className='relative'>
                        <input
                          className='w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 pl-10 text-sm focus:outline-none transition-all'
                          onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                          value={userData.address.line2}
                          type="text"
                          placeholder="City, Country"
                          disabled={isSubmitting}
                        />
                        <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V10a2 2 0 00-2-2h-1a2 2 0 00-2-2V5a2 2 0 00-2-2H9.05" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='flex gap-3 bg-zinc-50/30 p-3 rounded-xl border border-zinc-100 items-start'>
                      <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 mt-0.5'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <p className='text-sm font-medium text-neutral-700 leading-relaxed'>
                        {userData.address.line1 || userData.address.line2 ? (
                          <>
                            {userData.address.line1 && <>{userData.address.line1}<br /></>}
                            {userData.address.line2 && <span className='text-zinc-400 font-normal'>{userData.address.line2}</span>}
                          </>
                        ) : (
                          <span className="text-zinc-400 font-normal">No address added</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Personal Stats Segment */}
            <div className='p-6 bg-gradient-to-b from-zinc-50/50 to-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between'>
              <div>
                <div className='flex items-center gap-2 mb-5 pb-3 border-b border-zinc-100'>
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 className='text-sm font-bold uppercase tracking-wider text-zinc-700'>Basic Information</h2>
                </div>

                <div className='space-y-5'>
                  <div>
                    <label className='text-xs font-semibold text-zinc-400 block mb-1.5'>Gender</label>
                    {isEdit ? (
                      <div className='relative'>
                        <select
                          className='w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 pl-10 text-sm font-medium text-neutral-800 focus:outline-none transition-all appearance-none'
                          onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                          value={userData.gender}
                          disabled={isSubmitting}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3 bg-zinc-50/30 p-3 rounded-xl border border-zinc-100'>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${userData.gender === 'Male' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-pink-50 text-pink-700 border-pink-100'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${userData.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                          {userData.gender}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='text-xs font-semibold text-zinc-400 block mb-1.5'>Date of Birth</label>
                    {isEdit ? (
                      <div className='relative'>
                        <input
                          className='w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 pl-10 text-sm font-medium text-neutral-800 focus:outline-none transition-all'
                          type="date"
                          onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                          value={userData.dob}
                          disabled={isSubmitting}
                        />
                        <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3 bg-zinc-50/30 p-3 rounded-xl border border-zinc-100'>
                        <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className='text-sm font-medium text-neutral-800'>
                          {userData.dob ? (
                            new Date(userData.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          ) : (
                            <span className="text-zinc-400 font-normal">No date of birth added</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Mobile Bottom Floating Action Controls */}
          <div className='mt-8 pt-6 border-t border-zinc-100 sm:hidden flex flex-col gap-3'>
            {isEdit ? (
              <>
                <button 
                  className='w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2'
                  onClick={handleEditToggle}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  className='w-full border border-zinc-200 bg-white text-neutral-600 py-3.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2'
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className='w-full border border-indigo-100 bg-indigo-50/50 text-indigo-600 py-3.5 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2'
                onClick={handleEditToggle}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default MyProfile