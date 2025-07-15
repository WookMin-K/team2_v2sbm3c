package dev.mvc.main_travel;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelMainVO {
    private int plan_no;
    private String title;
    
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
    private Date start_date;
    
    private String departure;
    private String transport;
    private String people_count;
    private String place;
    private int contentstype;   // ✅ DB 컬럼명과 맞춤
    private double x;
    private double y;
    private int trip_day;       // ✅ NUMBER(30)에 맞게 int로 변경
    private int user_no;        // ✅ DB 컬럼명과 맞춤
}