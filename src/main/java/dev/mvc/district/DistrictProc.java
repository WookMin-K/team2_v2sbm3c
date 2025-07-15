package dev.mvc.district;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.district.DistrictProc")
public class DistrictProc implements DistrictProcInter {

  @Autowired
  private DistrictDAOInter districtDAO;

  @Override
  public int create(DistrictVO districtVO) {
    return this.districtDAO.create(districtVO);
  }


  @Override
  public DistrictVO read_district(int district_no) {
    return this.districtDAO.read_district(district_no);
  }


  @Override
  public int update(DistrictVO districtVO) {
    return this.districtDAO.update(districtVO);
  }

  @Override
  public int delete(int district_no) {
    return this.districtDAO.delete(district_no);
  }
  
  @Override
  public ArrayList<DistrictVO> list(int region_no) {
    return this.districtDAO.list(region_no);
  }
  
  @Override
  public ArrayList<DistrictVO> list_by_views(int region_no) {
    return this.districtDAO.list_by_views(region_no);
  }

  @Override
  public ArrayList<DistrictVO> list_all() {
    return districtDAO.list_all();
  }


  
}
