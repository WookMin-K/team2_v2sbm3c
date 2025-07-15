package dev.mvc.region;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.region.RegionProc")
public class RegionProc implements RegionProcInter {
  @Autowired
  private RegionDAOInter regionDAO;

  /** 시도(지역) 등록 */
  @Override
  public int create(RegionVO regionVO) {
    return this.regionDAO.create(regionVO);
  }

  /** 전체 시도(지역) 목록 조회 */
  @Override
  public ArrayList<RegionVO> list() {
    return this.regionDAO.list();
  }

  /** 특정 시도(지역) 단일 조회 */
  @Override
  public RegionVO read(int region_no) {
    return this.regionDAO.read(region_no);
  }

  /** 시도(지역) 정보 수정 */
  @Override
  public int update(RegionVO regionVO) {
    return this.regionDAO.update(regionVO);
  }

  /** 시도(지역) 삭제 */
  @Override
  public int delete(int region_no) {
    return this.regionDAO.delete(region_no);
  }
}
