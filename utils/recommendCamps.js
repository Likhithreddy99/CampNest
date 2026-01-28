function recommendCamps(userProfile, camps) {
  return camps.map(camp => {
    let score = 0;

    // 1. Location match (40%)
    if (camp.location === userProfile.location) {
      score += 0.4;
    }

    // 2. Rating influence (30%)
    score += (camp.averageRating / 5) * 0.3;

    // 3. Tag similarity (30%)
    const commonTags = camp.tags.filter(tag =>
      userProfile.interests.includes(tag)
    );

    if (commonTags.length > 0) {
      score += 0.3 * (commonTags.length / userProfile.interests.length);
    }

    return { camp, score };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3); // Top 3 recommendations
}

module.exports = recommendCamps;
