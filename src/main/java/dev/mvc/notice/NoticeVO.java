package dev.mvc.notice;

import java.util.Date;

import lombok.Data;

@Data
public class NoticeVO {
  private Integer notice_no;
  private String title;
  private String content;
  private Integer user_no;
  private String type;
  private Integer viewcnt;
  private java.sql.Date wdate;
  private Integer question_id;
  private String saved_name1;
  private String origin_name1;
  private String filetype1;
  private Long filesize1;

  private String saved_name2;
  private String origin_name2;
  private String filetype2;
  private Long filesize2;
  private String user_name;

}
