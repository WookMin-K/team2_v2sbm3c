package dev.mvc.recommendlog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.recommendlog.RecommendLogProc")
public class RecommendLogProc implements RecommendLogProcInter {

  @Autowired
  private RecommendLogDAOInter recommendLogDAO;

  @Override
  public int insert(RecommendLogVO vo) {
    return recommendLogDAO.insert(vo);
  }

  @Override
  public List<RecommendLogVO> list() {
    return recommendLogDAO.list();
  }

  @Override
  public List<RecommendLogVO> list_by_user(int user_no) {
    return recommendLogDAO.list_by_user(user_no);
  }

  @Override
  public RecommendLogVO read(int log_id) {
    return recommendLogDAO.read(log_id);
  }

  @Override
  public int delete(int log_id) {
    return recommendLogDAO.delete(log_id);
  }

  @Override
  public int count() {
    return recommendLogDAO.count();
  }

}
