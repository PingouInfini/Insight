package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.RawData;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the RawData entity.
 */
public interface RawDataSearchRepository extends ElasticsearchRepository<RawData, String>, RawDataSearchRepositoryCustom {
}
