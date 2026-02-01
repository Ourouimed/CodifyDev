import cloudinary from "../config/cloud.js";

const uploadImage = async (file, folder_name) => {
  if (!file) return null;

  // 1. Ensure we have a Buffer (Node.js environment)
  // If 'file.buffer' is an ArrayBuffer, convert it.
  const buffer = Buffer.isBuffer(file.buffer) 
    ? file.buffer 
    : Buffer.from(file.buffer);

  // 2. Wrap the Cloudinary stream in a Promise
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: folder_name,
        resource_type: "auto" // Automatically detect if it's an image or other file type
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    // 3. Write the buffer to the stream
    stream.end(buffer);
  });
};

export { uploadImage };