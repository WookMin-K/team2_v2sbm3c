package dev.mvc.trip;

import java.util.ArrayList;
import java.util.List;

public interface TripProcInter {

  /**
   * 여행지 등록
   * @param tripVO
   * @return 등록된 레코드 수
   */
  public int create(TripVO tripVO);

  /**
   * 여행지 단건 조회
   * @param trip_no
   * @return TripVO
   */
  public TripVO read(Integer trip_no);

  /**
   * 여행지 수정
   * @param tripVO
   * @return 수정된 레코드 수
   */
  public int update(TripVO tripVO);

  /**
   * 여행지 삭제
   * @param trip_no
   * @return 삭제된 레코드 수
   */
  public int delete(Integer trip_no);

  /**
   * 조회 수 증가
   * @param trip_no
   * @return 조회된 레코드 수
   */
  public int update_views(int trip_no);

  public ArrayList<TripVO> list_by_views(int district_no);

  public TripVO read_by_district(int district_no);

  public TripVO read_with_views(int trip_no);

  public ArrayList<TripVO> read_list_by_district(int district_no);


}
