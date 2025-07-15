package dev.mvc.plan_share;

import java.util.List;

public interface PlanShareDAOInter {

  /**
   * 공유된 여행 등록
   * @param planShareVO
   * @return 등록된 레코드 수
   */
  public int create(PlanShareVO planShareVO);

  /**
   * 공유된 여행 전체 목록
   * @return PlanShareVO 리스트
   */
  public List<PlanShareVO> list();

  /**
   * 공유된 여행 단건 조회
   * @param share_no
   * @return PlanShareVO
   */
  public PlanShareVO read(Long share_no);

  /**
   * 공유된 여행 수정
   * @param planShareVO
   * @return 수정된 레코드 수
   */
  public int update(PlanShareVO planShareVO);

  /**
   * 공유된 여행 삭제
   * @param share_no
   * @return 삭제된 레코드 수
   */
  public int delete(Long share_no);
}
