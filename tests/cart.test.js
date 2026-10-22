
import { describe, it, expect } from "vitest";
import cartUtils from "../js/cart-utils.js";

const {
  addToCart,
  changeQuantity,
  calculateTotal
} = cartUtils;

describe("Miolo - Carrinho de Compras", () => {

  const products = [
    {
      id: "1",
      name: "Cookies & Caos",
      price: 17.9,
      available: true
    },
    {
      id: "2",
      name: "Laranja Atrevida",
      price: 17.9,
      available: true
    },
    {
      id: "3",
      name: "Morango Indecente",
      price: 18.9,
      available: false
    }
  ];

  it("deve adicionar um produto ao carrinho", () => {
    const cart = addToCart({}, "1");

    expect(cart["1"]).toBe(1);
  });

  it("deve incrementar a quantidade", () => {
    const cart = addToCart({ "1": 1 }, "1");

    expect(cart["1"]).toBe(2);
  });

  it("deve diminuir a quantidade", () => {
    const cart = changeQuantity({ "1": 3 }, "1", -1);

    expect(cart["1"]).toBe(2);
  });

  it("deve remover produtos com quantidade zero", () => {
    const cart = changeQuantity({ "1": 1 }, "1", -1);

    expect(cart).not.toHaveProperty("1");
  });

  it("não deve permitir quantidades negativas", () => {
    const cart = changeQuantity({ "1": 1 }, "1", -5);

    expect(cart["1"] ?? 0).toBe(0);
  });

  it("deve calcular o total corretamente", () => {
    const cart = {
      "1": 2,
      "2": 1
    };

    const total = calculateTotal(cart, products);

    expect(total).toBeCloseTo(53.7, 2);
  });

  it("deve ignorar produtos indisponíveis", () => {
    const cart = {
      "1": 1,
      "3": 1
    };

    const total = calculateTotal(cart, products);

    expect(total).toBeCloseTo(17.9, 2);
  });

  it("deve ignorar produtos inexistentes", () => {
    const cart = {
      "999": 2
    };

    const total = calculateTotal(cart, products);

    expect(total).toBe(0);
  });

  it("não deve alterar o carrinho original", () => {
    const original = { "1": 1 };

    addToCart(original, "1");

    expect(original["1"]).toBe(1);
  });

});
