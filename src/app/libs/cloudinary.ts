import cloudinary from "cloudinary";

export const uploadImage = async (file: Express.Multer.File, folder: string) => {
  const buffer = await file.buffer;
  const bytes = Buffer.from(buffer);
  return new Promise(async (resolve, reject) => {
    cloudinary.v2.config({
      cloud_name: "de3myhvle",
      api_key: "519859121153722",
      api_secret: process.env.CLOUDINARY_SECRET_API,
    });
    await cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        async (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        }
      )
      .end(bytes);
  });
};

export const deleteImage = async (public_id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      cloudinary.v2.config({
        cloud_name: "de3myhvle",
        api_key: "519859121153722",
        api_secret: process.env.CLOUDINARY_SECRET_API,
      });
      const result = await cloudinary.v2.uploader.destroy(public_id);
      resolve(result);
    } catch (error: any) {
      reject(new Error(error.message));
    }
  });
};
