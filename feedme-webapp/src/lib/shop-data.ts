// ═══════════════════════════════════════════════════════
//  FeedMe — Virtual Shop Items & Prices
// ═══════════════════════════════════════════════════════

import type { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // Junk — expensive (forces lots of exercise to earn)
  { id: 'pizza',         name: 'Pizza Slice',       emoji: '🍕', description: 'A cheesy, greasy slice of heaven',     coinPrice: 500,  calories: 285,  category: 'junk' },
  { id: 'burger',        name: 'Cheeseburger',      emoji: '🍔', description: 'Classic beef cheeseburger',            coinPrice: 450,  calories: 350,  category: 'junk' },
  { id: 'fried-chicken', name: 'Fried Chicken',      emoji: '🍗', description: 'Crispy fried chicken (2 pieces)',      coinPrice: 400,  calories: 400,  category: 'junk' },
  { id: 'hotdog',        name: 'Hot Dog',            emoji: '🌭', description: 'Classic street-style hot dog',         coinPrice: 300,  calories: 290,  category: 'junk' },
  { id: 'fries',         name: 'French Fries',       emoji: '🍟', description: 'Golden crispy fries (medium)',         coinPrice: 250,  calories: 365,  category: 'junk' },

  // Snacks — moderate
  { id: 'chips',         name: 'Potato Chips',       emoji: '🥔', description: 'A bag of salty crunchy chips',         coinPrice: 200,  calories: 160,  category: 'snack' },
  { id: 'chocolate',     name: 'Chocolate Bar',      emoji: '🍫', description: 'Rich milk chocolate bar',             coinPrice: 180,  calories: 230,  category: 'snack' },
  { id: 'popcorn',       name: 'Buttered Popcorn',   emoji: '🍿', description: 'Movie-theater style popcorn',         coinPrice: 150,  calories: 190,  category: 'snack' },

  // Drinks
  { id: 'boba',          name: 'Bubble Tea',         emoji: '🧋', description: 'Sweet milk tea with tapioca pearls',   coinPrice: 300,  calories: 350,  category: 'drink' },
  { id: 'soda',          name: 'Soda Can',           emoji: '🥤', description: 'A cold fizzy soft drink',             coinPrice: 120,  calories: 140,  category: 'drink' },
  { id: 'frappe',        name: 'Caramel Frappé',     emoji: '☕', description: 'Blended iced coffee with whipped cream', coinPrice: 250, calories: 420, category: 'drink' },

  // Desserts — very expensive
  { id: 'ice-cream',     name: 'Ice Cream Sundae',   emoji: '🍨', description: 'Two scoops with toppings',            coinPrice: 350,  calories: 380,  category: 'dessert' },
  { id: 'cake',          name: 'Cake Slice',         emoji: '🍰', description: 'A slice of layered cake',             coinPrice: 400,  calories: 450,  category: 'dessert' },
  { id: 'donut',         name: 'Donut',              emoji: '🍩', description: 'Glazed ring donut',                   coinPrice: 200,  calories: 250,  category: 'dessert' },

  // Healthy — cheap (rewarding good choices)
  { id: 'salad',         name: 'Fresh Salad',        emoji: '🥗', description: 'Mixed greens with light dressing',    coinPrice: 50,   calories: 120,  category: 'healthy' },
  { id: 'smoothie',      name: 'Green Smoothie',     emoji: '🥤', description: 'Spinach, banana & almond milk',       coinPrice: 60,   calories: 150,  category: 'healthy' },
  { id: 'fruit-bowl',    name: 'Fruit Bowl',         emoji: '🍇', description: 'Mixed seasonal fruits',              coinPrice: 40,   calories: 95,   category: 'healthy' },
];

export const SHOP_CATEGORIES = [
  { id: 'all',     label: 'All',      emoji: '🛒' },
  { id: 'junk',    label: 'Junk Food', emoji: '🍕' },
  { id: 'snack',   label: 'Snacks',   emoji: '🍿' },
  { id: 'drink',   label: 'Drinks',   emoji: '🧋' },
  { id: 'dessert', label: 'Desserts', emoji: '🍰' },
  { id: 'healthy', label: 'Healthy',  emoji: '🥗' },
] as const;
