package dev.mvc.trip;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service("dev.mvc.trip.TripProc")
public class TripProc implements TripProcInter {

  @Autowired
  private TripDAOInter tripDAO;

  /** 여행지 등록 */
  @Override
  public int create(TripVO tripVO) {
    return tripDAO.create(tripVO);
  }

  /** 여행지 단일조회 */
  @Override
  public TripVO read(Integer trip_no) {
    return tripDAO.read(trip_no);
  }

  /** 여행지 정보 수정 */
  @Override
  public int update(TripVO tripVO) {
    return tripDAO.update(tripVO);
  }

  /** 여행지 삭제 */
  @Override
  public int delete(Integer trip_no) {
    return tripDAO.delete(trip_no);
  }

  /** 여행지 조회수 증가 */
  @Override
  public int update_views(int trip_no) {
      return this.tripDAO.update_views(trip_no);
  }

  /** 구군별 인기순 여행지 리스트 */
  @Override
  public ArrayList<TripVO> list_by_views(int district_no) {
      return this.tripDAO.list_by_views(district_no);
  }

  /** 구군별 대표 여행지 */
  @Override
  public TripVO read_by_district(int district_no) {
      return tripDAO.read_by_district(district_no);
  }

  /** 여행지 상세조회(조회수 증가 포함) */
  public TripVO read_with_views(int trip_no) {
    tripDAO.update_views(trip_no);
    return tripDAO.read(trip_no);
  }
  
  @Override
  public ArrayList<TripVO> read_list_by_district(int district_no) {
      return tripDAO.read_list_by_district(district_no);
  }

}
