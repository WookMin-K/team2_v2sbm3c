package dev.mvc.reply_report;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReplyReportDAOInter {
    int insertReport(ReplyReportVO report);
    int countByReplyNo(@Param("reply_no") int reply_no);
    int countByReplyNoAndUserNo(@Param("reply_no") int replyNo,
                                @Param("user_no")  int userNo);
    int updateStatusByReplyNo(@Param("reply_no") int reply_no);
    List<ReplyReportVO> listAll();
}
