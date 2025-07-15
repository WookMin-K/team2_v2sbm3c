package dev.mvc.plan_spot;

public interface Plan_spotProcInter {

  /**
   * 여행 장소 등록
   * @param plan_spotVO
   * @return 등록된 레코드 수
   */
  public int create(Plan_spotVO plan_spotVO);

  /**
   * 여행 장소 단건 조회
   * @param plan_spot_no
   * @return Plan_spotVO
   */
  public Plan_spotVO read(int plan_spot_no);

  /**
   * 여행 장소 수정
   * @param plan_spotVO
   * @return 수정된 레코드 수
   */
  public int update(Plan_spotVO plan_spotVO);

  /**
   * 여행 장소 삭제
   * @param plan_spot_no
   * @return 삭제된 레코드 수
   */
  public int delete(int plan_spot_no);
}
