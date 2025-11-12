package org.example.khoahoconl.repository;

import org.example.khoahoconl.entity.CurriculumLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumLessonRepository extends JpaRepository<CurriculumLesson, Long> {

    List<CurriculumLesson> findByCurriculumIdOrderByDisplayOrder(Long curriculumId);

    void deleteByCurriculumId(Long curriculumId);
}
