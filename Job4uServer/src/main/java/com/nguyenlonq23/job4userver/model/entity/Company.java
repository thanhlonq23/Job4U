package com.nguyenlonq23.job4userver.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import com.nguyenlonq23.job4userver.model.enums.PostStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name" , nullable = false)
    private String name;

    @Lob
    @Column(name = "thumbnail", columnDefinition = "LONGTEXT")
    private String thumbnail;

    @Lob
    @Column(name = "coverimage", columnDefinition = "LONGTEXT")
    private String coverImage;

    @Column(name = "description_HTML", columnDefinition = "LONGTEXT")
    private String description_HTML;

    @Column(name = "description_Markdown", columnDefinition = "LONGTEXT")
    private String description_Markdown;

    @Column(name = "website")
    private String website;

    @Column(name = "address")
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "amountemployer")
    private Integer amountEmployer;

    @Column(name = "taxnumber")
    private String taxNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CompanyStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date createdAt;

    @UpdateTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "updatedAt", nullable = true, columnDefinition = "TIMESTAMP(0)")
    private Date updatedAt;
}