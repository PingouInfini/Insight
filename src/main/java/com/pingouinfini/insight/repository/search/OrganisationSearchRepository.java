package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.Organisation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Organisation entity.
 */
public interface OrganisationSearchRepository extends ElasticsearchRepository<Organisation, String> {
}
