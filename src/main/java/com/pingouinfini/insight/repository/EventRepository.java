package com.pingouinfini.insight.repository;

import com.pingouinfini.insight.domain.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Event entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventRepository extends MongoRepository<Event, String> {

}
