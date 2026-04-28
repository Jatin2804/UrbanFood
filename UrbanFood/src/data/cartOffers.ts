// ─────────────────────────────────────────────
//  Cart Offers Configuration
//  Add / remove / edit offers here only.
//  discountType:
//    'percentage' — deducts X% of totalPrice
//    'flat'       — deducts a fixed ₹ amount
// ─────────────────────────────────────────────

export interface CartOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  /** Minimum cart value required to apply this offer */
  minOrderValue: number;
}

export const CART_OFFERS: CartOffer[] = [
  {
    id: 'offer_welcome',
    code: 'WELCOME',
    title: 'Welcome Back!',
    description: 'Get 10% off on your order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
  },
  {
    id: 'offer_first3',
    code: 'FIRST3',
    title: 'First 3 Orders',
    description: '50% off — valid on your first 3 orders',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 0,
  },
  {
    id: 'offer_flat100',
    code: 'FLAT100',
    title: '₹100 Off',
    description: 'Flat ₹100 off on orders above ₹299',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 299,
  },
  {
    id: 'offer_flat200',
    code: 'FLAT200',
    title: '₹200 Off',
    description: 'Flat ₹200 off on orders above ₹599',
    discountType: 'flat',
    discountValue: 200,
    minOrderValue: 599,
  },
];
