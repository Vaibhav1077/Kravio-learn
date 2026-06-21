const cloudinary = require("cloudinary").v2;

/**
 * Upload a file (image or video) to Cloudinary
 * @param {Object} file - File object from express-fileupload
 * @param {string} folder - Cloudinary folder name
 * @param {number} height - Optional height for resizing
 * @param {number} quality - Optional quality (1-100)
 * @returns {Promise<Object>} Cloudinary upload response
 */
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = {
    folder,
    resource_type: "auto",
    timeout: 120000, // 2 minute timeout for large videos
  };

  if (height) {
    options.height = height;
    options.crop = "scale";
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
};