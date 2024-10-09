import { Request, Response, Router } from "express";
import { deleteImage, uploadImage } from "../../libs/cloudinary";
import multer from "multer";

const router = Router();
const upload = multer();

router.post(
  "/images/upload",
  upload.array("file"),
  async (req: Request, res: Response) => {
    const formDataEntryValues = Array.from(req.files as Express.Multer.File[]);

    const responseData = [];

    for (const formDataEntryValue of formDataEntryValues) {
      const data = (await uploadImage(
        formDataEntryValue,
        "vue-travel-now"
      )) as any;

      responseData.push({
        display_name: data.display_name,
        public_id: data.public_id,
        url: data.url,
      });
    }
    res.status(201).json({ responseData });
  }
);

router.delete("/images/upload/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const deleteResult = await deleteImage("vue-travel-now/" + id);

  res.status(201).json({ deleteResult });
});

export default router;
