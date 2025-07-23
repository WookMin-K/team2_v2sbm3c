package dev.mvc.reply_report;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ReplyReportVO {
    private int    report_no;
    private int    reply_no;
    private int    user_no;
    private String reason;
    private String report_date;
    private String status;
    private Integer post_no;
}
