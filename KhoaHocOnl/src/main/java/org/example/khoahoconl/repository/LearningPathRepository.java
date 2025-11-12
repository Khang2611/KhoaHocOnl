package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {

    List<LearningPath> findByIsActiveTrue();

    LearningPath findByTitle(String title);
}
