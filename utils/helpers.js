//truncate
const truncatePost = post => {
  if (post.length > 100) {
    return post.substring(0, 100) + "...";
  }
  return post;
};

module.exports = {
  truncatePost,
};
