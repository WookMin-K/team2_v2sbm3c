//package dev.mvc.users;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//
//import jakarta.servlet.http.HttpSession;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
///**
// * 비즈니스 로직 처리 클래스 - DAO 호출
// */
//@Service("dev.mvc.users.UsersProc")
//public class UsersProc implements UsersProcInter {
//
//  @Autowired
//  private UsersDAOInter usersDAO; // DAO 객체 주입
//
//  /** 아이디 중복 검사 */
//  @Override
//  public int checkID(String user_id) {
//    return usersDAO.checkID(user_id);
//  }
//
//  /** 회원 등록 */
//  @Override
//  public int create(UsersVO usersVO) {
//    return usersDAO.create(usersVO);
//  }
//
//  /** 전체 회원 목록 조회 */
//  @Override
//  public ArrayList<UsersVO> list() {
//    return usersDAO.list();
//  }
//
//  /** 회원 번호로 조회 */
//  @Override
//  public UsersVO read(int user_no) {
//    return usersDAO.read(user_no);
//  }
//
//  /** 아이디로 회원 조회 */
//  @Override
//  public UsersVO readById(String user_id) {
//    return usersDAO.readById(user_id);
//  }
//
//  /** 회원/관리자인지 검사*/
//  @Override
//  public boolean isUsers(HttpSession session) {
//    boolean sw = false;
//
//    if (session.getAttribute("grade") != null) {
//      int grade = (int) session.getAttribute("grade"); // ✅ 형변환을 int로 변경
//      if (grade >= 1 && grade <= 4) { // 일반회원(1) ~ VIP회원(4)까지 모두 포함
//        sw = true;
//      }
//    }
//
//    return sw;
//  }
//
//
//  /** 관리자인지 검사 */
//  @Override
//  public boolean isAdmin(HttpSession session) {
//    boolean sw = false;
//
//    if (session.getAttribute("grade") != null) {
//      int grade = (int) session.getAttribute("grade"); // ✅ int로 캐스팅
//      if (grade == 0) { // 관리자 등급
//        sw = true;
//      }
//    }
//
//    return sw;
//  }
//
//
//  /** 마이페이지 사용자 정보 수정 */
//  @Override
//  public int update_User(UsersVO usersVO) {
//    return usersDAO.update_User(usersVO);
//  }
//
//  /** 관리자 전용 사용자 정보 수정 */
//  @Override
//  public int update_Admin(UsersVO usersVO) {
//    return usersDAO.update_Admin(usersVO);
//  }
//
//  /** 회원 삭제 */
//  @Override
//  public int delete(int user_no) {
//    return usersDAO.delete(user_no);
//  }
//
//  /** 로그인 확인 */
//  @Override
//  public int login(HashMap<String, Object> map) {
//    return usersDAO.login(map);
//  }
//
//  /** 비밀번호 일치 여부 확인 */
//  @Override
//  public int passwd_check(HashMap<String, Object> map) {
//    return usersDAO.passwd_check(map);
//  }
//
//  /** 비밀번호 변경 */
//  @Override
//  public int passwd_update(HashMap<String, Object> map) {
//    return usersDAO.passwd_update(map);
//  }
//
//}
package dev.mvc.users;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 비즈니스 로직 처리 클래스 - DAO 호출
 */
@Service("dev.mvc.users.UsersProc")
public class UsersProc implements UsersProcInter {

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  @Autowired
  private UsersDAOInter usersDAO; // DAO 객체 주입

  /** 아이디 중복 검사 */
  @Override
  public int checkID(String user_id) {
    return usersDAO.checkID(user_id);
  }

  /** 이메일 중복 검사 */
  @Override
  public int checkEmail(String email) {
    return usersDAO.checkEmail(email);
  }


  /** 회원 등록 */
  @Override
  public int create(UsersVO usersVO) {
    // 비밀번호 암호화
    String hashed = passwordEncoder.encode(usersVO.getPassword());
    usersVO.setPassword(hashed);

    return usersDAO.create(usersVO);
  }
  /** 전체 회원 목록 조회 */
  @Override
  public ArrayList<UsersVO> list() {
    return usersDAO.list();
  }

  /** 회원 번호로 조회 */
  @Override
  public UsersVO read(int user_no) {
    return usersDAO.read(user_no);
  }

  /** 아이디로 회원 조회 */
  @Override
  public UsersVO readById(String user_id) {
    return usersDAO.readById(user_id);
  }

  /** 회원/관리자인지 검사*/
  @Override
  public boolean isUsers(HttpSession session) {
    boolean sw = false;

    if (session.getAttribute("grade") != null) {
      int grade = (int) session.getAttribute("grade"); // ✅ 형변환을 int로 변경
      if (grade >= 1 && grade <= 4) { // 일반회원(1) ~ VIP회원(4)까지 모두 포함
        sw = true;
      }
    }

    return sw;
  }


  /** 관리자인지 검사 */
  @Override
  public boolean isAdmin(HttpSession session) {
    boolean sw = false;

    if (session.getAttribute("grade") != null) {
      int grade = (int) session.getAttribute("grade"); // ✅ int로 캐스팅
      if (grade == 0) { // 관리자 등급
        sw = true;
      }
    }

    return sw;
  }


  /** 마이페이지 사용자 정보 수정 */
  @Override
  public int update_User(UsersVO usersVO) {
    return usersDAO.update_User(usersVO);
  }

  /** 관리자 전용 사용자 정보 수정 */
  @Override
  public int update_Admin(UsersVO usersVO) {
    return usersDAO.update_Admin(usersVO);
  }

  /** 회원 삭제 */
  @Override
  public int delete(int user_no) {
    return usersDAO.delete(user_no);
  }

  /** 로그인 확인 */
  @Override
  public int login(HashMap<String, Object> map) {
    return usersDAO.login(map);
  }

  /**  비밀번호 일치 여부 확인 (기존 평문 방식) */
  @Override
  public int passwd_check(HashMap<String, Object> map) {
    return usersDAO.passwd_check(map);
  }

  /** 암호화된 비밀번호를 조회해서 입력된 평문과 비교 */
  @Override
  public boolean getHashedPassword(int user_no, String inputPassword) {
    String hashed = usersDAO.getHashedPassword(user_no);
    return passwordEncoder.matches(inputPassword, hashed);
  }

  /** 비밀번호 변경 시 암호화 후 업데이트 처리 */
  @Override
  public int passwd_update(int user_no, String newPassword) {
    String encrypted = passwordEncoder.encode(newPassword);
    Map<String, Object> map = new HashMap<>();
    map.put("user_no", user_no);
    map.put("password", encrypted);
    return usersDAO.passwd_update((HashMap<String, Object>) map);
  }

  /** 기존: 평문 비밀번호를 바로 업데이트할 때 사용 - 유지용 */
  @Override
  public int passwd_update(HashMap<String, Object> map) {
    return usersDAO.passwd_update(map);
  }

}
