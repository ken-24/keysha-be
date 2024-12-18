import {
    resClientError,
    resNotAllowed,
    resServerError,
    resSuccess,
  } from "@/helper/response";
  import userAuth from "@/middleware/userAuth";
  import { deleteCartProduct } from "@/models/cart";
  
  async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));
    try {
      if (req.method === "DELETE") {
        const cartProducts = await deleteCartProduct(id);
        return res.status(200).json(resSuccess("Hapus item keranjang", cartProducts));
      }
  
      return res.status(405).json(resNotAllowed());
    } catch (error) {
      console.error(error);
      return res.status(500).json(resServerError());
    }
  }
  
  export default userAuth(handler);
  