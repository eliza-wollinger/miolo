
/**
 * Miolo - Cart Utilities
 * Funções de apoio para gerenciamento do carrinho.
 */

function addToCart(cart, productId) {
  return {
    ...cart,
    [productId]: (cart[productId] || 0) + 1
  };
}

function changeQuantity(cart, productId, delta) {
  const updatedCart = { ...cart };

  const quantity = Math.max(
    0,
    (updatedCart[productId] || 0) + delta
  );

  if (quantity === 0) {
    delete updatedCart[productId];
  } else {
    updatedCart[productId] = quantity;
  }

  return updatedCart;
}

function calculateTotal(cart, products) {
  return Object.entries(cart).reduce(
    (total, [id, quantity]) => {
      const product = products.find(
        (item) => String(item.id) === String(id)
      );

      if (!product || !product.available) {
        return total;
      }

      return total + product.price * quantity;
    },
    0
  );
}

if (typeof module !== "undefined") {
  module.exports = {
    addToCart,
    changeQuantity,
    calculateTotal
  };
}
