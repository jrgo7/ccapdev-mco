const reviewsPerPage = 4;
const sortReviewByVoteCount = (review1, review2) => review2.upvotes - review1.upvotes;

module.exports = {reviewsPerPage, sortReviewByVoteCount};