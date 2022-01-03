package com.pingouinfini.insight.service.mapper;

import com.pingouinfini.insight.domain.Location;
import com.pingouinfini.insight.service.dto.LocationDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity Location and its DTO LocationDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface LocationMapper extends EntityMapper<LocationDTO, Location> {


    default Location fromId(String id) {
        if (id == null) {
            return null;
        }
        Location location = new Location();
        location.setId(id);
        return location;
    }
}
