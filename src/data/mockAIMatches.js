export const INITIAL_AI_MATCHES = [
  {
    id: 'match-001',
    lostItemId: 'lost_2',
    lostItemTitle: 'Black Leather Bifold Wallet',
    lostItemImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_1',
    foundItemTitle: "Fossil Black Men's Leather Wallet",
    foundItemImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories',
    location: 'Main Campus Canteen',
    dateFound: '2026-08-12',
    color: 'Black',
    brand: 'Fossil',
    score: 94,
    status: 'High Match',
    factors: {
      visualSimilarity: 96,
      colorSimilarity: 93,
      categoryMatch: 100,
      locationSimilarity: 95,
      dateSimilarity: 88
    },
    reasons: [
      'Same category (Accessories / Wallet)',
      'Identical black pebbled leather texture & bifold form factor',
      'Both reported at Main Campus Canteen within 15 minutes of each other',
      'Fossil branding matches reported item description'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-002',
    lostItemId: 'lost_1',
    lostItemTitle: 'Apple MacBook Air M2 (Space Gray)',
    lostItemImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_14',
    foundItemTitle: 'Apple MacBook Air Space Gray in Sleeve',
    foundItemImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Central Library',
    dateFound: '2026-08-14',
    color: 'Space Gray',
    brand: 'Apple',
    score: 96,
    status: 'High Match',
    factors: {
      visualSimilarity: 98,
      colorSimilarity: 95,
      categoryMatch: 100,
      locationSimilarity: 96,
      dateSimilarity: 92
    },
    reasons: [
      'Exact category match (Electronics / Laptop)',
      'Matching Apple MacBook Air aluminum Space Gray chassis',
      'Both found and reported on 2nd floor of Central Library',
      'Brown protective sleeve matches reported details'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-003',
    lostItemId: 'lost_11',
    lostItemTitle: 'Apple AirPods Pro (2nd Gen) with MagSafe Case',
    lostItemImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_11',
    foundItemTitle: 'Apple AirPods Pro in Green Silicone Case',
    foundItemImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Central Library',
    dateFound: '2026-08-16',
    color: 'White / Green Case',
    brand: 'Apple',
    score: 94,
    status: 'High Match',
    factors: {
      visualSimilarity: 95,
      colorSimilarity: 94,
      categoryMatch: 100,
      locationSimilarity: 90,
      dateSimilarity: 92
    },
    reasons: [
      'Same category (Audio / Earbuds)',
      'Green silicone sleeve with carabiner ring detected in both images',
      'Location matches Central Library study area',
      'Date reported and date found within 75 minutes'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-004',
    lostItemId: 'lost_3',
    lostItemTitle: 'Sony WH-1000XM4 Noise Canceling Headphones',
    lostItemImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_2',
    foundItemTitle: 'Sony Wireless Headphones & Case',
    foundItemImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Computer Lab 3 (CS Dept)',
    dateFound: '2026-08-13',
    color: 'Matte Black',
    brand: 'Sony',
    score: 91,
    status: 'High Match',
    factors: {
      visualSimilarity: 92,
      colorSimilarity: 94,
      categoryMatch: 100,
      locationSimilarity: 90,
      dateSimilarity: 82
    },
    reasons: [
      'Same category (Electronics / Headphones)',
      'Matching matte black Sony over-ear silhouette and zip case',
      'Found near PC station in Computer Lab 3',
      'Reported on same afternoon'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-005',
    lostItemId: 'lost_6',
    lostItemTitle: 'Toyota Car Key Fob & Keychain',
    lostItemImage: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_5',
    foundItemTitle: 'Key Ring with Toyota Car Fob & Keychain',
    foundItemImage: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=800',
    category: 'Keys & Fobs',
    location: 'Sports Complex & Gymnasium',
    dateFound: '2026-08-11',
    color: 'Black & Silver',
    brand: 'Toyota',
    score: 95,
    status: 'High Match',
    factors: {
      visualSimilarity: 96,
      colorSimilarity: 94,
      categoryMatch: 100,
      locationSimilarity: 96,
      dateSimilarity: 88
    },
    reasons: [
      'Same category (Keys & Fobs)',
      'Matching Toyota keyless entry remote with basketball accessory',
      'Found on Sports Complex court bleachers',
      'Claimed and verified'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-006',
    lostItemId: 'lost_12',
    lostItemTitle: 'Stainless Steel Insulated Water Bottle',
    lostItemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_3',
    foundItemTitle: 'Hydroflask Insulated Water Bottle (32oz)',
    foundItemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories',
    location: 'Sports Complex & Gymnasium',
    dateFound: '2026-08-15',
    color: 'Pacific Blue',
    brand: 'Hydro Flask',
    score: 96,
    status: 'High Match',
    factors: {
      visualSimilarity: 97,
      colorSimilarity: 98,
      categoryMatch: 100,
      locationSimilarity: 92,
      dateSimilarity: 94
    },
    reasons: [
      'Same category (Bottles / Accessories)',
      'Specific Pacific Blue hue matched with high color accuracy',
      'White mountain sticker visual detected on cylinder body',
      'Same gymnasium facility proximity'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-007',
    lostItemId: 'lost_14',
    lostItemTitle: 'TI-84 Plus CE Graphing Calculator',
    lostItemImage: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_7',
    foundItemTitle: 'Scientific Calculator TI-84 Plus CE',
    foundItemImage: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Classroom Block C (Room 204)',
    dateFound: '2026-08-14',
    color: 'Black/Silver',
    brand: 'Texas Instruments',
    score: 91,
    status: 'High Match',
    factors: {
      visualSimilarity: 93,
      colorSimilarity: 90,
      categoryMatch: 100,
      locationSimilarity: 94,
      dateSimilarity: 88
    },
    reasons: [
      'Same category (Electronics / Calculator)',
      'Identical Texas Instruments TI-84 model and button matrix layout',
      'Both located inside Classroom Block C Room 204',
      'Handed in on same day'
    ],
    confidenceLevel: 'Very Strong'
  },
  {
    id: 'match-008',
    lostItemId: 'lost_13',
    lostItemTitle: 'Samsung Galaxy S23 Ultra (Phantom Black)',
    lostItemImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_12',
    foundItemTitle: 'Samsung Galaxy Smartphone in Black Case',
    foundItemImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Student Center Cafeteria',
    dateFound: '2026-08-16',
    color: 'Black',
    brand: 'Samsung',
    score: 88,
    status: 'Strong Match',
    factors: {
      visualSimilarity: 89,
      colorSimilarity: 92,
      categoryMatch: 100,
      locationSimilarity: 85,
      dateSimilarity: 84
    },
    reasons: [
      'Same category (Mobile Phones)',
      'Black rugged case geometry matches lost report photo',
      'Both associated with Student Center dining hall',
      'Found 45 minutes after loss report time'
    ],
    confidenceLevel: 'Strong'
  },
  {
    id: 'match-009',
    lostItemId: 'lost_8',
    lostItemTitle: 'Apple Watch Series 8 (GPS 45mm)',
    lostItemImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_6',
    foundItemTitle: 'Apple Watch Series 8 Midnight Sport Band',
    foundItemImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Chemistry Laboratory',
    dateFound: '2026-08-13',
    color: 'Midnight Black',
    brand: 'Apple',
    score: 89,
    status: 'Strong Match',
    factors: {
      visualSimilarity: 90,
      colorSimilarity: 94,
      categoryMatch: 100,
      locationSimilarity: 86,
      dateSimilarity: 82
    },
    reasons: [
      'Same category (Smartwatches)',
      'Midnight silicone band and curved glass form factor match',
      'Location matches Chemistry building bench area',
      'Found during afternoon lab period'
    ],
    confidenceLevel: 'Strong'
  },
  {
    id: 'match-010',
    lostItemId: 'lost_7',
    lostItemTitle: 'North Face Recon Backpack (Navy)',
    lostItemImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_13',
    foundItemTitle: 'North Face Dark Blue Daypack',
    foundItemImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    category: 'Bags & Backpacks',
    location: 'Main Gate Entrance',
    dateFound: '2026-08-14',
    color: 'Navy Blue',
    brand: 'The North Face',
    score: 84,
    status: 'Strong Match',
    factors: {
      visualSimilarity: 86,
      colorSimilarity: 88,
      categoryMatch: 100,
      locationSimilarity: 80,
      dateSimilarity: 82
    },
    reasons: [
      'Same category (Bags & Backpacks)',
      'The North Face embroidered logo and navy blue webbing detected',
      'Both located at campus Main Gate area',
      'Found approximately 30 minutes after reported departure'
    ],
    confidenceLevel: 'Strong'
  },
  {
    id: 'match-011',
    lostItemId: 'lost_16',
    lostItemTitle: 'Black Compact Windproof Umbrella',
    lostItemImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_15',
    foundItemTitle: 'Black Automatic Windproof Umbrella',
    foundItemImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    category: 'Other',
    location: 'Central Library',
    dateFound: '2026-08-16',
    color: 'Black',
    brand: 'Repel',
    score: 81,
    status: 'Strong Match',
    factors: {
      visualSimilarity: 84,
      colorSimilarity: 90,
      categoryMatch: 100,
      locationSimilarity: 78,
      dateSimilarity: 75
    },
    reasons: [
      'Same category (Personal Items / Umbrella)',
      'Black compact telescoping canopy design matches',
      'Both found and lost in Central Library foyer umbrella bins',
      'Morning weather matches rain precipitation records'
    ],
    confidenceLevel: 'Strong'
  },
  {
    id: 'match-012',
    lostItemId: 'lost_15',
    lostItemTitle: 'Anker Magnetic Wireless Power Bank 10000mAh',
    lostItemImage: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_10',
    foundItemTitle: 'Anker PowerCore 20000mAh Power Bank',
    foundItemImage: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    location: 'Hostel Block A Lounge',
    dateFound: '2026-08-08',
    color: 'Matte Grey / Black',
    brand: 'Anker',
    score: 76,
    status: 'Moderate Match',
    factors: {
      visualSimilarity: 78,
      colorSimilarity: 82,
      categoryMatch: 100,
      locationSimilarity: 68,
      dateSimilarity: 72
    },
    reasons: [
      'Same category (Electronics / Power Bank)',
      'Anker brand mark recognized by visual feature extraction',
      'Capacity differs (10k vs 20k) but external shape is comparable',
      'Found near common campus residential areas'
    ],
    confidenceLevel: 'Moderate'
  },
  {
    id: 'match-013',
    lostItemId: 'lost_9',
    lostItemTitle: 'Ray-Ban Wayfarer Sunglasses',
    lostItemImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_16',
    foundItemTitle: 'Stainless Steel Travel Mug (16oz)',
    foundItemImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories',
    location: 'Main Building - Atrium',
    dateFound: '2026-08-15',
    color: 'Silver/Grey',
    brand: 'Contigo',
    score: 61,
    status: 'Low Match',
    factors: {
      visualSimilarity: 58,
      colorSimilarity: 62,
      categoryMatch: 80,
      locationSimilarity: 64,
      dateSimilarity: 60
    },
    reasons: [
      'Broad category alignment (Personal Accessories)',
      'Significant shape and material differences detected',
      'Included as a baseline exploratory AI similarity suggestion'
    ],
    confidenceLevel: 'Possible'
  },
  {
    id: 'match-014',
    lostItemId: 'lost_10',
    lostItemTitle: 'Denim Jacket with Campus Patch',
    lostItemImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_8',
    foundItemTitle: 'Champion Grey Zip-Up College Hoodie',
    foundItemImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    category: 'Clothing',
    location: 'Auditorium Complex',
    dateFound: '2026-08-09',
    color: 'Grey vs Blue',
    brand: 'Campus Apparel',
    score: 68,
    status: 'Possible Match',
    factors: {
      visualSimilarity: 66,
      colorSimilarity: 60,
      categoryMatch: 100,
      locationSimilarity: 74,
      dateSimilarity: 72
    },
    reasons: [
      'Same category (Outerwear / Clothing)',
      'Both feature campus logo crest on chest region',
      'Different fabric materials (denim vs fleece cotton)',
      'Dates close to orientation week events'
    ],
    confidenceLevel: 'Possible'
  },
  {
    id: 'match-015',
    lostItemId: 'lost_5',
    lostItemTitle: 'Calculus Early Transcendentals Textbook',
    lostItemImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    foundItemId: 'found_9',
    foundItemTitle: 'Leather Portfolio & Engineering Drawings',
    foundItemImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    category: 'Books & Documents',
    location: 'Central Library',
    dateFound: '2026-08-14',
    color: 'Blue & Brown',
    brand: 'Academic Print',
    score: 72,
    status: 'Moderate Match',
    factors: {
      visualSimilarity: 74,
      colorSimilarity: 70,
      categoryMatch: 85,
      locationSimilarity: 75,
      dateSimilarity: 70
    },
    reasons: [
      'Similar category (Academic literature & binder)',
      'Bound rectangular physical structure',
      'Both located around library quiet study rooms'
    ],
    confidenceLevel: 'Moderate'
  }
];
