package dev.mvc.reply_report;

import dev.mvc.reply.ReplyProcInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("dev.mvc.reply_report.ReplyReportProc")
public class ReplyReportProc implements ReplyReportProcInter {
    private static final int BLIND_THRESHOLD = 3;

    @Autowired
    private ReplyReportDAOInter  reportDAO;

    @Qualifier("dev.mvc.reply.ReplyProc")
    @Autowired
    private ReplyProcInter replyDAO;

    @Override
    @Transactional
    public int report(ReplyReportVO vo) {
        // 1) 중복 신고 방지
        if (reportDAO.countByReplyNoAndUserNo(vo.getReply_no(), vo.getUser_no()) > 0) {
            throw new RuntimeException("이미 신고하셨습니다.");
        }

        // 2) 신고 추가
        int cnt = reportDAO.insertReport(vo);

        // 3) 누적 신고 수 체크
        int rptCnt = reportDAO.countByReplyNo(vo.getReply_no());
        if (rptCnt >= BLIND_THRESHOLD) {
            // 4) 댓글 숨김 처리
            replyDAO.updateHiddenYn(vo.getReply_no(), "Y");
            // 5) 신고 상태 처리완료로
            reportDAO.updateStatusByReplyNo(vo.getReply_no());
        }
        return cnt;
    }

//        final int BLIND_THRESHOLD = 3;
//        int reportCount = reportDAO.countByReplyNo(vo.getReply_no());
//        if (reportCount >= BLIND_THRESHOLD) {
//            replyDAO.updateHiddenYn(vo.getReply_no(), "Y");
//        }
//
//        return cnt;
//    }
    @Override
    public List<ReplyReportVO> listAll() {
        return reportDAO.listAll();
    }
}