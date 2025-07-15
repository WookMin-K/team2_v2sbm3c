package dev.mvc.spot;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

@Service("dev.mvc.spot.SpotProc")
public class SpotProc implements SpotProcInter {

  @Override
  public int create(SpotVO spotVO) {
    int cnt = this.create(spotVO);
    return cnt;
  }

  @Override
  public ArrayList<SpotVO> list_all_spots() {
    ArrayList<SpotVO> list = this.list_all_spots();
    return list;
  }

  @Override
  public SpotVO read_spot(int spot_no) {
    SpotVO spotVO = this.read_spot(spot_no);
    return spotVO;
  }

  @Override
  public SpotVO read_District_no(int district_no) {
    SpotVO spotVO = this.read_District_no(district_no);
    return spotVO;
  }

  @Override
  public int update(int spot_no) {
    int cnt = this.update(spot_no);
    return cnt;
  }

  @Override
  public int delete(int spot_no) {
    int cnt = this.delete(spot_no);
    return cnt;
  }
  
}