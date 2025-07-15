package dev.mvc.plan_day;

public interface Plan_dayProcInter {

  /**
   * 여행 일차 생성
   * @param plan_dayVO
   * @return 등록된 레코드 수
   */
  public int create(Plan_dayVO plan_dayVO);

  /**
   * 특정 일차 조회
   * @param plan_day_no
   * @return Plan_dayVO
   */
  public Plan_dayVO read(int plan_day_no);

  /**
   * 여행 일차 수정
   * @param plan_dayVO
   * @return 수정된 레코드 수
   */
  public int update(Plan_dayVO plan_dayVO);

  /**
   * 여행 일차 삭제
   * @param plan_day_no
   * @return 삭제된 레코드 수
   */
  public int delete(int plan_day_no);
}
