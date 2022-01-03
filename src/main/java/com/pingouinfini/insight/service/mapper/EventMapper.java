package com.pingouinfini.insight.service.mapper;

import com.pingouinfini.insight.domain.Event;
import com.pingouinfini.insight.service.dto.EventDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity Event and its DTO EventDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EventMapper extends EntityMapper<EventDTO, Event> {


    default Event fromId(String id) {
        if (id == null) {
            return null;
        }
        Event event = new Event();
        event.setId(id);
        return event;
    }

}
