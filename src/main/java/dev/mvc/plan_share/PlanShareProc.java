package dev.mvc.plan_share;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.plan_share.PlanShareProc")
public class PlanShareProc implements PlanShareProcInter {

  @Autowired
  private PlanShareDAOInter planShareDAO;

  @Override
  public int create(PlanShareVO planShareVO) {
    return planShareDAO.create(planShareVO);
  }

  @Override
  public List<PlanShareVO> list() {
    return planShareDAO.list();
  }

  @Override
  public PlanShareVO read(Long share_no) {
    return planShareDAO.read(share_no);
  }

  @Override
  public int update(PlanShareVO planShareVO) {
    return planShareDAO.update(planShareVO);
  }

  @Override
  public int delete(Long share_no) {
    return planShareDAO.delete(share_no);
  }
}
