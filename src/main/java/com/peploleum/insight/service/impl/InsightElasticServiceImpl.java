package com.peploleum.insight.service.impl;

import com.peploleum.insight.domain.InsightEntity;
import com.peploleum.insight.service.InsightElasticService;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.suggest.Suggest.Suggestion;
import org.elasticsearch.search.suggest.Suggest.Suggestion.Entry;
import org.elasticsearch.search.suggest.Suggest.Suggestion.Entry.Option;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.completion.CompletionSuggestionBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Created by GFOLGOAS on 04/04/2019.
 * <p>
 * Elasticsearch Custom Queries
 */
@Service
public class InsightElasticServiceImpl implements InsightElasticService {
    private final Logger log = LoggerFactory.getLogger(InsightElasticServiceImpl.class);
    private final Integer NUMBER_SUGGESTION_TO_RETURN = 5;
    private final ElasticsearchOperations esOps;

    public InsightElasticServiceImpl(ElasticsearchOperations esOps) {
        this.esOps = esOps;
    }

    @Override
    public <T extends InsightEntity> Page<T> search(String query, Class<T> clazz, Pageable pageable) {
        NativeSearchQueryBuilder searchQueryBuilder = new NativeSearchQueryBuilder().withQuery(queryStringQuery(query));
        NativeSearchQuery esQuery = searchQueryBuilder.withPageable(pageable).build();
        return this.esOps.queryForPage(esQuery, clazz);
    }

    @Override
    public <T extends InsightEntity> List<String> autoComplete(String query, Class<T> clazz) {
        SearchRequest searchRequest = new SearchRequest(clazz.getName().toLowerCase());
        CompletionSuggestionBuilder suggestBuilder = new CompletionSuggestionBuilder(getAutoCompleteField(clazz.getSimpleName()));
        suggestBuilder.size(NUMBER_SUGGESTION_TO_RETURN)
            .prefix(query, Fuzziness.TWO)
            .analyzer("standard");

        final String suggestionName = "suggestion-name";
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.suggest(new SuggestBuilder().addSuggestion(suggestionName, suggestBuilder));
        searchRequest.source(sourceBuilder);

        List<String> results = new ArrayList<>();
        try {
            SearchResponse response = this.esOps.getClient().search(searchRequest).get();
            Suggestion<Entry<Option>> suggestion = response.getSuggest().getSuggestion(suggestionName);
            for (Entry<Option> entry : suggestion.getEntries()) {
                for (Option option : entry.getOptions()) {
                    results.add(option.getText().toString());
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            this.log.error("Error in autoComplete ES search", e);
        }
        return results;
    }

    static String getAutoCompleteField(String entityType) {
        switch (entityType) {
            case "Biographics":
                return "biographics_name";
            default:
                return null;
        }
    }
}
