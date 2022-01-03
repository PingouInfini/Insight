package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.InsightEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;

import java.util.List;

/**
 * Spring Data Elasticsearch repository for the InsightEntity entity.
 */
public interface InsightEntitySearchRepository {
    /**
     * Search for the InsightEntity matching the query in multiple indices
     *
     * @param query the SearchQuery of the search
     * @return the list of entities
     */
    Page<InsightEntity> search(NativeSearchQuery query, List<String> indices);
}
