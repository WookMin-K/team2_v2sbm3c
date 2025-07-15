package dev.mvc.region;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/region")
public class RegionCont {

  @Autowired
  @Qualifier("dev.mvc.region.RegionProc")
  private RegionProcInter regionProc;

  /** 시도(지역) 등록 */
  @PostMapping("/create")
  public int create(@RequestBody RegionVO regionVO) {
    return regionProc.create(regionVO);
  }

  /** 시도 전체 목록 조회 */
  @GetMapping("/list")
  public ArrayList<RegionVO> list() {
    return regionProc.list();
  }

  /** 특정 시도(지역) 단건 조회 */
  @GetMapping("/read")
  public RegionVO read(@RequestParam("region_no") int region_no) {
    return regionProc.read(region_no);
  }

  /** 시도 정보 수정 */
  @PutMapping("/update")
  public int update(@RequestBody RegionVO regionVO) {
    return regionProc.update(regionVO);
  }

  /** 시도(지역) 삭제 */
  @DeleteMapping("/delete")
  public int delete(@RequestParam("region_no") int region_no) {
    return regionProc.delete(region_no);
  }
}
