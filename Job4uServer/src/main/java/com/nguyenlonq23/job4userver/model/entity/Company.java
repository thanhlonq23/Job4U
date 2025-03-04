package com.nguyenlonq23.job4userver.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name" , nullable = false)
    private String company_name;

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

    @Column(name = "is_approved", nullable = false)
    private boolean isApproved;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @Column(name = "updatedAt", nullable = false)
    private Date updatedAt;
}