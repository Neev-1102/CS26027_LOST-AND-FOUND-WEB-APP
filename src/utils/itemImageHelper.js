/**
 * Item Image Helper
 * Resolves or generates high-quality Unsplash photos accurately matching item names and categories.
 */

// Curated high-resolution Unsplash images for common campus items
export const ITEM_IMAGE_CATALOG = {
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  calculator: 'https://images.unsplash.com/photo-1516201580490-33550d32de5c?auto=format&fit=crop&q=80&w=800',
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
  keys: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=800',
  bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
  idCard: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
  watch: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
  glasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
  clothing: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
  umbrella: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
  charger: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
  general: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=800',
};

// Generic placeholder URLs that should be replaced with name-matched images
const GENERIC_PLACEHOLDER_SUBSTRINGS = [
  'photo-1553062407-98eeb64c6a62', // navy backpack fallback
  'photo-1584438784894-089d6a62b8fa', // generic fallback
  'photo-1544816155-12df9643f363', // generic notebook fallback
  'photo-1611125832047-1d7ad1e8e49d', // laptop photo wrongly attached to calculator
  'photo-1594980596870-8aa52a78d8cd', // laptop photo wrongly attached to calculator
];

/**
 * Returns a fitting photo according to the item title/name and category
 */
export const getDefaultItemImage = (itemName = '', category = '') => {
  const text = `${itemName} ${category}`.toLowerCase();

  // Calculator
  if (
    text.includes('calc') ||
    text.includes('ti-84') ||
    text.includes('ti 84') ||
    text.includes('ti84') ||
    text.includes('scientific') ||
    text.includes('casio')
  ) {
    return ITEM_IMAGE_CATALOG.calculator;
  }

  // Phone / Smartphone
  if (
    text.includes('phone') ||
    text.includes('iphone') ||
    text.includes('mobile') ||
    text.includes('android') ||
    text.includes('smartphone') ||
    text.includes('cell') ||
    text.includes('galaxy') ||
    text.includes('pixel') ||
    text.includes('oneplus')
  ) {
    return ITEM_IMAGE_CATALOG.phone;
  }

  // Laptop / MacBook
  if (
    text.includes('macbook') ||
    text.includes('laptop') ||
    text.includes('chromebook') ||
    text.includes('thinkpad') ||
    text.includes('notebook pc') ||
    text.includes('dell') ||
    text.includes('computer')
  ) {
    return ITEM_IMAGE_CATALOG.laptop;
  }

  // Tablet / iPad
  if (text.includes('ipad') || text.includes('tablet') || text.includes('kindle')) {
    return ITEM_IMAGE_CATALOG.tablet;
  }

  // Headphones / Audio
  if (
    text.includes('headphone') ||
    text.includes('earphone') ||
    text.includes('airpod') ||
    text.includes('earbud') ||
    text.includes('headset') ||
    text.includes('audio') ||
    text.includes('sony wh')
  ) {
    return ITEM_IMAGE_CATALOG.headphones;
  }

  // Wallet
  if (
    text.includes('wallet') ||
    text.includes('purse') ||
    text.includes('billfold') ||
    text.includes('cardholder') ||
    text.includes('clutch')
  ) {
    return ITEM_IMAGE_CATALOG.wallet;
  }

  // Keys
  if (
    text.includes('key') ||
    text.includes('keychain') ||
    text.includes('fob') ||
    text.includes('latchkey')
  ) {
    return ITEM_IMAGE_CATALOG.keys;
  }

  // Water bottle
  if (
    text.includes('bottle') ||
    text.includes('flask') ||
    text.includes('hydroflask') ||
    text.includes('sipper') ||
    text.includes('tumbler') ||
    text.includes('thermos') ||
    text.includes('mug')
  ) {
    return ITEM_IMAGE_CATALOG.bottle;
  }

  // ID Cards & Documents
  if (
    text.includes('id card') ||
    text.includes('college id') ||
    text.includes('student id') ||
    text.includes('badge') ||
    text.includes('license') ||
    text.includes('metro card') ||
    text.includes('pass') ||
    text.includes('id-card')
  ) {
    return ITEM_IMAGE_CATALOG.idCard;
  }

  // Watch
  if (
    text.includes('watch') ||
    text.includes('smartwatch') ||
    text.includes('timepiece') ||
    text.includes('fitbit')
  ) {
    return ITEM_IMAGE_CATALOG.watch;
  }

  // Glasses
  if (
    text.includes('glass') ||
    text.includes('spectacle') ||
    text.includes('eyewear') ||
    text.includes('sunglass') ||
    text.includes('shades')
  ) {
    return ITEM_IMAGE_CATALOG.glasses;
  }

  // Backpack / Bag
  if (
    text.includes('backpack') ||
    text.includes('bag') ||
    text.includes('tote') ||
    text.includes('duffel') ||
    text.includes('rucksack') ||
    text.includes('satchel')
  ) {
    return ITEM_IMAGE_CATALOG.backpack;
  }

  // Umbrella
  if (text.includes('umbrella') || text.includes('parasol')) {
    return ITEM_IMAGE_CATALOG.umbrella;
  }

  // Charger / Cable
  if (
    text.includes('charger') ||
    text.includes('cable') ||
    text.includes('adapter') ||
    text.includes('power bank') ||
    text.includes('cord')
  ) {
    return ITEM_IMAGE_CATALOG.charger;
  }

  // Clothing
  if (
    text.includes('hoodie') ||
    text.includes('jacket') ||
    text.includes('shirt') ||
    text.includes('sweater') ||
    text.includes('coat') ||
    text.includes('clothing') ||
    text.includes('wear')
  ) {
    return ITEM_IMAGE_CATALOG.clothing;
  }

  // Book
  if (
    text.includes('book') ||
    text.includes('textbook') ||
    text.includes('notebook') ||
    text.includes('binder') ||
    text.includes('novel')
  ) {
    return ITEM_IMAGE_CATALOG.book;
  }

  // Category based fallback
  const cat = (category || '').toLowerCase();
  if (cat.includes('elect')) return ITEM_IMAGE_CATALOG.phone;
  if (cat.includes('bag')) return ITEM_IMAGE_CATALOG.backpack;
  if (cat.includes('cloth')) return ITEM_IMAGE_CATALOG.clothing;
  if (cat.includes('access')) return ITEM_IMAGE_CATALOG.wallet;
  if (cat.includes('id') || cat.includes('card')) return ITEM_IMAGE_CATALOG.idCard;
  if (cat.includes('key')) return ITEM_IMAGE_CATALOG.keys;
  if (cat.includes('book')) return ITEM_IMAGE_CATALOG.book;

  return ITEM_IMAGE_CATALOG.general;
};

