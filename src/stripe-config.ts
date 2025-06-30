export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
  currency: string;
  interval?: 'month' | 'year';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SUH6VrM3a3BIJV',
    priceId: 'price_1RZIYkQx4KOzNGcI2bvQlSjt',
    name: 'Sabor & Vida Premium Mensal',
    description: 'Acesso completo a todas as receitas, planos personalizados e recursos exclusivos.',
    mode: 'subscription',
    price: 'R$ 19,90',
    currency: 'BRL',
    interval: 'month'
  },
  {
    id: 'prod_SUHC2yDkoqojFE',
    priceId: 'price_1RZIdmQx4KOzNGcIpg3iNizI',
    name: 'Sabor & Vida Premium Anual',
    description: 'Acesso completo por um ano com desconto.',
    mode: 'subscription',
    price: 'R$ 159,00',
    currency: 'BRL',
    interval: 'year'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};