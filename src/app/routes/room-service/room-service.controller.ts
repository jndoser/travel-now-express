import { Request, Response, Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "./room-service.service";

const router = Router();

router.get("/services", async (req: Request, res: Response) => {
  const services = await getServices();
  res.json(services);
});

router.get("/services/:serviceId", async (req: Request, res: Response) => {
  const service = await getServiceById(req.params.serviceId);
  res.json(service);
});

router.post("/services", async (req: Request, res: Response) => {
  try {
    const newService = await createService({ ...req.body });
    res.json(newService);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

router.put("/services/:serviceId", async (req: Request, res: Response) => {
  try {
    const updatedService = await updateService(req.params.serviceId, {
      ...req.body,
    });
    res.json(updatedService);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

router.delete("/services/:serviceId", async (req: Request, res: Response) => {
  try {
    const id = await deleteService(req.params.serviceId);
    res.json(id);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

export default router;
