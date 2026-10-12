export const INITIAL_CLAIMS = [
  {
    id: 'claim_1',
    itemId: 'found_1',
    itemTitle: "Fossil Black Men's Leather Wallet",
    itemImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_1',
      name: 'Alex Johnson',
      email: 'alex.johnson@campusfind.edu',
      studentId: 'STU-2024-8841',
      phone: '+1 (555) 234-5678'
    },
    reason: 'I lost my Fossil wallet at the canteen around lunch time on Aug 12th.',
    uniqueFeature: 'Inside the secret flap behind credit card slot #2 there is a photo of my family and an emergency contact card with name Alex Johnson.',
    proofImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-12',
    status: 'Under Review',
    adminRemark: 'Security office checking ID match with wallet card.'
  },
  {
    id: 'claim_2',
    itemId: 'found_2',
    itemTitle: 'Sony Wireless Headphones & Case',
    itemImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_2',
      name: 'Prof. Sarah Jenkins',
      email: 's.jenkins@campusfind.edu',
      studentId: 'FAC-9921',
      phone: '+1 (555) 876-5432'
    },
    reason: 'Left my Sony WH-1000XM4 headphones at PC station 14 during CS exam proctoring.',
    uniqueFeature: 'Serial number on inside left headband ends with 4982 and bluetooth device name is "Sarah\'s XM4".',
    proofImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-13',
    status: 'Approved',
    adminRemark: 'Bluetooth device name matched owner identity. Item returned at security desk.'
  },
  {
    id: 'claim_3',
    itemId: 'found_5',
    itemTitle: 'Key Ring with Toyota Car Fob & Keychain',
    itemImage: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_5',
      name: 'David Miller',
      email: 'd.miller@campusfind.edu',
      studentId: 'STU-2023-1102',
      phone: '+1 (555) 333-4455'
    },
    reason: 'Dropped my keys while playing pickup basketball at the Gym.',
    uniqueFeature: 'Key fob unlocks grey Toyota Corolla parked in Lot B. Key ring has a small brass key for locker #42.',
    proofImage: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-11',
    status: 'Approved',
    adminRemark: 'Claim verified by Gym staff. Owner provided car registration match.'
  },
  {
    id: 'claim_4',
    itemId: 'found_4',
    itemTitle: 'Campus Student ID Card (Michael Chang)',
    itemImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_4',
      name: 'Michael Chang',
      email: 'm.chang@campusfind.edu',
      studentId: 'STU-2024-5120',
      phone: '+1 (555) 314-1592'
    },
    reason: 'Fell out of my bag near the bike racks in the student parking lot this morning.',
    uniqueFeature: 'Student ID has my photo, student number STU-2024-5120, and barcode ending in 8831.',
    proofImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-15',
    status: 'Approved',
    adminRemark: 'Student ID matches claimant database record. Returned at Main Gate.'
  },
  {
    id: 'claim_5',
    itemId: 'found_6',
    itemTitle: 'Apple Watch Series 8 Midnight Sport Band',
    itemImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_7',
      name: 'Jessica Taylor',
      email: 'j.taylor@campusfind.edu',
      studentId: 'STU-2023-4512',
      phone: '+1 (555) 667-8899'
    },
    reason: 'Took it off before starting the chemistry titration lab on Wednesday afternoon.',
    uniqueFeature: 'Screen has hairline scratch near 10 o\'clock position. Watch face displays monogram "JT" and battery complication.',
    proofImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-14',
    status: 'Pending',
    adminRemark: ''
  },
  {
    id: 'claim_6',
    itemId: 'found_7',
    itemTitle: 'Scientific Calculator TI-84 Plus CE',
    itemImage: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_6',
      name: 'Emily Davis',
      email: 'e.davis@campusfind.edu',
      studentId: 'STU-2024-7731',
      phone: '+1 (555) 444-9876'
    },
    reason: 'Forgot it in Room 204 after macroeconomics lecture.',
    uniqueFeature: 'Under the slide lid, my initials "ED" are written in silver sharpie marker.',
    proofImage: '',
    claimDate: '2026-08-15',
    status: 'Under Review',
    adminRemark: 'Admin verifying initials inside the slide cover.'
  },
  {
    id: 'claim_7',
    itemId: 'found_11',
    itemTitle: 'Apple AirPods Pro in Green Silicone Case',
    itemImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_1',
      name: 'Alex Johnson',
      email: 'alex.johnson@campusfind.edu',
      studentId: 'STU-2024-8841',
      phone: '+1 (555) 234-5678'
    },
    reason: 'Studying in 2nd floor library near periodicals. Forgot case on desk.',
    uniqueFeature: 'Olive green silicone case with a circular carabiner. Find My shows last location at Central Library.',
    proofImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-16',
    status: 'Pending',
    adminRemark: ''
  },
  {
    id: 'claim_8',
    itemId: 'found_14',
    itemTitle: 'Apple MacBook Air Space Gray in Sleeve',
    itemImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_1',
      name: 'Alex Johnson',
      email: 'alex.johnson@campusfind.edu',
      studentId: 'STU-2024-8841',
      phone: '+1 (555) 234-5678'
    },
    reason: 'Left on desk in 2nd floor silent study room.',
    uniqueFeature: 'Has ReactJS logo sticker and Github Octocat sticker. Login username is "alexj" and serial matches C02G9981MD6R.',
    proofImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-14',
    status: 'Under Review',
    adminRemark: 'Device in custody at Central Library Circulation Desk. Awaiting student verification.'
  },
  {
    id: 'claim_9',
    itemId: 'found_8',
    itemTitle: 'Champion Grey Zip-Up College Hoodie',
    itemImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_8',
      name: 'Kevin Durant',
      email: 'k.durant@campusfind.edu',
      studentId: 'STU-2022-9901',
      phone: '+1 (555) 777-2233'
    },
    reason: 'Left at auditorium during orientation week.',
    uniqueFeature: 'Size Medium, navy blue color with white stripes.',
    proofImage: '',
    claimDate: '2026-08-10',
    status: 'Rejected',
    adminRemark: 'Item found is Size Large and Heather Grey color, does not match description provided.'
  },
  {
    id: 'claim_10',
    itemId: 'found_3',
    itemTitle: 'Hydroflask Insulated Water Bottle (32oz)',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_5',
      name: 'David Miller',
      email: 'd.miller@campusfind.edu',
      studentId: 'STU-2023-1102',
      phone: '+1 (555) 333-4455'
    },
    reason: 'Forgot bottle at gym bleachers after basketball practice.',
    uniqueFeature: 'Pacific Blue with white vinyl mountain peak sticker on side and small dent on bottom rim.',
    proofImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
    claimDate: '2026-08-15',
    status: 'Approved',
    adminRemark: 'Distinctive sticker and dent confirmed. Ready for pickup at gym front desk.'
  },
  {
    id: 'claim_11',
    itemId: 'found_12',
    itemTitle: 'Samsung Galaxy Smartphone in Black Case',
    itemImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800',
    claimant: {
      id: 'usr_4',
      name: 'Michael Chang',
      email: 'm.chang@campusfind.edu',
      studentId: 'STU-2024-5120',
      phone: '+1 (555) 314-1592'
    },
    reason: 'Left on cafeteria table while returning food tray.',
    uniqueFeature: 'Lockscreen shows picture of golden retriever puppy. Case is black OtterBox with kickstand.',
    proofImage: '',
    claimDate: '2026-08-16',
    status: 'Pending',
    adminRemark: ''
  }
];