/**
 * Resolves the primary image for an item object.
 * If the item has a genuine user photo (base64, blob, or non-placeholder upload), it will keep it.
 * If the image is empty, missing, or was set to a generic placeholder (like a bag for phone/calculator),
 * it returns the photo matching the item name.
 */
export const getItemImage = (item) => {
  if (!item) return ITEM_IMAGE_CATALOG.general;

  const title = item.itemName || item.internalItemName || item.title || item.name || '';
  const category = item.category || '';
  const rawImage =
    (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) ||
    item.image ||
    '';

  // Check if rawImage is a user-uploaded data URI or blob
  if (rawImage.startsWith('data:') || rawImage.startsWith('blob:')) {
    return rawImage;
  }

  // Check if the rawImage is missing or matches one of the generic placeholders
  const isGenericPlaceholder =
    !rawImage ||
    GENERIC_PLACEHOLDER_SUBSTRINGS.some((sub) => rawImage.includes(sub));

  if (isGenericPlaceholder) {
    return getDefaultItemImage(title, category);
  }

  // Even if an unsplash image exists, check for severe mismatch (e.g. calculator having a laptop image, or phone having a bag image)
  const lowerTitle = title.toLowerCase();
  if (
    (lowerTitle.includes('phone') || lowerTitle.includes('iphone') || lowerTitle.includes('android')) &&
    rawImage.includes('photo-1553062407-98eeb64c6a62') // backpack
  ) {
    return ITEM_IMAGE_CATALOG.phone;
  }

  if (
    (lowerTitle.includes('calc') || lowerTitle.includes('ti-84')) &&
    (rawImage.includes('photo-1611125832047-1d7ad1e8e49d') || rawImage.includes('photo-1594980596870-8aa52a78d8cd')) // laptop
  ) {
    return ITEM_IMAGE_CATALOG.calculator;
  }

  return rawImage;
};
