package dev.mvc.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service("dev.mvc.notice.NoticeProc")
public class NoticeProc implements NoticeProcInter {

    @Autowired
    private NoticeDAOInter noticeDAO;

    @Override
    public int create(NoticeVO vo) {
        return noticeDAO.create(vo);
    }

    @Override
    public List<NoticeVO> list_by_page(HashMap<String, Object> map) {
        return noticeDAO.list_by_page(map);
    }

    @Override
    public int count_by_type(String type) {
        return noticeDAO.count_by_type(type);
    }

    @Override
    public NoticeVO read(int notice_no) {
        // 1. 조회수 증가
        noticeDAO.increaseViewCnt(notice_no);

        // 2. 증가된 상태로 데이터 조회
        return noticeDAO.read(notice_no);
    }

    @Override
    public void increaseViewCnt(int notice_no) {
        noticeDAO.increaseViewCnt(notice_no);
    }

    @Override
    public int update(NoticeVO vo) {
        return noticeDAO.update(vo);
    }

    @Override
    public int delete(int notice_no) {
        return noticeDAO.delete(notice_no);
    }
}
