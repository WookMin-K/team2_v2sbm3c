package dev.mvc.plan_day;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.plan_day.Plan_dayProc")
public class Plan_dayProc implements Plan_dayProcInter {

  @Autowired
  private Plan_dayDAOInter plan_dayDAO;

  @Override
  public int create(Plan_dayVO plan_dayVO) {
    return plan_dayDAO.create(plan_dayVO);
  }

  @Override
  public Plan_dayVO read(int plan_day_no) {
    return plan_dayDAO.read(plan_day_no);
  }

  @Override
  public int update(Plan_dayVO plan_dayVO) {
    return plan_dayDAO.update(plan_dayVO);
  }

  @Override
  public int delete(int plan_day_no) {
    return plan_dayDAO.delete(plan_day_no);
  }
}
