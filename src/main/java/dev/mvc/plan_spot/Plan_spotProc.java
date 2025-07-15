package dev.mvc.plan_spot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.plan_spot.Plan_spotProc")
public class Plan_spotProc implements Plan_spotProcInter {

  @Autowired
  private Plan_spotDAOInter plan_spotDAO;

  @Override
  public int create(Plan_spotVO plan_spotVO) {
    return plan_spotDAO.create(plan_spotVO);
  }

  @Override
  public Plan_spotVO read(int plan_spot_no) {
    return plan_spotDAO.read(plan_spot_no);
  }

  @Override
  public int update(Plan_spotVO plan_spotVO) {
    return plan_spotDAO.update(plan_spotVO);
  }

  @Override
  public int delete(int plan_spot_no) {
    return plan_spotDAO.delete(plan_spot_no);
  }
}
