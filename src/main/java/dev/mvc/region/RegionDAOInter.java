package dev.mvc.region;

import java.util.ArrayList;

public interface RegionDAOInter {
  
  /**
   * 지역 추가
   * @param regionVO
   * @return
   */
  public int create(RegionVO regionVO);
  
  /**
   * 전체 지역 조회
   * @return
   */
  public ArrayList<RegionVO> list();
  
  /**
   * 특정 지역 조회
   * @param region_no
   * @return
   */
  public RegionVO read(int region_no);
  
  /**
   * 지역 수정
   * @param region_no
   * @return
   */
  public int update(RegionVO regionVO);

  
  /**
   * 지역 삭제
   * @param region_no
   * @return
   */
  public int delete(int region_no);
}