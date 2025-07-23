package dev.mvc.reply_report;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReplyReportProcInter {

    int report(ReplyReportVO vo);

    List<ReplyReportVO> listAll();
}
