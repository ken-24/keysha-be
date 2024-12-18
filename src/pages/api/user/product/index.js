import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import {
  getAllProducts,
  getAllProductsByType,
  getAllProductsPopular,
} from "@/models/item";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const type = req.query.type;
      
      if (type == 1) {
        const items = await getAllProductsByType(1);
        return res.status(200).json(resSuccess("Data Produk", items));
      } else if (type == 2) {
        const items = await getAllProductsByType(2);
        return res.status(200).json(resSuccess("Data Produk", items));
      } else {
        const items = await getAllProducts();
        return res.status(200).json(resSuccess("Data Produk", items));
      }
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);
