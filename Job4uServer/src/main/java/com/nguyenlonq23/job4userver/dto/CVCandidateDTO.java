package com.nguyenlonq23.job4userver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CVCandidateDTO {
    private int id;
    private int postId;
    private String jobName;
    private String jobType;
    private String jobLevel;
    private String location;
    private boolean isChecked;
}
