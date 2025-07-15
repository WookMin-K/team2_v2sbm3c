package dev.mvc.plan_share;

import java.sql.Date;

public class PlanShareVO {
  private Long share_no;
  private String share_title;
  private String share_story;
  private String visibility;
  private Date created_day;
  private Long plan_no;
  private Long user_no;

  // Getter & Setter
  public Long getShare_no() {
      return share_no;
  }

  public void setShare_no(Long share_no) {
      this.share_no = share_no;
  }

  public String getShare_title() {
      return share_title;
  }

  public void setShare_title(String share_title) {
      this.share_title = share_title;
  }

  public String getShare_story() {
      return share_story;
  }

  public void setShare_story(String share_story) {
      this.share_story = share_story;
  }

  public String getVisibility() {
      return visibility;
  }

  public void setVisibility(String visibility) {
      this.visibility = visibility;
  }

  public Date getCreated_day() {
      return created_day;
  }

  public void setCreated_day(Date created_day) {
      this.created_day = created_day;
  }

  public Long getPlan_no() {
      return plan_no;
  }

  public void setPlan_no(Long plan_no) {
      this.plan_no = plan_no;
  }

  public Long getUser_no() {
      return user_no;
  }

  public void setUser_no(Long user_no) {
      this.user_no = user_no;
  }
}
