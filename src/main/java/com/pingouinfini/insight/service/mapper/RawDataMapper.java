package com.pingouinfini.insight.service.mapper;

import com.pingouinfini.insight.domain.RawData;
import com.pingouinfini.insight.service.dto.RawDataDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity RawData and its DTO RawDataDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RawDataMapper extends EntityMapper<RawDataDTO, RawData> {


    default RawData fromId(String id) {
        if (id == null) {
            return null;
        }
        RawData rawData = new RawData();
        rawData.setId(id);
        return rawData;
    }
}
