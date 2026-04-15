const { Story, User } = require('../models');
const { Op } = require('sequelize');

class StoryService {
  async getAllStories() {
    return await Story.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'author', attributes: ['username', 'id'] }]
    });
  }

  async getLatestStories(limit = 6) {
    return await Story.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      include: [{ model: User, as: 'author', attributes: ['username', 'id'] }]
    });
  }

  async getStoriesByUser(userId) {
    return await Story.findAll({ where: { authorId: userId } });
  }

  async searchStories(q) {
    return await Story.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { content: { [Op.iLike]: `%${q}%` } },
          { tags: { [Op.overlap]: [q] } }
        ]
      }
    });
  }

  async getStoryById(id) {
    return await Story.findByPk(id, {
      include: [{ model: User, as: 'author', attributes: ['username', 'id'] }]
    });
  }

  async createStory(storyData) {
    const { title, content, coverImageUrl, tags, authorId } = storyData;

    return await Story.create({
      title,
      content,
      coverImageUrl,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      authorId,
    });
  }

  async updateStory(id, updateData) {
    const story = await Story.findByPk(id);
    if (!story) return null;

    const { title, content, tags, coverImageUrl } = updateData;
    
    const updatedData = {
      title,
      content,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };

    if (coverImageUrl) {
      updatedData.coverImageUrl = coverImageUrl;
    }

    return await story.update(updatedData);
  }
}

module.exports = new StoryService();
