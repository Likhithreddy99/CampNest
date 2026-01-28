const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Camp = require('../models/Camp');
const Review = require('../models/Review');
const Story = require('../models/Story');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campnest';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected:', MONGODB_URI);

  await Promise.all([Review.deleteMany({}), Camp.deleteMany({}), Story.deleteMany({}), User.deleteMany({})]);

  const passwordHash = await bcrypt.hash('password123', 10);

  const [alice, dev, arjun] = await User.create([
    { username: 'Aisha', email: 'aisha@campnest.local', password: passwordHash },
    { username: 'Dev', email: 'dev@campnest.local', password: passwordHash },
    { username: 'Arjun', email: 'arjun@campnest.local', password: passwordHash },
  ]);

  const camps = await Camp.create([
    {
      title: 'Pineglass Ridge Camp',
      location: 'Coorg, Karnataka',
      description:
        'A quiet ridge line with pine cover and a wide sunrise view. Best visited post-monsoon. Water source is seasonal—carry enough. Network is weak; perfect for a true reset.',
      imageUrl: '',
      tags: ['sunrise', 'pine', 'ridge', 'quiet'],
      nearbyStays: [
        { name: 'Coorg Crest Resort', type: 'Resort', distanceKm: 6.2, priceRange: '₹3,500–₹6,000' },
        { name: 'Riverbend Homestay', type: 'Homestay', distanceKm: 4.4, priceRange: '₹1,800–₹3,200' },
      ],
      author: dev._id,
    },
    {
      title: 'Moonlake Campsite',
      location: 'Wayanad, Kerala',
      description:
        'Lakeside patch with misty mornings and a short trek to a viewpoint. Great for couples and small groups. Keep the area clean—locals are strict about litter.',
      imageUrl: '',
      tags: ['lake', 'mist', 'easy trek', 'calm'],
      nearbyStays: [
        { name: 'Wayanad Lakeview Hotel', type: 'Hotel', distanceKm: 3.1, priceRange: '₹2,200–₹4,200' },
        { name: 'Fern & Fire Cottages', type: 'Resort', distanceKm: 8.8, priceRange: '₹4,000–₹7,500' },
      ],
      author: alice._id,
    },
    {
      title: 'Redstone Valley Basecamp',
      location: 'Hampi, Karnataka',
      description:
        'Rocky valley basecamp with starry skies and warm evenings. Day hikes are unreal. Carry a mat—ground is hard. Sunset climbs are the highlight.',
      imageUrl: '',
      tags: ['stars', 'boulders', 'sunset', 'adventure'],
      nearbyStays: [
        { name: 'Hampi Heritage Inn', type: 'Hotel', distanceKm: 2.7, priceRange: '₹1,500–₹2,800' },
        { name: 'Stone & Spice Guesthouse', type: 'Homestay', distanceKm: 1.9, priceRange: '₹1,200–₹2,200' },
      ],
      author: arjun._id,
    },
  ]);

  await Story.create([
    {
      title: 'The Night the Forest Went Quiet',
      content:
        'We reached the ridge just before dusk. The last light painted the trees gold, and then—silence.\n\nNo traffic, no distant music. Just the crackle of a small fire and the soft tap of wind in the canopy. At midnight the sky opened up, and the stars looked close enough to touch.\n\nIn the morning, mist rolled like slow waves through the valley. We packed up early, leaving the place exactly as we found it.',
      coverImageUrl: '',
      tags: ['forest', 'night', 'stars'],
      author: alice._id,
    },
    {
      title: 'Coffee, Rain, and a Tent That Wouldn’t Quit',
      content:
        'It rained for hours in Coorg. The kind of rain that tests your seams and your patience.\n\nBut the tent held. We brewed coffee under the fly and watched the clouds move between the trees. There’s something comforting about being warm and dry while the world is soaked.\n\nIf you’re going in monsoon, pack extra guy lines, a groundsheet, and a sense of humor.',
      coverImageUrl: '',
      tags: ['rain', 'coffee', 'monsoon'],
      author: dev._id,
    },
  ]);

  const reviewsToCreate = [
    { camp: camps[0]._id, author: alice._id, rating: 5, comment: 'Sunrise view is unreal. Super peaceful and clean.' },
    { camp: camps[0]._id, author: arjun._id, rating: 4, comment: 'Great spot but water is seasonal—carry enough.' },
    { camp: camps[1]._id, author: dev._id, rating: 4, comment: 'Misty mornings were magical. Easy trek nearby.' },
    { camp: camps[1]._id, author: arjun._id, rating: 5, comment: 'Loved the lake vibes. Please keep it litter-free.' },
    { camp: camps[2]._id, author: alice._id, rating: 5, comment: 'Perfect for stargazing. Ground is rocky—bring a thick mat.' },
    { camp: camps[2]._id, author: dev._id, rating: 4, comment: 'Sunset climbs are the highlight. Start early to avoid heat.' },
  ];

  await Review.create(reviewsToCreate);

  // Update average ratings
  for (const camp of camps) {
    const agg = await Review.aggregate([
      { $match: { camp: camp._id } },
      { $group: { _id: '$camp', avg: { $avg: '$rating' } } },
    ]);
    camp.averageRating = agg[0]?.avg || 0;
    await camp.save();
  }

  console.log('Seed complete.');
  console.log('Login users (password: password123):');
  console.log('- aisha@campnest.local');
  console.log('- dev@campnest.local');
  console.log('- arjun@campnest.local');

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});

