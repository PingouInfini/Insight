package com.peploleum.insight.service.impl;

import com.peploleum.insight.service.dto.RelationDTO;
import com.peploleum.insight.service.util.GraphyHttpUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Service
public class GraphyClientServiceImpl {

    private final String apiRootUrl;
    @Value("${graph.enabled}")
    private boolean graphEnabled;

    @Value("${graph.host}")
    private String graphHost;

    @Value("${graph.port}")
    private int graphPort;

    private final Logger log = LoggerFactory.getLogger(GraphyClientServiceImpl.class);

    public GraphyClientServiceImpl() {
        this.apiRootUrl = "http://" + this.graphHost + ":" + this.graphPort + "/api/";
    }

    public String sendToGraphy(Object entity) throws IOException {
        this.log.debug("Sending Entity " + entity);
        return this.doSend(entity);
    }

    public void sendRelationToGraphy(String idSource, String idTarget, String sourceType, String targetType) throws IOException {
        this.log.debug("Sending relation " + idSource + " to " + idTarget + " typeSource: " + sourceType + " typeTarget: " + targetType);
        this.doSendRelation(idSource, idTarget, sourceType, targetType);
    }

    private String doSendRelation(String idSource, String idTarget, String sourceType, String targetType) {
        final RelationDTO relationDTO = new RelationDTO();
        relationDTO.setIdJanusSource(idSource);
        relationDTO.setIdJanusCible(idTarget);
        relationDTO.setName("linked to");
        relationDTO.setTypeSource(sourceType);
        relationDTO.setTypeCible(targetType);

        final RestTemplate rt = new RestTemplate();
        final HttpHeaders headers = GraphyHttpUtils.getBasicHeaders();
        final ResponseEntity<String> tResponseEntity;
        try {
            tResponseEntity = rt.exchange(this.apiRootUrl + "relation", HttpMethod.POST,
                new HttpEntity<>(relationDTO, headers), String.class);
            log.debug("Received " + tResponseEntity.getBody());
            return tResponseEntity.getBody();
        } catch (RestClientException e) {
            this.log.warn("Failed to send entity");
            this.log.debug(e.getMessage(), e);
            throw e;
        }
    }

    private String doSend(final Object dto) throws RestClientException {
        final RestTemplate rt = new RestTemplate();
        final HttpHeaders headers = GraphyHttpUtils.getBasicHeaders();
        final ResponseEntity<String> tResponseEntity;
        try {
            final String graphyEnpointSuffix = GraphyHttpUtils.getGraphyEndpointUrl(dto);
            if (graphyEnpointSuffix.isEmpty()) {
                this.log.warn("Failed to find endpoint for entity");
                return null;
            } else {
                this.log.debug("Sending " + dto.toString());
            }
            tResponseEntity = rt.exchange(this.apiRootUrl + graphyEnpointSuffix, HttpMethod.POST,
                new HttpEntity<>(dto, headers), String.class);
            log.debug("Received " + tResponseEntity.getBody());
            return tResponseEntity.getBody();
        } catch (RestClientException e) {
            this.log.warn("Failed to send entity");
            this.log.debug(e.getMessage(), e);
            throw e;
        }
    }
}
