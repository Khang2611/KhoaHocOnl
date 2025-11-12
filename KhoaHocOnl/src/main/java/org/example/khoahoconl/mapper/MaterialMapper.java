package org.example.khoahoconl.mapper;

import org.example.khoahoconl.dto.response.MaterialResponse;
import org.example.khoahoconl.entity.Material;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MaterialMapper {

    @Mapping(target = "materialId", source = "materialId")
    @Mapping(target = "materialTitle", source = "materialTitle")
    @Mapping(target = "fileUrl", source = "filePath")
    MaterialResponse toResponse(Material material);
}
