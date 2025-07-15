package dev.mvc.district;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/district")
public class DistrictCont {

  @Autowired
  @Qualifier("dev.mvc.district.DistrictProc")
  private DistrictProcInter districtProc;

  /** 구군 등록 */
  @PostMapping("/create")
  public int create(@RequestBody DistrictVO districtVO) {
    return districtProc.create(districtVO);
  }

  /** 특정 구군 조회 */
  @GetMapping("/read")
  public DistrictVO read(@RequestParam("district_no") int district_no) {
    return districtProc.read_district(district_no);
  }

  /** 특정 시도(region_no) 하위 구군 목록 조회 (정렬 옵션 지원) */
  @GetMapping("/list")
  public ArrayList<DistrictVO> list(
    @RequestParam("region_no") int region_no,
    @RequestParam(value = "sort", defaultValue = "default") String sort
  ) {
    if ("views".equals(sort)) {
      return districtProc.list_by_views(region_no);
    } else {
      return districtProc.list(region_no);
    }
  }

  /** 구군 정보 수정 */
  @PutMapping("/update")
  public int update(@RequestBody DistrictVO districtVO) {
    return districtProc.update(districtVO);
  }

  /** 구군 삭제 */
  @DeleteMapping("/delete")
  public int delete(@RequestParam("district_no") int district_no) {
    return districtProc.delete(district_no);
  }
  
  @GetMapping("/all")
  public ArrayList<DistrictVO> list_all() {
    return districtProc.list_all(); // ← 이건 region_no 없이 전체 조회
  }
}



