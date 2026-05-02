// Server-side restaurant data
// Mirrors src/data/mockData.js so the API works standalone

const HILTON_LOCATION = {
  name: 'Hilton Anatole Dallas',
  latitude: 32.7968,
  longitude: -96.8232,
  address: '2201 N Stemmons Fwy, Dallas, TX 75207',
};

const RESTAURANTS = [
  { id: 'r001', name: 'Osteria del Borgo', emoji: '🍝', cuisine: 'Italian', rating: 4.8, priceRange: '$$$', distance: 0.3, latitude: 32.7995, longitude: -96.8210, isOpen: true, closingTime: '10:00 PM', dietary: ['vegetarian', 'glutenFree'], isSponsored: true, sponsoredTag: 'New Seasonal Menu' },
  { id: 'r002', name: 'Verde Harvest', emoji: '🥗', cuisine: 'Mediterranean', rating: 4.7, priceRange: '$$', distance: 0.5, latitude: 32.7950, longitude: -96.8255, isOpen: true, closingTime: '11:00 PM', dietary: ['vegan', 'vegetarian', 'glutenFree', 'dairyFree'], isSponsored: true, sponsoredTag: 'Hilton Verified' },
  { id: 'r003', name: 'Trattoria Fiorentina', emoji: '🍕', cuisine: 'Italian', rating: 4.7, priceRange: '$$', distance: 0.4, latitude: 32.7985, longitude: -96.8195, isOpen: true, closingTime: '11:00 PM', dietary: ['vegetarian'], isSponsored: false },
  { id: 'r004', name: 'Casa Fuego', emoji: '🌮', cuisine: 'Mexican', rating: 4.4, priceRange: '$$', distance: 1.3, latitude: 32.8050, longitude: -96.8100, isOpen: true, closingTime: '10:00 PM', dietary: ['glutenFree', 'vegetarian'], isSponsored: false },
  { id: 'r005', name: 'Sakura Sushi', emoji: '🍣', cuisine: 'Japanese', rating: 4.6, priceRange: '$$$', distance: 0.8, latitude: 32.8020, longitude: -96.8170, isOpen: true, closingTime: '10:30 PM', dietary: ['glutenFree', 'dairyFree', 'nutFree'], isSponsored: false },
  { id: 'r006', name: 'Lumière Bistro', emoji: '🥖', cuisine: 'French', rating: 4.5, priceRange: '$$$', distance: 0.6, latitude: 32.7975, longitude: -96.8240, isOpen: true, closingTime: '10:00 PM', dietary: ['vegetarian'], isSponsored: false },
  { id: 'r007', name: 'Pho House', emoji: '🍜', cuisine: 'Vietnamese', rating: 4.3, priceRange: '$', distance: 0.9, latitude: 32.7920, longitude: -96.8290, isOpen: true, closingTime: '9:30 PM', dietary: ['glutenFree', 'dairyFree', 'nutFree'], isSponsored: false },
  { id: 'r008', name: 'Le Petit Café', emoji: '☕', cuisine: 'French', rating: 4.6, priceRange: '$$', distance: 1.1, latitude: 32.8080, longitude: -96.8190, isOpen: true, closingTime: '8:00 PM', dietary: ['vegetarian', 'glutenFree'], isSponsored: false },
  { id: 'r009', name: 'Grillhouse Prime', emoji: '🥩', cuisine: 'Steakhouse', rating: 4.5, priceRange: '$$$$', distance: 1.5, latitude: 32.7910, longitude: -96.8180, isOpen: true, closingTime: '11:00 PM', dietary: ['glutenFree', 'ketoFriendly', 'nutFree', 'shellfishFree'], isSponsored: false },
  { id: 'r010', name: 'Spice Route', emoji: '🍛', cuisine: 'Indian', rating: 4.4, priceRange: '$$', distance: 2.1, latitude: 32.8120, longitude: -96.8350, isOpen: true, closingTime: '10:00 PM', dietary: ['vegetarian', 'vegan', 'glutenFree', 'halal'], isSponsored: false },
  { id: 'r011', name: 'Bangkok Garden', emoji: '🍤', cuisine: 'Thai', rating: 4.5, priceRange: '$$', distance: 1.8, latitude: 32.7860, longitude: -96.8120, isOpen: true, closingTime: '10:00 PM', dietary: ['glutenFree', 'dairyFree', 'vegan'], isSponsored: false },
  { id: 'r012', name: 'Halal Cart Express', emoji: '🥙', cuisine: 'Mediterranean', rating: 4.2, priceRange: '$', distance: 0.7, latitude: 32.8000, longitude: -96.8150, isOpen: true, closingTime: '12:00 AM', dietary: ['halal', 'dairyFree', 'nutFree'], isSponsored: false },
  { id: 'r013', name: 'Keto Kitchen', emoji: '🥑', cuisine: 'American', rating: 4.3, priceRange: '$$', distance: 2.3, latitude: 32.7800, longitude: -96.8400, isOpen: false, closingTime: '8:00 PM', dietary: ['ketoFriendly', 'glutenFree', 'nutFree'], isSponsored: false },
  { id: 'r014', name: 'Seoul Kitchen', emoji: '🥢', cuisine: 'Korean', rating: 4.6, priceRange: '$$', distance: 1.6, latitude: 32.8100, longitude: -96.8050, isOpen: true, closingTime: '10:30 PM', dietary: ['dairyFree', 'nutFree'], isSponsored: false },
  { id: 'r015', name: 'Shellfish-Free Seafood Co.', emoji: '🐟', cuisine: 'American', rating: 4.4, priceRange: '$$$', distance: 2.8, latitude: 32.7700, longitude: -96.8500, isOpen: true, closingTime: '10:00 PM', dietary: ['shellfishFree', 'glutenFree', 'dairyFree'], isSponsored: false },
];

module.exports = { RESTAURANTS, HILTON_LOCATION };
