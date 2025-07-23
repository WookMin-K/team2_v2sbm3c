package dev.mvc.post_report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import dev.mvc.post.PostProcInter;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Transient;
import java.util.List;

@Service("dev.mvc.post_report.PostReportProc")
@Primary
public class PostReportProc implements PostReportProcInter {
    private static final int BLIND_THRESHOLD = 3;

    @Autowired
    private PostReportDAOInter reportDAO;

    @Autowired
//    @Qualifier("dev.mvc.post.PostProc")
    private PostProcInter postDAO;  // 게시글 hidden_yn 업데이트용

    @Override
    @Transactional
    public int report(PostReportVO vo) {
        // 1) 이미 신고했는지 체크
        if (reportDAO.countByPostNoAndUserNo(vo.getPost_no(), vo.getUser_no()) > 0) {
            throw new RuntimeException("이미 신고하셨습니다.");
        }

        // 2) 정상 신고
        int cnt = reportDAO.insertReport(vo);

        // 3) 누적 신고 수 확인
        int reportCount = reportDAO.countByPostNo(vo.getPost_no());
        if (reportCount >= BLIND_THRESHOLD) {
              // 건수
//            int updatedRows = postDAO.updateHiddenYn(vo.getPost_no(), "Y");
//            System.out.println(">> hiddenYn 업데이트 건수: " + updatedRows);
            // 3) 글 블라인드 처리
            postDAO.updateHiddenYn(vo.getPost_no(), "Y");
            // 4) 신고 레코드 상태 처리 완료로 변경
            reportDAO.updateStatusByPostNo(vo.getPost_no());
        }
        return cnt;
    }

    @Override
    public List<PostReportVO> listAll() {
        return reportDAO.listAll();
    }
}
