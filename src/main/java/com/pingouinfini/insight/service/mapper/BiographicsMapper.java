package com.pingouinfini.insight.service.mapper;

import com.pingouinfini.insight.domain.Biographics;
import com.pingouinfini.insight.service.dto.BiographicsDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity Biographics and its DTO BiographicsDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface BiographicsMapper extends EntityMapper<BiographicsDTO, Biographics> {


    default Biographics fromId(String id) {
        if (id == null) {
            return null;
        }
        Biographics biographics = new Biographics();
        biographics.setId(id);
        return biographics;
    }

}
