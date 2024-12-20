import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import {
  checkCart,
  addProductToCart,
  updateQuantity,
  getCartById,
} from "@/models/cart";


async function handler(req, res) {
  try {
    if (req.method === "GET") {

      const cartProducts = await getCartById();

      return res
        .status(200)
        .json(resSuccess("Data Keranjang", cartProducts));
    }
    if (req.method === "DELETE") {
      const { itemId } = req.body;
      const { userId } = req.decoded;
      const cartProducts = await getCartById();
      return res.status(200).json(resSuccess("Data Keranjang", cartProducts));
    }

    if (req.method === "POST") {
      const { itemId, quantity } = req.body;
      const { userId } = req.decoded;

      // Validasi input
      if (!itemId || !quantity) {
        return res
          .status(400)
          .json(resClientError("Invalid item ID or quantity"));
      }

      // Cek apakah item sudah ada di cart
      const existingCartProduct = await checkCart(userId, itemId);

      if (existingCartProduct) {
        // Jika sudah ada, tambahkan kuantitas
        if (existingCartProduct.quantity + quantity <= 0) {
          return res
            .status(400)
            .json(resClientError("Kuantitas tidak boleh kurang dari 0"));
        } else {
          const updatedCart = await updateQuantity(
            existingCartProduct.cartId,
            quantity
          );

          return res
            .status(200)
            .json(resSuccess("Product quantity updated in cart", updatedCart));
        }
      }

      // Jika belum ada, tambahkan item baru
      const newCartProduct = await addProductToCart(userId, itemId, quantity);

      return res
        .status(200)
        .json(resSuccess("Product added to cart", newCartProduct));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error(error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);
