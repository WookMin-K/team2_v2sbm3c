package dev.mvc.district;
import java.util.ArrayList;

  public interface DistrictProcInter {
  
    /** 구군 등록 */
    public int create(DistrictVO districtVO);
    
    /** 특정 시도(region_no)의 구군 목록 */
    public ArrayList<DistrictVO> list(int region_no);
    
    /** 구군 단일 조회 */
    public DistrictVO read_district(int district_no);
   
    /** 구군 정보 수정 */
    public int update(DistrictVO districtVO);
    
    /** 구군 삭제 */
    public int delete(int district_no);
    
    /** 특정 시도(region_no) 구군 인기순(조회수순) 리스트 */
    public ArrayList<DistrictVO> list_by_views(int region_no);
    
    public ArrayList<DistrictVO> list_all();

  }
