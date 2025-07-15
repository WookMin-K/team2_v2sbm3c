//package dev.mvc.users;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.Map;
//
//import org.json.JSONObject;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import jakarta.servlet.http.HttpSession;
//
//
//@RestController // 또는 @Controller + @ResponseBody
//@RequestMapping("/users")
//public class UsersCont {
//
//  @Autowired
//  @Qualifier("dev.mvc.users.UsersProc")
//  private UsersProcInter usersProc;
//
//  public UsersCont() {
//    System.out.println("-> UserCont created");
//
//  }
//
//  /**
//   * 아아디 중복 검사
//   * @param user_id
//   * @return
//   */
//  @GetMapping("/checkID")  //  http://localhost:9093/users/checkID?id=admin
//  @ResponseBody
//  public String checkID(@RequestParam(name = "user_id", defaultValue = "") String user_id) {
//    int cnt = this.usersProc.checkID(user_id);
//
//    JSONObject obj = new JSONObject();
//    obj.put("cnt", cnt);
//
//    return obj.toString();
//  }
//
////  /**
////   * 회원 가입 폼
////   * @param model
////   * @param usersVO
////   * @return
////   */
//// @GetMapping("/signup") //  http://localhost:9093/users/signup
//// public String create_form(Model model,
////                                 @ModelAttribute("usersVO") UsersVO usersVO) {
////   ArrayList<UsersVO> list = this.usersProc.list();
////   model.addAttribute("list", list);
////
////   return "users/signup";
//// }
//
// /**
//  * 회원 가입
//  * @param usersVO
//  * @return
//  */
// @CrossOrigin(origins = "*", allowedHeaders = "*")
// @PostMapping("/create")
// public ResponseEntity<Map<String, Object>> create_proc(@RequestBody UsersVO usersVO) {
//
//
//     Map<String, Object> response = new HashMap<>();
//     System.out.println("▶ usersVO = " + usersVO);
//     usersVO.setGrade(1);
//
//     System.out.println("▶ [usersVO] " + usersVO);
//     int cnt = this.usersProc.create(usersVO);
//     System.out.println("▶ [INSERT 결과] cnt = " + cnt);
//
//
//     if (cnt == 1) {
//         System.out.println("▶ usersVO = " + usersVO);
//         response.put("status", "success");
//         response.put("name", usersVO.getName());
//         response.put("user_id", usersVO.getUser_id());
//     } else {
//         response.put("status", "fail");
//     }
//
//     return ResponseEntity.ok(response);
// }
//    //int checkID_cnt = this.usersProc.checkID(usersVO.getUser_id()); 중복 검사 코드
////     if (checkID_cnt == 0) {
////         System.out.println("▶ usersVO = " + usersVO);
////         usersVO.setGrade(1);
////         int cnt = this.usersProc.create(usersVO);
////         System.out.println("▶ usersVO = " + usersVO);
////         if (cnt == 1) {
////             System.out.println("▶ usersVO = " + usersVO);
////             response.put("status", "success");
////             response.put("name", usersVO.getName());
////             response.put("user_id", usersVO.getUser_id());
////         } else {
////             response.put("status", "fail");
////         }
////     } else {
////         response.put("status", "duplicate");
////     } 중복 검사 까지 되는 코드
//
// /**
//  * [React 전용] 아이디로 회원 정보 조회 - JSON 반환
//  */
// @GetMapping("/{user_id}")
// public ResponseEntity<UsersVO> getUserInfo(@PathVariable("user_id") String user_id) {
//     UsersVO user = usersProc.readById(user_id); // DB에서 회원 정보 조회
//     if (user != null) {
//         return ResponseEntity.ok(user); // 200 OK + JSON 응답
//     } else {
//         return ResponseEntity.notFound().build(); // 404 Not Found
//     }
// }
//
//
//  /**
//   * 전체 회원 목록 조회
//   * @param session
//   * @param model
//   * @return
//   */
//  @GetMapping("/list")
//  public String list(HttpSession session, Model model) {
//    if (this.usersProc.isAdmin(session)) {  // 관리자만 접근 허용
//      ArrayList<UsersVO> list = this.usersProc.list();  // 모든 사용자 조회
//      model.addAttribute("list", list);
//
//      return "users/list";  // 뷰 전환
//    } else {
//      return  "redirect:/users/login_cookie_need?url=/users/list";
//    }
//  }
//
//  /**
//   * 회원번호로 상세 조회
//   * @param model
//   * @param user_no 회원 번호
//   * @return 회원 정보
//   */
//  @GetMapping("/read")
//  public String read(Model model,
//                         @RequestParam(name="user_no", defaultValue ="") int user_no) {
//    UsersVO usersVO = this.usersProc.read(user_no);
//    model.addAttribute("usersVO", usersVO);
//
//    ArrayList<UsersVO> list = this.usersProc.list();
//    model.addAttribute("list", list);
//
//    return "users/read";
//  }
//
//  /**
//   * 아이디로 회원 정보 조회
//   * @param model
//   * @param user_id 회원 id
//   * @return 회원 정보
//   */
//  @GetMapping("/readById")
//  public String readById(Model model,
//                               @RequestParam(name="user_id", defaultValue = "") String user_id) {
//    UsersVO usersVO = this.usersProc.readById(user_id);
//    model.addAttribute("usersVO", usersVO);
//
//    ArrayList<UsersVO> list = this.usersProc.list();
//    model.addAttribute("list", list);
//
//    return "users/readById";
//  }
//
//  /**
//   * [React용] 사용자 정보 수정 - PUT 방식 (JSON 요청/응답)
//   */
//  @PutMapping("/{user_id}")
//  public ResponseEntity<String> updateUserReact(@PathVariable("user_id") String user_id,
//                                                @RequestBody UsersVO usersVO,
//                                                HttpSession session) {
//      Object gradeObj = session.getAttribute("grade");
//      Object userNoObj = session.getAttribute("user_no");
//
//      System.out.println("값 확인: " + gradeObj + " / " + userNoObj);
//      // grade는 숫자로 판단, 1~5 범위의 사용자만 허용
//      if (!(gradeObj instanceof Integer) || !(userNoObj instanceof Integer user_no)) {
//          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
//      }
//      // 보안상 user_no 강제 세팅
//      usersVO.setUser_no(user_no);
//
//      int cnt = usersProc.update_User(usersVO);
//
//      if (cnt == 1) {
//          return ResponseEntity.ok("정보가 성공적으로 수정되었습니다.");
//      } else {
//          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("정보 수정 실패");
//      }
//  }
//
//
//  /**
//   * 관리자 전용 사용자 정보 수정
//   * @param model
//   * @param usersVO
//   * @return
//   */
//  @PostMapping("/update_Admin")
//  public String update_Admin(HttpSession session, Model model, @ModelAttribute("UsersVO") UsersVO usersVO) {
//
//    Object gradeObj = session.getAttribute("grade");
//
//    if(!(gradeObj instanceof String grade) || !grade.equals("admin")) {
//      // 관리자 아니면 접근 차단
//      return "redirect:/users/login_cookie_need?url=/users/update_Admin";
//    }
//
//    // 관리자일 경우 수정 실행
//    int cnt = this.usersProc.update_Admin(usersVO);
//
//    if (cnt == 1) {
//      model.addAttribute("code", "update_success");
//      model.addAttribute("name", usersVO.getName());
//      model.addAttribute("user_id", usersVO.getUser_id());
//    } else {
//      model.addAttribute("code", "update_fail");
//    }
//
//    model.addAttribute("cnt", cnt);
//    return "users/msg";
//  }
//
//  /**
//   * 회원 삭제
//   * @param model
//   * @param user_no 삭제할 회원 번호
//   * @return
//   */
//  @GetMapping("/delete")
//      public String delete(Model model, @RequestParam(name="user_no", defaultValue = "") int user_no) {
//
//    UsersVO usersVO = this.usersProc.read(user_no);
//    model.addAttribute("usersVO", usersVO);
//
//    return "users/delete";
//  }
//
//
//
//  /**
//   * 로그인 처리 (React 연동용)
//   * @param user_id React에서 전달한 아이디
//   * @param password React에서 전달한 비밀번호
//   * @param session 사용자 정보를 저장할 세션 객체
//   * @return 로그인 성공/실패 결과와 사용자 정보(JSON 형태)
//   */
//  @PostMapping("/login")
//  public Map<String, Object> login(@RequestBody Map<String, String> jsonMap,
//                                             HttpSession session) {
//
//      String user_id = jsonMap.get("user_id");
//      String password = jsonMap.get("password");
//
//      // 결과를 담을 Map 객체 생성
//      Map<String, Object> response = new HashMap<>();
//
//      // 아이디와 비밀번호를 Map에 담아서 DAO에 전달할 준비
//      HashMap<String, Object> map = new HashMap<>();
//      map.put("user_id", user_id);
//      map.put("password", password);
//
//
//      System.out.println("로그인 시도: " + user_id + " / " + password);
//      // DAO를 통해 DB에서 로그인 체크 (일치하는 유저가 있으면 1, 없으면 0)
//      int cnt = usersProc.login(map);
//
//      System.out.println("로그인 결과 cnt = " + cnt);
//      // 로그인 성공 시
//      if (cnt == 1) {
//          // 아이디로 사용자 전체 정보 읽어옴
//          UsersVO user = usersProc.readById(user_id);
//
//          // 세션에 필요한 사용자 정보 저장 (백엔드 세션 유지 목적)
//          session.setAttribute("user_no", user.getUser_no());
//          session.setAttribute("user_id", user.getUser_id());
//          session.setAttribute("name", user.getName());
//          session.setAttribute("grade", user.getGrade());
//
//          // 성공 응답 데이터 생성
//          response.put("status", "success");
//          response.put("user", user);  // 사용자 정보 전체를 JSON으로 전달
//      } else {
//          // 실패 응답 데이터 생성
//          response.put("status", "fail");
//          response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
//      }
//
//      // 최종 응답 (React에서 JSON으로 받아서 처리함)
//      return response;
//  }
//
//  /**
//   * 로그아웃 처리
//   * @param session 세션 객체
//   * @return 로그아웃 성공 메시지
//   */
//  @GetMapping("/logout")
//  public Map<String, String> logout(HttpSession session) {
//      session.invalidate();  // 모든 세션 데이터 삭제
//
//      // 로그아웃 성공 메시지를 반환
//      Map<String, String> result = new HashMap<>();
//      result.put("status", "logout");
//
//      return result;
//  }
//
//
//  /**
//   * 비밀번호 변경 처리
//   * @param session 현재 로그인한 사용자 정보가 들어있는 세션
//   * @param payload React에서 보낸 JSON (currentPassword, newPassword)
//   * @return 변경 성공/실패 결과를 JSON으로 반환
//   */
//  @PostMapping(value = "/change-password", consumes = "application/json")
//  public Map<String, Object> changePassword(HttpSession session,
//                                            @RequestBody Map<String, String> payload) {
//    Map<String, Object> response = new HashMap<>();
//
//    // 1. 로그인 여부 확인
//    if (!usersProc.isUsers(session)) {
//      response.put("success", false);
//      response.put("message", "로그인이 필요합니다");
//      return response;
//    }
//
//    // 2. 세션에서 로그인된 사용자 번호(user_no) 꺼내기
//    int user_no = (int) session.getAttribute("user_no");
//
//    // 3. React에서 전달된 현재 비밀번호와 새 비밀번호 꺼내기
//    String currentPassword = payload.get("currentPassword");
//    String newPassword = payload.get("newPassword");
//    String newPasswordConfirm = payload.get("newPasswordConfirm");
//
//
//
//    // 4. 현재 비밀번호가 맞는지 확인
//    HashMap<String, Object> checkMap = new HashMap<>();
//    checkMap.put("user_no", user_no);
//    checkMap.put("password", currentPassword);
//
//    int isMatch = usersProc.passwd_check(checkMap); // 일치하면 1, 아니면 0
//
//    if (isMatch == 0) {
//      // 현재 비밀번호가 틀림
//      response.put("success", false);
//      response.put("message", "현재 비밀번호가 일치하지 않습니다");
//      return response;
//    }
//
//    // 새 비밀번호가 null이거나 비어있으면 오류 응답
//    if (newPassword == null || newPassword.trim().isEmpty()) {
//      response.put("success", false);
//      response.put("message", "새 비밀번호가 입력되지 않았습니다");
//      return response;
//    }
//
//    // 새 비밀번호 확인 일치 여부 확인
//    if (!newPassword.equals(newPasswordConfirm)) {
//      response.put("success", false);
//      response.put("message", "새 비밀번호 확인이 일치하지 않습니다");
//      return response;
//    }
//
//    // 새 비밀번호로 업데이트 진행
//    HashMap<String, Object> updateMap = new HashMap<>();
//    updateMap.put("user_no", user_no);
//    updateMap.put("password", newPassword); // 새 비밀번호
//
//    int updateResult = usersProc.passwd_update(updateMap); // 성공하면 1
//
//    if (updateResult == 1) {
//      response.put("success", true);
//      response.put("message", "비밀번호가 성공적으로 변경되었습니다");
//    } else {
//      response.put("success", false);
//      response.put("message", "비밀번호 변경에 실패했습니다");
//    }
//
//    return response;
//  }
//
//
//}
//
//
//
//


