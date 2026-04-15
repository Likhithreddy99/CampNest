function recommendCamps(userProfile, camps) {
  return camps.map(camp => {
    let score = 0;

    if (camp.location === userProfile.location) {
      score += 0.4;
    }

    score += (camp.averageRating / 5) * 0.3;

    const commonTags = camp.tags.filter(tag =>
      userProfile.interests.includes(tag)
    );

    if (commonTags.length > 0) {
      score += 0.3 * (commonTags.length / userProfile.interests.length);
    }

    return { camp, score };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);
}

module.exports = recommendCamps;
