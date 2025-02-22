const buildNestedComments = (flatComments) => {
    const commentMap = {};
    flatComments.forEach((c) => {
      commentMap[c.comId] = { ...c, replies: [] };
    });
  
    const rootComments = [];
    flatComments.forEach((c) => {
      if (c.parentId) {
        commentMap[c.parentId].replies.push(commentMap[c.comId]);
      } else {
        rootComments.push(commentMap[c.comId]);
      }
    });
  
    return rootComments;
}

module.exports = {
    buildNestedComments
};