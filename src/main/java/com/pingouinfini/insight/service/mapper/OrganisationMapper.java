package com.pingouinfini.insight.service.mapper;

import com.pingouinfini.insight.domain.Organisation;
import com.pingouinfini.insight.service.dto.OrganisationDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity Organisation and its DTO OrganisationDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface OrganisationMapper extends EntityMapper<OrganisationDTO, Organisation> {


    default Organisation fromId(String id) {
        if (id == null) {
            return null;
        }
        Organisation organisation = new Organisation();
        organisation.setId(id);
        return organisation;
    }
}
