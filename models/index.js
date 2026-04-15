const User = require('./User');
const Camp = require('./Camp');
const Story = require('./Story');
const Review = require('./Review');

User.hasMany(Camp, { foreignKey: 'authorId', as: 'camps' });
Camp.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Story, { foreignKey: 'authorId', as: 'stories' });
Story.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Review, { foreignKey: 'authorId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Camp.hasMany(Review, { foreignKey: 'campId', as: 'reviews' });
Review.belongsTo(Camp, { foreignKey: 'campId', as: 'camp' });

module.exports = {
  User,
  Camp,
  Story,
  Review
};
