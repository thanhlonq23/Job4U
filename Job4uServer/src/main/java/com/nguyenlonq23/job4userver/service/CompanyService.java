package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import com.nguyenlonq23.job4userver.repository.CompanyRepository;
import com.nguyenlonq23.job4userver.utils.UpdateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Lazy
@Service
public class CompanyService {
    private CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // Lấy tất cả kèm phân trang,tìm kiếm, sort
    public Page<Company> getCompaniesWithPaginationAndFilter(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return companyRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        return companyRepository.findAll(pageable);
    }


    // Lấy company theo ID
    public Company getCompanyById(int id) {
        return companyRepository.findById(id).orElse(null);
    }

    public Optional<CompanyStatus> getCompanyStatus(int companyId) {
        // Ví dụ: Tìm danh sách trạng thái từ một repository
        return companyRepository.findStatusByCompanyId(companyId);
    }



    // Tạo mới hoặc cập nhật company
    public Company saveCompany(Company company) {
        company.setStatus(CompanyStatus.PENDING);
        return companyRepository.save(company);
    }


    // Cập nhật company
    public Company updateCompany(Company companyDetails) {
        return companyRepository.findById(companyDetails.getId()).map(company -> {
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getName(), company::setName);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getThumbnail(), company::setThumbnail);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getCoverImage(), company::setCoverImage);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getDescription_Markdown(), company::setDescription_Markdown);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getWebsite(), company::setWebsite);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getAddress(), company::setAddress);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getEmail(), company::setEmail);
            UpdateUtil.updateFieldIfNotEmpty(companyDetails.getTaxNumber(), company::setTaxNumber);

            if (companyDetails.getStatus() != null) {
                company.setStatus(companyDetails.getStatus());
            }

            // Cập nhật số lượng nhân viên
            company.setAmountEmployer(companyRepository.countUsersByCompanyId(company.getId()));
            // Cập nhật thời gian chỉnh sửa
            company.setUpdatedAt(new java.util.Date());

            return companyRepository.save(company);
        }).orElseThrow(() -> new RuntimeException("Company not found with id " + companyDetails.getId()));
    }


    // Xóa company theo ID
    public void deleteCompany(int id) {
        companyRepository.deleteById(id);
    }
}
