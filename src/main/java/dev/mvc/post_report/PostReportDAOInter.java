package dev.mvc.post_report;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostReportDAOInter {
    int insertReport(PostReportVO report);

    int countByPostNo(int post_no);

    int countByPostNoAndUserNo(
            @Param("post_no") int postNo,
            @Param("user_no") int userNo);

    int updateStatusByPostNo(@Param("post_no") int postNo);

    List<PostReportVO> listAll();         // 관리자용 전체 목록

}