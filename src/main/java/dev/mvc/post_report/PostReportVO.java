package dev.mvc.post_report;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class PostReportVO {
    private Integer report_no;
    private Integer post_no;
    private Integer user_no;
    private String reason;
    private Date report_date;
    private String status;



}
