package dev.mvc.review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.review.ReviewProc")
public class ReviewProc implements ReviewProcInter {

  @Autowired
  private ReviewDAOInter reviewDAO;

  @Override
  public int getReviewNo() {
    return reviewDAO.getReviewNo();
  }

  @Override
  public int create(ReviewVO reviewVO) {
    return reviewDAO.create(reviewVO);
  }

  @Override
  public List<ReviewVO> list_by_spot_no(int spot_no) {
    return reviewDAO.list_by_spot_no(spot_no);
  }

  @Override
  public ReviewVO read(int review_no) {
    return reviewDAO.read(review_no);
  }

  @Override
  public int update(ReviewVO reviewVO) {
    return reviewDAO.update(reviewVO);
  }

  @Override
  public int delete(int review_no) {
    return reviewDAO.delete(review_no);
  }

  @Override
  public int delete_by_spot_no(int spot_no) {
    return reviewDAO.delete_by_spot_no(spot_no);
  }
}
