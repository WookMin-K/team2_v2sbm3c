package dev.mvc.post_report;

import java.util.List;

public interface PostReportProcInter {


    int report(PostReportVO vo);

    List<PostReportVO> listAll();
}
