const { Camp, Review, User } = require('../models');
const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/database');
const recommendCamps = require('../utils/recommendCamps');

class CampService {
  async getAllCamps() {
    return await Camp.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'author', attributes: ['username', 'id'] }]
    });
  }

  async getTrendingCamps(limit = 6) {
    return await Camp.findAll({
      order: [
        ['averageRating', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit
    });
  }

  async getCampsByUser(userId) {
    return await Camp.findAll({ where: { authorId: userId } });
  }

  async searchCamps(q) {
    return await Camp.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { location: { [Op.iLike]: `%${q}%` } },
          { tags: { [Op.overlap]: [q] } }
        ]
      }
    });
  }

  async getRecommendations(userProfile) {
    const camps = await Camp.findAll();
    return recommendCamps(userProfile, camps);
  }

  async getCampById(id) {
    const camp = await Camp.findByPk(id, {
      include: [{ model: User, as: 'author', attributes: ['username', 'id'] }]
    });
    if (!camp) return null;

    const reviews = await Review.findAll({
      where: { campId: id },
      include: [{ model: User, as: 'author', attributes: ['username', 'id'] }],
      order: [['createdAt', 'DESC']]
    });

    return { camp, reviews };
  }

  async createCamp(campData) {
    const { title, location, description, imageUrl, tags, authorId } = campData;

    return await Camp.create({
      title,
      location,
      description,
      imageUrl,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      authorId,
    });
  }

  async updateCamp(id, updateData) {
    const camp = await Camp.findByPk(id);
    if (!camp) return null;

    const { title, location, description, tags, imageUrl } = updateData;

    const updatedData = {
      title,
      location,
      description,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };

    if (imageUrl) {
      updatedData.imageUrl = imageUrl;
    }

    return await camp.update(updatedData);
  }

  async addReview(campId, reviewData) {
    const t = await sequelize.transaction();
    try {
      const camp = await Camp.findByPk(campId, { transaction: t });
      if (!camp) throw new Error('Campsite not found.');

      const { rating, comment, authorId } = reviewData;

      await Review.create({
        rating,
        comment,
        campId: campId,
        authorId: authorId,
      }, { transaction: t });

      const stats = await Review.findOne({
        where: { campId },
        attributes: [
          [fn('AVG', col('rating')), 'avgRating']
        ],
        raw: true,
        transaction: t
      });

      await camp.update({
        averageRating: parseFloat(stats.avgRating) || 0
      }, { transaction: t });

      await t.commit();
      return camp;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new CampService();
