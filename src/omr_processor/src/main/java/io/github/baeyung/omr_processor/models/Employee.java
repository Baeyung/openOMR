package io.github.baeyung.omr_processor.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Employee
{
    private String name;
    private String designation;
    private String phoneNumber;
    private String email;
    private String forMonth;
    private String todayDate;
}
