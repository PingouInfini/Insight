package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.Biographics;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Biographics entity.
 */
public interface BiographicsSearchRepository extends ElasticsearchRepository<Biographics, String> {
}
