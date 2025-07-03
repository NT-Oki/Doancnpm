package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.*;
import com.example.movie_booking.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionAdminController {

    @Autowired
    private PromotionService promotionService;

    /**
     * Get all promotions with pagination
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPromotions(
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<PromotionDTO> promotions = promotionService.getAllPromotions(includeDeleted, pageable);
            
            return ResponseEntity.ok(Map.of(
                "data", promotions.getContent(),
                "totalElements", promotions.getTotalElements(),
                "totalPages", promotions.getTotalPages(),
                "currentPage", promotions.getNumber(),
                "size", promotions.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage()));
        }
    }

    /**
     * Get active promotions
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getActivePromotions() {
        try {
            List<PromotionDTO> promotions = promotionService.getActivePromotions();
            return ResponseEntity.ok(Map.of("data", promotions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách khuyến mãi đang hoạt động: " + e.getMessage()));
        }
    }

    /**
     * Get promotion by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPromotionById(@PathVariable Long id) {
        try {
            Optional<PromotionDTO> promotion = promotionService.getPromotionById(id);
            if (promotion.isPresent()) {
                return ResponseEntity.ok(Map.of("data", promotion.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy khuyến mãi với ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy thông tin khuyến mãi: " + e.getMessage()));
        }
    }

    /**
     * Create new promotion
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPromotion(@Valid @RequestBody PromotionRequestDTO requestDTO) {
        try {
            PromotionDTO createdPromotion = promotionService.createPromotion(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Tạo khuyến mãi thành công",
                "data", createdPromotion
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tạo khuyến mãi: " + e.getMessage()));
        }
    }

    /**
     * Update promotion
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, 
                                           @Valid @RequestBody PromotionRequestDTO requestDTO) {
        try {
            PromotionDTO updatedPromotion = promotionService.updatePromotion(id, requestDTO);
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật khuyến mãi thành công",
                "data", updatedPromotion
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi cập nhật khuyến mãi: " + e.getMessage()));
        }
    }

    /**
     * Soft delete promotion
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDeletePromotion(@PathVariable Long id) {
        try {
            promotionService.softDeletePromotion(id);
            return ResponseEntity.ok(Map.of("message", "Xóa khuyến mãi thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi xóa khuyến mãi: " + e.getMessage()));
        }
    }

    /**
     * Restore deleted promotion
     */
    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restorePromotion(@PathVariable Long id) {
        try {
            promotionService.restorePromotion(id);
            return ResponseEntity.ok(Map.of("message", "Khôi phục khuyến mãi thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi khôi phục khuyến mãi: " + e.getMessage()));
        }
    }
}
