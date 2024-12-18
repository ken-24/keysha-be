import {
  MIDTRANS_MERCHANT_NAME,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_URL_API,
} from "@/constant/midtrans";
import {
  resClientError,
  resNotAllowed,
  resNotFound,
  resServerError,
  resSuccess,
} from "@/helper/response";
import randomCharacter from "@/helper/randomCharacter";
import userAuth from "@/middleware/userAuth";
import { getCartById, deleteCartProduct } from "@/models/cart";
import {
  midtransTransaction,
  makeTransaction,
  findPendingTransaction,
} from "@/models/transaction";
import axios from "axios";


const midtransCheckout = async (order_id, gross_amount, product_details) => {
  try {
    const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString(
      "base64"
    );

    const { data } = await axios.post(
      MIDTRANS_URL_API + "/snap/v1/transactions",
      {
        transaction_details: {
          order_id,
          gross_amount,
        },
        product_details, // Tambahkan product_details ke payload
      },
      {
        headers: {
          Authorization: `Basic ${encodedServerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Midtrans Error:", error.response?.data || error.message);
    return new Error("MIDTRANS_ERROR");
  }
};

async function handler(req, res) {
  const { id } = req.query;
  const { userId } = req.decoded;

  try {
    if (req.method === "POST") {

      // Cek apakah ada transaksi pending untuk user ini
      const pendingTransaction = await findPendingTransaction(userId);
      if (pendingTransaction) {
        return res
          .status(400)
          .json(resClientError("Selesaikan transaksi sebelumnya."));
      }

      // Ambil data cart dari database
      const cartProducts = await getCartById(userId);

      if (cartProducts.length === 0) {
        return res.status(400).json(resClientError("Keranjang Anda kosong."));
      }

      // Hitung total harga dan siapkan product_details untuk Midtrans
      const product_details = cartProducts.map((cartProduct) => ({
        id: cartProduct.product.productId,
        name: cartProduct.product.name,
        quantity: cartProduct.quantity,
        price: parseInt(cartProduct.product.price, 10),
        subtotal: cartProduct.quantity * parseInt(cartProduct.product.price, 10),
      }));


      const gross_amount = product_details.reduce(
        (total, product) => total + product.subtotal,
        0
      );

      // Buat order_id unik untuk transaksi
      const order_id = `ORDER-${Date.now()}}`;

      // Simpan transaksi ke database
      const transaction = await makeTransaction(
        userId,
        gross_amount,
        cartProducts,
      );

      // Kirim transaksi ke Midtrans
      const pay = await midtransCheckout(
        transaction.transactionId,
        gross_amount,
        product_details
      );

      if (pay instanceof Error) {
        return res.status(400).json(resClientError(pay.message));
      }
      const mtTrans = await midtransTransaction(
        transaction.transactionId,
        pay.token,
        pay.redirect_url
      );

      // Hapus product di tabel cart
      const deletePromises = cartProducts.map((cartProduct) =>
        deleteCartProduct(cartProduct.cartId)
      );
      await Promise.all(deletePromises);

      return res.status(200).json(
        resSuccess("Transaksi berhasil dibuat", {
          ...mtTrans,
          cartProducts,
        })
      );
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);
