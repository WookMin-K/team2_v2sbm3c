package dev.mvc.plan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/plan")  // API 경로는 /api/plan으로 설정
public class PlanCont_react {

  @Autowired
  @Qualifier("dev.mvc.plan.PlanProc")
  private PlanProcInter planProc;

  /**
   * React용: 등록 처리
   * POST /api/plan/create
   */
  @PostMapping("/create")
  public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody PlanVO planVO,
                                                    BindingResult bindingResult) {
    Map<String, Object> response = new HashMap<>();

    // 유효성 검사 실패 시
    if (bindingResult.hasErrors()) {
      response.put("status", "fail");
      response.put("message", "입력값 검증 실패");
      response.put("errors", bindingResult.getFieldErrors());
      return ResponseEntity.badRequest().body(response);
    }

    int cnt = planProc.create(planVO);

    if (cnt == 1) {
      response.put("status", "success");
      response.put("message", "등록 성공");
    } else {
      response.put("status", "error");
      response.put("message", "등록 실패");
    }

    return ResponseEntity.ok(response);
  }
}
