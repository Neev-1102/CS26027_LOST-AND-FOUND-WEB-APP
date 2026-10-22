/**
 * Item Image Helper (Backend)
 * Automatically assigns accurate Unsplash photos matching item names and categories when none are provided.
 */

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

export const getDefaultItemImage = (itemName = '', category = '') => {
  const text = `${itemName} ${category}`.toLowerCase();

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

  if (text.includes('ipad') || text.includes('tablet') || text.includes('kindle')) {
    return ITEM_IMAGE_CATALOG.tablet;
  }

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

  if (
    text.includes('wallet') ||
    text.includes('purse') ||
    text.includes('billfold') ||
    text.includes('cardholder') ||
    text.includes('clutch')
  ) {
    return ITEM_IMAGE_CATALOG.wallet;
  }

  if (
    text.includes('key') ||
    text.includes('keychain') ||
    text.includes('fob') ||
    text.includes('latchkey')
  ) {
    return ITEM_IMAGE_CATALOG.keys;
  }

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

  if (
    text.includes('watch') ||
    text.includes('smartwatch') ||
    text.includes('timepiece') ||
    text.includes('fitbit')
  ) {
    return ITEM_IMAGE_CATALOG.watch;
  }

  if (
    text.includes('glass') ||
    text.includes('spectacle') ||
    text.includes('eyewear') ||
    text.includes('sunglass') ||
    text.includes('shades')
  ) {
    return ITEM_IMAGE_CATALOG.glasses;
  }

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

  if (text.includes('umbrella') || text.includes('parasol')) {
    return ITEM_IMAGE_CATALOG.umbrella;
  }

  if (
    text.includes('charger') ||
    text.includes('cable') ||
    text.includes('adapter') ||
    text.includes('power bank') ||
    text.includes('cord')
  ) {
    return ITEM_IMAGE_CATALOG.charger;
  }

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

  if (
    text.includes('book') ||
    text.includes('textbook') ||
    text.includes('notebook') ||
    text.includes('binder') ||
    text.includes('novel')
  ) {
    return ITEM_IMAGE_CATALOG.book;
  }

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
