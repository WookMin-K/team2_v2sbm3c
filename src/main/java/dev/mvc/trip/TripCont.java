package dev.mvc.trip;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trip")
public class TripCont {

  @Autowired
  @Qualifier("dev.mvc.trip.TripProc")
  private TripProcInter tripProc;

  /** API 서버 상태 확인용 */
  @GetMapping({"", "/"})
  public String defaultEntry() {
      return "server running.";
  }

  /** 여행지 등록 */
  @PostMapping("/create")
  public int create(@RequestBody TripVO tripVO) {
    // 🔹 keywords도 함께 등록됨 (TripVO에 포함)
    return tripProc.create(tripVO);
  }

  /** 여행지 수정 */
  @PutMapping("/update")
  public int update(@RequestBody TripVO tripVO) {
    // 🔹 keywords도 함께 수정됨
    return tripProc.update(tripVO);
  }

  /** 여행지 삭제 */
  @DeleteMapping("/delete/{trip_no}")
  public int delete(@PathVariable("trip_no") Integer trip_no) {
    return tripProc.delete(trip_no);
  }

  /** 여행지 상세조회 (+조회수 증가) */
  @GetMapping("/read")
  public TripVO read(@RequestParam("trip_no") int trip_no) {
      return tripProc.read_with_views(trip_no);
  }

  /** 구군별 인기순 여행지 리스트 */
  @GetMapping("/list_by_views")
  public ArrayList<TripVO> list_by_views(@RequestParam("district_no") int district_no) {
    return tripProc.list_by_views(district_no);
  }

  /** 구군별 대표 여행지(조회수 증가) */
  @GetMapping("/read_by_district")
  public TripVO readByDistrict(@RequestParam("district_no") int district_no) {
      TripVO trip = tripProc.read_by_district(district_no);
      if (trip == null) return null;
      int trip_no = trip.getTrip_no();
      tripProc.update_views(trip_no);
      return tripProc.read(trip_no);
  }

  /** 구군별 여행지 전체 리스트 */
  @GetMapping("/read_list_by_district")
  public ArrayList<TripVO> readListByDistrict(@RequestParam("district_no") int district_no) {
      return tripProc.read_list_by_district(district_no);
  }

  /** 여행지 상세조회 (React 전용: /trip/read/{trip_no}) */
  @GetMapping("/read/{trip_no}")
  public TripVO readByPath(@PathVariable("trip_no") int trip_no) {
      return tripProc.read_with_views(trip_no); // 기존과 동일하게 조회수 증가 포함
  }

}
