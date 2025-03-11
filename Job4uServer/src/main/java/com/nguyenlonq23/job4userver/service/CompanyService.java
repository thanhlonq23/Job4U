package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Company;
import com.nguyenlonq23.job4userver.model.enums.CompanyStatus;
import com.nguyenlonq23.job4userver.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
    @Autowired
    CompanyRepository companyRepository;

    // Lấy tất cả Companies kèm phân trang và từ khóa tìm kiếm,sort
    public Page<Company> getCompaniesWithPaginationAndFilter(String keyword, Pageable pageable) {
        // Lọc dữ liệu bằng từ khóa nếu keyword không rỗng
        if (keyword != null && !keyword.isEmpty()) {
            return companyRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        // Trả về toàn bộ nếu không có keyword
        return companyRepository.findAll(pageable);
    }


    // Lấy company theo ID
    public Company getCompanyById(int id) {
        return companyRepository.findById(id).orElse(null);
    }

    // Tạo mới hoặc cập nhật company
    public Company saveCompany(Company company) {
        company.setStatus(CompanyStatus.PENDING);
        return companyRepository.save(company);
    }

    // Cập nhật company
    public Company updateCompany(int id, Company companyDetails) {
        return companyRepository.findById(id).map(company -> {
            company.setName(companyDetails.getName());
            company.setThumbnail(companyDetails.getThumbnail());
            company.setCoverImage(companyDetails.getCoverImage());
            company.setDescription_HTML(companyDetails.getDescription_HTML());
            company.setDescription_Markdown(companyDetails.getDescription_Markdown());
            company.setWebsite(companyDetails.getWebsite());
            company.setAddress(companyDetails.getAddress());
            company.setEmail(companyDetails.getEmail());
            company.setAmountEmployer(companyDetails.getAmountEmployer());
            company.setTaxNumber(companyDetails.getTaxNumber());
            company.setStatus(companyDetails.getStatus());
            company.setUpdatedAt(new java.util.Date());
            return companyRepository.save(company);
        }).orElseThrow(() -> new RuntimeException("Company not found with id " + id));
    }

    // Xóa company theo ID
    public void deleteCompany(int id) {
        companyRepository.deleteById(id);
    }
}
