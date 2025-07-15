package dev.mvc.review;

import java.util.List;

public interface ReviewProcInter {

  /**
   * 리뷰 번호 시퀀스 조회
   * @return 새로운 리뷰 번호
   */
  public int getReviewNo();

  /**
   * 리뷰 등록
   * @param reviewVO
   * @return 등록된 레코드 수
   */
  public int create(ReviewVO reviewVO);

  /**
   * 장소별 리뷰 목록
   * @param spot_no
   * @return 리뷰 리스트
   */
  public List<ReviewVO> list_by_spot_no(int spot_no);

  /**
   * 리뷰 상세 조회
   * @param review_no
   * @return ReviewVO
   */
  public ReviewVO read(int review_no);

  /**
   * 리뷰 수정
   * @param reviewVO
   * @return 수정된 레코드 수
   */
  public int update(ReviewVO reviewVO);

  /**
   * 리뷰 삭제
   * @param review_no
   * @return 삭제된 레코드 수
   */
  public int delete(int review_no);

  /**
   * 특정 장소의 모든 리뷰 삭제
   * @param spot_no
   * @return 삭제된 레코드 수
   */
  public int delete_by_spot_no(int spot_no);
}
