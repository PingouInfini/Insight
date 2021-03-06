package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.Event;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Event entity.
 */
public interface EventSearchRepository extends ElasticsearchRepository<Event, String> {
}
