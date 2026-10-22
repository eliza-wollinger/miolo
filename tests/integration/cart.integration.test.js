import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import cartUtils from '../../js/cart-utils.js';

const {
  addToCart,
  changeQuantity,
  calculateTotal
} = cartUtils;

describe('Miolo - Integração do Carrinho', () => {
  let storage;

  const products = [
    {
      id: 'cupcake-1',
      name: 'Laranja Atrevida',
      price: 17.9,
      available: true
    },
    {
      id: 'cupcake-2',
      name: 'Morango Indecente',
      price: 18.9,
      available: true
    }
  ];

  beforeEach(() => {
    const dom = new JSDOM(
      '<!DOCTYPE html><html><body></body></html>',
      { url: 'https://miolo.test' }
    );

    storage = dom.window.localStorage;
    storage.clear();
  });

  it('deve adicionar um produto e salvar no localStorage', () => {
    let cart = {};

    cart = addToCart(cart, 'cupcake-1');

    storage.setItem('miolo_cart', JSON.stringify(cart));

    const savedCart = JSON.parse(
      storage.getItem('miolo_cart')
    );

    expect(savedCart['cupcake-1']).toBe(1);
  });

  it('deve recuperar um carrinho armazenado', () => {
    storage.setItem(
      'miolo_cart',
      JSON.stringify({ 'cupcake-1': 2 })
    );

    const restoredCart = JSON.parse(
      storage.getItem('miolo_cart')
    );

    expect(restoredCart).toEqual({
      'cupcake-1': 2
    });
  });

  it('deve atualizar o total após aumentar a quantidade', () => {
    let cart = addToCart({}, 'cupcake-1');

    cart = changeQuantity(cart, 'cupcake-1', 1);

    const total = calculateTotal(cart, products);

    expect(total).toBeCloseTo(35.8, 2);
  });

  it('deve remover um produto e zerar o total', () => {
    let cart = { 'cupcake-2': 1 };

    cart = changeQuantity(cart, 'cupcake-2', -1);

    storage.setItem('miolo_cart', JSON.stringify(cart));

    expect(cart).toEqual({});
    expect(calculateTotal(cart, products)).toBe(0);
  });
});
