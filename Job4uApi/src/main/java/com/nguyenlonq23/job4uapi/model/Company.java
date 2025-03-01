package com.nguyenlonq23.job4uapi.model;

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
    private String name;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "coverimage")
    private String coverImage;

    @Column(name = "descriptionHTML", columnDefinition = "LONGTEXT")
    private String descriptionHTML;

    @Column(name = "descriptionMarkdown", columnDefinition = "LONGTEXT")
    private String descriptionMarkdown;

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