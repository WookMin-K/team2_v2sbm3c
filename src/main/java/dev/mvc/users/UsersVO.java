package dev.mvc.users;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * 회원 정보를 담는 VO 클래스
 */
@Setter
@Getter
@ToString
@NoArgsConstructor
public class UsersVO {

  /** 회원 번호 (PK) */
  private Integer user_no;

  /** 아이디 (이메일) */
  @NotNull(message = "아이디는 필수 항목입니다.")
  private String user_id;

  /** 비밀번호 */
  @NotNull(message = "비밀번호는 필수 항목입니다.")
  private String password;

  /** 이메일 */
  @NotNull(message = "이메일은 필수 항목입니다.")
  private String email;

  /** 이름 (한글) */
  @NotNull(message = "이름은 필수 항목입니다.")
  private String name;

  /** 전화번호 */
  @NotNull(message = "전화번호는 필수 항목입니다.")
  private String phone;



  /** 가입일 */
  private Date created_at;


  /** 회원 등급 ( 0: admin(관리자), 1: Yellow(일반회원), 2: Green(활동회원), 3: Red(우수회원), 4: Black(VIP회원) )*/
  private int grade = 1;  // 기본값은 yellow(1)

  /** 프로필 이미지 URL */
  private String profile_url;

}