package dev.mvc.spot;

import java.util.ArrayList;

public interface SpotDAOInter {
  /**
   * 장소 등록
   * @param spotVO
   * @return
   */
  public int create(SpotVO spotVO);
  
  /**
   * 전체 장소 목록
   * @return
   */
  public ArrayList<SpotVO> list_all_spots();
  
  /**
   * 특정 장소 조회
   * @param spot_no
   * @return
   */
  public SpotVO read_spot(int spot_no);
  
  /**
   * 자치구 기준 장소 목록
   * @param district_no
   * @return
   */
  public SpotVO read_District_no(int district_no);
  
  /**
   * 장소 수정
   * @param spot_no
   * @return
   */
  public int update(int spot_no);
  
  /**
   * 장소 삭제
   * @param spot_no
   * @return
   */
  public int delete(int spot_no);
}