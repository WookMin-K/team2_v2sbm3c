package dev.mvc.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestVO {
    private int request_no;
    private int user_no;
    private String title;
    private String content;
    private Date created_at;
    private String answer;
}