package dev.mvc.users;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.servlet.http.HttpSession;


@RestController // 또는 @Controller + @ResponseBody
@RequestMapping("/users")
public class UsersCont {

    @Autowired
    @Qualifier("dev.mvc.users.UsersProc")
    private UsersProcInter usersProc;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public UsersCont() {
        System.out.println("-> UserCont created");

    }

    /**
     * 아아디 중복 검사
     * @param user_id
     * @return
     */
    @GetMapping("/checkID")  //  http://localhost:9093/users/checkID?id=admin
    @ResponseBody
    public String checkID(@RequestParam(name = "user_id", defaultValue = "") String user_id) {
        int cnt = this.usersProc.checkID(user_id);

        JSONObject obj = new JSONObject();
        obj.put("cnt", cnt);

        return obj.toString();
    }

//  /**
//   * 회원 가입 폼
//   * @param model
//   * @param usersVO
//   * @return
//   */
// @GetMapping("/signup") //  http://localhost:9093/users/signup
// public String create_form(Model model,
//                                 @ModelAttribute("usersVO") UsersVO usersVO) {
//   ArrayList<UsersVO> list = this.usersProc.list();
//   model.addAttribute("list", list);
//
//   return "users/signup";
// }

    /**
     * 회원 가입
     * @param usersVO
     * @return
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create_proc(@RequestBody UsersVO usersVO) {

        System.out.println("✅ POST /users/create 요청 도착!");
        Map<String, Object> response = new HashMap<>();
        System.out.println("▶ usersVO = " + usersVO);

        // 아이디 중복 체크
        int check = usersProc.checkID(usersVO.getUser_id()); // 1이면 중복, 0이면 사용 가능
        if (check > 0) {
            response.put("status", "duplicate");
            return ResponseEntity.ok(response);
        }

        // 이메일 중복 체크
        int emailCheck = usersProc.checkEmail(usersVO.getEmail());
        if (emailCheck > 0) {
            response.put("status", "email_duplicate");
            return ResponseEntity.ok(response);
        }

        usersVO.setGrade(1);

        System.out.println("▶ [usersVO] " + usersVO);
        int cnt = this.usersProc.create(usersVO);
        System.out.println("▶ [INSERT 결과] cnt = " + cnt);


        if (cnt == 1) {
            System.out.println("▶ usersVO = " + usersVO);
            response.put("status", "success");
            response.put("name", usersVO.getName());
            response.put("user_id", usersVO.getUser_id());
        } else {
            response.put("status", "fail");
        }

        return ResponseEntity.ok(response);
    }
    //int checkID_cnt = this.usersProc.checkID(usersVO.getUser_id()); 중복 검사 코드
//     if (checkID_cnt == 0) {
//         System.out.println("▶ usersVO = " + usersVO);
//         usersVO.setGrade(1);
//         int cnt = this.usersProc.create(usersVO);
//         System.out.println("▶ usersVO = " + usersVO);
//         if (cnt == 1) {
//             System.out.println("▶ usersVO = " + usersVO);
//             response.put("status", "success");
//             response.put("name", usersVO.getName());
//             response.put("user_id", usersVO.getUser_id());
//         } else {
//             response.put("status", "fail");
//         }
//     } else {
//         response.put("status", "duplicate");
//     } 중복 검사 까지 되는 코드

    /**
     * [React 전용] 아이디로 회원 정보 조회 - JSON 반환
     */
    @GetMapping("/{user_id}")
    public ResponseEntity<UsersVO> getUserInfo(@PathVariable("user_id") String user_id) {
        UsersVO user = usersProc.readById(user_id); // DB에서 회원 정보 조회
        if (user != null) {
            return ResponseEntity.ok(user); // 200 OK + JSON 응답
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }


    /**
     * 전체 회원 목록 조회
     * @param session
     * @param model
     * @return
     */
    @GetMapping("/list")
    public String list(HttpSession session, Model model) {
        if (this.usersProc.isAdmin(session)) {  // 관리자만 접근 허용
            ArrayList<UsersVO> list = this.usersProc.list();  // 모든 사용자 조회
            model.addAttribute("list", list);

            return "users/list";  // 뷰 전환
        } else {
            return  "redirect:/users/login_cookie_need?url=/users/list";
        }
    }

    /**
     * 회원번호로 상세 조회
     * @param model
     * @param user_no 회원 번호
     * @return 회원 정보
     */
    @GetMapping("/read")
    public String read(Model model,
                       @RequestParam(name="user_no", defaultValue ="") int user_no) {
        UsersVO usersVO = this.usersProc.read(user_no);
        model.addAttribute("usersVO", usersVO);

        ArrayList<UsersVO> list = this.usersProc.list();
        model.addAttribute("list", list);

        return "users/read";
    }

    /**
     * 아이디로 회원 정보 조회
     * @param model
     * @param user_id 회원 id
     * @return 회원 정보
     */
    @GetMapping("/readById")
    public String readById(Model model,
                           @RequestParam(name="user_id", defaultValue = "") String user_id) {
        UsersVO usersVO = this.usersProc.readById(user_id);
        model.addAttribute("usersVO", usersVO);

        ArrayList<UsersVO> list = this.usersProc.list();
        model.addAttribute("list", list);

        return "users/readById";
    }

    /**
     * [React용] 사용자 정보 수정 - PUT 방식 (JSON 요청/응답)
     */
    @PutMapping("/{user_id}")
    public ResponseEntity<String> updateUserReact(@PathVariable("user_id") String user_id,
                                                  @RequestBody UsersVO usersVO,
                                                  HttpSession session) {
        Object gradeObj = session.getAttribute("grade");
        Object userNoObj = session.getAttribute("user_no");

        System.out.println("값 확인: " + gradeObj + " / " + userNoObj);
        // grade는 숫자로 판단, 1~5 범위의 사용자만 허용
        if (!(gradeObj instanceof Integer) || !(userNoObj instanceof Integer user_no)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        // 보안상 user_no 강제 세팅
        usersVO.setUser_no(user_no);

        int cnt = usersProc.update_User(usersVO);

        if (cnt == 1) {
            return ResponseEntity.ok("정보가 성공적으로 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("정보 수정 실패");
        }
    }


    /**
     * 관리자 전용 사용자 정보 수정
     * @param model
     * @param usersVO
     * @return
     */
    @PostMapping("/update_Admin")
    public String update_Admin(HttpSession session, Model model, @ModelAttribute("UsersVO") UsersVO usersVO) {

        Object gradeObj = session.getAttribute("grade");

        if(!(gradeObj instanceof String grade) || !grade.equals("admin")) {
            // 관리자 아니면 접근 차단
            return "redirect:/users/login_cookie_need?url=/users/update_Admin";
        }

        // 관리자일 경우 수정 실행
        int cnt = this.usersProc.update_Admin(usersVO);

        if (cnt == 1) {
            model.addAttribute("code", "update_success");
            model.addAttribute("name", usersVO.getName());
            model.addAttribute("user_id", usersVO.getUser_id());
        } else {
            model.addAttribute("code", "update_fail");
        }

        model.addAttribute("cnt", cnt);
        return "users/msg";
    }

    /**
     * 회원 삭제
     * @param model
     * @param user_no 삭제할 회원 번호
     * @return
     */
    @GetMapping("/delete")
    public String delete(Model model, @RequestParam(name="user_no", defaultValue = "") int user_no) {

        UsersVO usersVO = this.usersProc.read(user_no);
        model.addAttribute("usersVO", usersVO);

        return "users/delete";
    }



    /**
     * 로그인 처리 (React 연동용)
     * @param user_id React에서 전달한 아이디
     * @param password React에서 전달한 비밀번호
     * @param session 사용자 정보를 저장할 세션 객체
     * @return 로그인 성공/실패 결과와 사용자 정보(JSON 형태)
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> jsonMap,
                                     HttpSession session) {

        String user_id = jsonMap.get("user_id");
        String password = jsonMap.get("password");

        // 결과를 담을 Map 객체 생성
        Map<String, Object> response = new HashMap<>();

        // 아이디로 사용자 전체 정보 읽어옴
        UsersVO user = usersProc.readById(user_id);


        // 로그인 성공 시
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {

            // 세션에 필요한 사용자 정보 저장 (백엔드 세션 유지 목적)
            session.setAttribute("user_no", user.getUser_no());
            session.setAttribute("user_id", user.getUser_id());
            session.setAttribute("name", user.getName());
            session.setAttribute("grade", user.getGrade());

            // 성공 응답 데이터 생성
            response.put("status", "success");
            response.put("user", user);  // 사용자 정보 전체를 JSON으로 전달
        } else {
            // 실패 응답 데이터 생성
            response.put("status", "fail");
            response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // 최종 응답 (React에서 JSON으로 받아서 처리함)
        return response;
    }

    /**
     * 로그아웃 처리
     * @param session 세션 객체
     * @return 로그아웃 성공 메시지
     */
    @GetMapping("/logout")
    public Map<String, String> logout(HttpSession session) {
        session.invalidate();  // 모든 세션 데이터 삭제

        // 로그아웃 성공 메시지를 반환
        Map<String, String> result = new HashMap<>();
        result.put("status", "logout");

        return result;
    }


    /**
     * 비밀번호 변경 처리
     * @param session 현재 로그인한 사용자 정보가 들어있는 세션
     * @param payload React에서 보낸 JSON (currentPassword, newPassword)
     * @return 변경 성공/실패 결과를 JSON으로 반환
     */
    @PostMapping(value = "/change-password", consumes = "application/json")
    public Map<String, Object> changePassword(HttpSession session,
                                              @RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();

        // 1. 로그인 여부 확인
        if (!usersProc.isUsers(session)) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다");
            return response;
        }

        // 2. 세션에서 로그인된 사용자 번호(user_no) 꺼내기
        int user_no = (int) session.getAttribute("user_no");

        // 3. React에서 전달된 현재 비밀번호와 새 비밀번호 꺼내기
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        String newPasswordConfirm = payload.get("newPasswordConfirm");



        // (1) 현재 비밀번호 일치 여부 (BCrypt 방식)
        if (!usersProc.getHashedPassword(user_no, currentPassword)) {
            response.put("success", false);
            response.put("message", "현재 비밀번호가 일치하지 않습니다");
            return response;
        }



        // 새 비밀번호가 null이거나 비어있으면 오류 응답
        if (newPassword == null || newPassword.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "새 비밀번호가 입력되지 않았습니다");
            return response;
        }

        // 새 비밀번호 확인 일치 여부 확인
        if (!newPassword.equals(newPasswordConfirm)) {
            response.put("success", false);
            response.put("message", "새 비밀번호 확인이 일치하지 않습니다");
            return response;
        }

        // 새 비밀번호로 업데이트 진행
        String hashedNew = passwordEncoder.encode(newPassword);
        HashMap<String, Object> updateMap = new HashMap<>();
        updateMap.put("user_no", user_no);
        updateMap.put("password", hashedNew); // 새 비밀번호

        int updateResult = usersProc.passwd_update(updateMap); // 성공하면 1

        if (updateResult == 1) {
            response.put("success", true);
            response.put("message", "비밀번호가 성공적으로 변경되었습니다");
        } else {
            response.put("success", false);
            response.put("message", "비밀번호 변경에 실패했습니다");
        }

        return response;
    }


}




