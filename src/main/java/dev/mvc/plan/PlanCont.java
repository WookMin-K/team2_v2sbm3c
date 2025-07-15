package dev.mvc.plan;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import dev.mvc.plan.PlanVO;
import jakarta.validation.Valid;
import dev.mvc.plan.PlanDAOInter;
import dev.mvc.plan.PlanProcInter;
import dev.mvc.plan.PlanProc;

@Controller
@RequestMapping("/plan")
public class PlanCont {
  @Autowired // Spring이 CateProcInter를 구현한 CateProc 클래스의 객체를 생성하여 할당
  @Qualifier("dev.mvc.plan.PlanProc")
  private PlanProcInter planProc;
  
  public PlanCont( ) {
    System.out.println("-> PlanCont created.");
  }

  /** 
   * 등록 폼
   * */
  @GetMapping(value="/create")  
  public String create(@ModelAttribute("planVO") PlanVO planVO) {
    planVO.setTitle("여행을 떠나요");
    planVO.setTransport("서울시/종로구/...");
    
    return "plan/create"; 
  }
  
  /**
   * 등록 처리
   * */
  @PostMapping(value="/create")
  public String create(Model model, 
                              @Valid PlanVO planVO, 
                              BindingResult bindingResult,
                              @RequestParam(name="word", defaultValue = "") String word,
                              RedirectAttributes ra) {
    // System.out.println("-> create post");
    if (bindingResult.hasErrors() == true) {
    return "plan/create"; // /templates/plan/create.html 
        }
  
    int cnt = this.planProc.create(planVO);
    // System.out.println("-> cnt: " + cnt);
    
    if (cnt == 1) {
    //  model.addAttribute("code", Tool.CREATE_SUCCESS);  
    //  model.addAttribute("name", cateVO.getName());
      ra.addAttribute("word", word);
      // return "redirect:/plan/list_all"; // @GetMapping(value="/list_all") 호출
      return "redirect:/plan/list_search"; // @GetMapping(value="/list_search") 호출
    } else {
      model.addAttribute("code"); 
    }
    model.addAttribute("cnt", cnt);
    
    return "plan/msg"; 

  }
  
  /**
   * 전체 목록
   * http://localhost:9091/plan/list_all
   * @param model
   * @return
   * 
   */
  @GetMapping(value = "/list_all")
  public String list_all(Model model, @ModelAttribute("planVO") PlanVO planVO) {
    planVO.setTitle("");
    planVO.setTransport("");

    ArrayList<PlanVO> list =this.planProc.list_all();
    model.addAttribute("list", list);
    
    return "cate/list_all"; 
    
  }
  
  /**
   * 조회
   * http://localhost:9100/plan/read/1
   * @param model
   * @return
   */
  @GetMapping(value="/read/{plan_no}")
  public String read (Model model, @PathVariable("plan_no") Integer plan_no,
                             @RequestParam(name="word", defaultValue = "") String word,
                             @RequestParam(name="now_page", defaultValue="1") int now_page) {
    
    PlanVO planVO = this.planProc.read(plan_no);
    model.addAttribute("planVO", planVO);
    
    // 카테고리 그룹 목록
    
    // model.addAttribute("word", word);
    // System.out.println("-> word null 체크: " + word);

    // ArrayList<aVO> list = this.cateProc.list_search(word);  // 검색 목록
//    ArrayList<PlanVO> list = this.planProc.list_search_paging(word, now_page, this.record_per_page); // 검색 목록 + 페이징
//    model.addAttribute("list", list);
    
//    int list_search_count = this.planProc.list_search_count(word); // 검색된 레코드 갯수
//    model.addAttribute("list_search_count", list_search_count);

  
    return "plan/read"; // /templates/cate/read.html
  }
  
  /**
   * 수정 폼
   * @param model
   * @return
   */
  
  @GetMapping(value = "/update")
  public String update(Model model, @RequestParam(name="plan_no", defaultValue="0") Integer plan_no) {
//    System.out.println("-> read cateno: " + cateno);
    
    PlanVO planVO = this.planProc.read(plan_no);
    model.addAttribute("planVO",planVO);
    
   ArrayList<PlanVO> list =this.planProc.list_all();
   model.addAttribute("list", list);

    return "cate/update"; // /templates/update.html
  }
  
  /**
   * 수정 처리
   * Model model:controller -> html 데이터 전송 제공
   * @Valid: @NotEmpty, @Size, @NotNull, @Min,@Max,@Pattern... 규칙 위반 검사 지원
   * BindingResult bindingResult: @Valid 결과 저장
   * @param model
   * @return
   */


  @PostMapping(value="/update")
  public String update(Model model, @Valid PlanVO planVO, BindingResult bindingResult) { 
    ArrayList<PlanVO> list =this.planProc.list_all();
    model.addAttribute("list", list);
    
    //System.out.println("-> create post");
    if (bindingResult.hasErrors() == true) {
      return "plan/update"; 
    }

    int cnt = this.planProc.update(planVO);
    System.out.println("-> cnt: "+cnt);
    
    if(cnt ==1) {
     return "redirect:/plan/update?plan_no=" + planVO.getPlan_no();
    } else  {
      model.addAttribute("code");  
    }
    
    model.addAttribute("cnt", cnt);
    
    return "plan/msg"; //templates/cate/msg.html
   }
  
  /**
   * 삭제폼
   * http://localhost:9091/plan/delete?plan_no=1
   * @param model
   * @return
   */
  
  @GetMapping(value = "/delete")
  public String delete(Model model, @RequestParam(name="plan_no", defaultValue="0") Integer plan_no) {
  //  System.out.println("-> read plan_no: " + plan_no);
  
  PlanVO planVO = this.planProc.read(plan_no);
  model.addAttribute("planVO",planVO);
  ArrayList<PlanVO> list =this.planProc.list_all();
  model.addAttribute("list", list);
  
  
  return "plan/delete"; // /templates/delete.html
 }
  
  
}  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
