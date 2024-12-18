import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getAllProducts, createProduct } from "@/models/item";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const items = await getAllProducts();
      return res.status(200).json(resSuccess("Product", items));
    }

    if (req.method === "POST") {
      const { name, description, price, type } =
        req.body;

      if (!name || !description || !price || !type) {
        return res.status(400).json(resClientError("Semua field harus diisi"));
      }
      if (isNaN(Number(price))) {
        return res.status(400).json(resClientError("Harga harus berupa angka"));
      }

      const packages = await createProduct(
        name,
        description,
        "/",
        Number(price),
        type
      );

      return res.status(200).json(resSuccess("Data Paket", packages));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);
