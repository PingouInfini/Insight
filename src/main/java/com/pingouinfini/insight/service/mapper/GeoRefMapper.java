package com.pingouinfini.insight.service.mapper;

import com.pingouinfini.insight.domain.GeoRef;
import com.pingouinfini.insight.service.dto.GeoRefDTO;
import org.mapstruct.Mapper;

/**
 * Created by GFOLGOAS on 15/02/2019.
 */
@Mapper(componentModel = "spring", uses = {})
public interface GeoRefMapper extends EntityMapper<GeoRefDTO, GeoRef> {
    default GeoRef fromId(String id) {
        if (id == null) {
            return null;
        }
        GeoRef geoRef = new GeoRef();
        geoRef.setId(id);
        return geoRef;
    }
}
