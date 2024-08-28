import axios from "axios";

export const UploadImage = async (
  file: File,
): Promise<{ status: number; data: any }> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const apiUrl = "https://api.imgbb.com/1/upload";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(`${apiUrl}?key=${apiKey}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
