package com.pingouinfini.insight.service.impl;

import com.pingouinfini.insight.domain.Event;
import com.pingouinfini.insight.domain.enumeration.InsightEntityType;
import com.pingouinfini.insight.repository.EventRepository;
import com.pingouinfini.insight.repository.search.EventSearchRepository;
import com.pingouinfini.insight.service.EventService;
import com.pingouinfini.insight.service.dto.EventDTO;
import com.pingouinfini.insight.service.mapper.EventMapper;
import com.pingouinfini.insight.service.util.InsightUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Event.
 */
@Service
@Profile("!graphy")
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventMapper eventMapper;

    private final EventRepository eventRepository;
    private final EventSearchRepository eventSearchRepository;

    public EventServiceImpl(EventRepository eventRepository, EventMapper eventMapper,
                            EventSearchRepository eventSearchRepository) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
        this.eventSearchRepository = eventSearchRepository;
    }

    /**
     * Save a event.
     *
     * @param eventDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public EventDTO save(EventDTO eventDTO) {
        log.debug("Request to save Event : {}", eventDTO);
        if (eventDTO.getGeometry() == null && eventDTO.getEventCoordinates() != null && !eventDTO.getEventCoordinates().isEmpty()) {
            String[] coordinates = eventDTO.getEventCoordinates().split(",");
            eventDTO.setGeometry(InsightUtil.getGeometryFromCoordinate(coordinates));
        }

        Event event = eventMapper.toEntity(eventDTO);
        event.setEntityType(InsightEntityType.Event);
        event = eventRepository.save(event);
        eventSearchRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Get all the events.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<EventDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Events");
        return eventRepository.findAll(pageable)
            .map(eventMapper::toDto);
    }


    /**
     * Get one event by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<EventDTO> findOne(String id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findById(id)
            .map(eventMapper::toDto);
    }

    /**
     * Delete the event by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
        eventSearchRepository.deleteById(id);
    }

    /**
     * Search for the event corresponding to the query.
     *
     * @param query    the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    public Page<EventDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Events for query {}", query);
        return eventSearchRepository.search(queryStringQuery(query), pageable)
            .map(eventMapper::toDto);
    }
}
