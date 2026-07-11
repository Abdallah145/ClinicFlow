export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("file", imageFile);
  formData.append("upload_preset", "clinicflow_doctors");
  formData.append("folder", "clinicflow/patients");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/fdmj1uow/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.secure_url;
};
