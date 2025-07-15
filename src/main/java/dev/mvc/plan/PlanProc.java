package dev.mvc.plan;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service("dev.mvc.plan.PlanProc")
public class PlanProc implements PlanProcInter {
  @Autowired
  private PlanDAOInter planDAO;
  
@Override
public int create(PlanVO planVO) {
  int cnt = this.planDAO.create(planVO);
  return cnt;
  }
@Override
public ArrayList<PlanVO> list_all() {
  ArrayList<PlanVO> list = this.planDAO.list_all();
  return list;
  }

@Override
public PlanVO read(int plan_no) {
  PlanVO planVO = this.planDAO.read(plan_no);
  return planVO;
}

@Override
public int update(PlanVO planVO) {
  int cnt = this.planDAO.update(planVO);
  return cnt;
}

@Override
public int delete(int plan_no) {
  int cnt = this.planDAO.delete(plan_no);
  return cnt;
}


}