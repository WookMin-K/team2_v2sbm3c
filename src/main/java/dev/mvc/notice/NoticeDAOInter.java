package dev.mvc.notice;

import java.util.HashMap;
import java.util.List;

public interface NoticeDAOInter {
  
    int create(NoticeVO vo);
    
    List<NoticeVO> list_by_page(HashMap<String, Object> map);
    
    int count_by_type(String type);
    
    NoticeVO read(int notice_no);
    
    void increaseViewCnt(int notice_no);
    
    int update(NoticeVO vo);
    
    int delete(int notice_no);
}
