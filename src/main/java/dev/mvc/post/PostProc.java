package dev.mvc.post;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.post.PostProc")
public class PostProc implements PostProcInter {

  @Autowired
  private PostDAOInter postDAO;


  @Override
  public int create(PostVO postVO) {
    return postDAO.create(postVO);
  }

  @Override
  public List<PostVO> list() {
    return postDAO.list();
  }

  @Override
  public int list_count() {
    return postDAO.list_count();
  }

  @Override
  public List<PostVO> list_by_page(HashMap<String, Object> map) {
    return postDAO.list_by_page(map);
  }

  @Override
  public PostVO read(int post_no) {
    return postDAO.read(post_no);
  }

  @Override
  public int update(PostVO postVO) {
    return postDAO.update(postVO);
  }

  @Override
  public int update_image(PostVO postVO) {
    return postDAO.update_image(postVO);
  }

  @Override
  public int update_file(PostVO postVO) {
    return postDAO.update_file(postVO);
  }

  @Override
  public int delete(int post_no) {
    return postDAO.delete(post_no);
  }

  @Override
  public int increaseViewCnt(int post_no) {
    return postDAO.increaseViewCnt(post_no);
  }
  
  @Override
  public String getOriginalFileName(String savedFileName) {
    return postDAO.getOriginalFileName(savedFileName); // DAO로 위임
  }


  @Override
  public List<PostVO> search_by_page(Map<String, Object> paramMap) {
    return postDAO.search_by_page(paramMap);
  }

  @Override
  public int search_count(Map<String, Object> paramMap) {
    return postDAO.search_count(paramMap);
  }

  @Override
  public PostVO readPrev(int post_no) {
    return postDAO.readPrev(post_no);
  }

  @Override
  public PostVO readNext(int post_no) {
    return postDAO.readNext(post_no);
  }
  
  @Override
  public Map<String,Object> listByUser(int page, int userNo) {
    int recordPerPage = 10;
    // 첫 번째 행 번호: (page-1)*pageSize + 1
    int start = (page - 1) * recordPerPage + 1;
    // 마지막 행 번호: page*pageSize
    int end   = page * recordPerPage;

    // 1) 페이징된 리스트
    List<PostVO> list = postDAO.listByUser(start, end, userNo);
    // 2) 총 건수
    int total = postDAO.countByUser(userNo);

    Map<String,Object> map = new HashMap<>();
    map.put("list", list);
    map.put("now_page", page);
    map.put("total", total);
    map.put("record_per_page", recordPerPage);
    return map;
  }

}
