package com.pingouinfini.insight.service;

import com.pingouinfini.insight.InsightApp;
import com.pingouinfini.insight.service.dto.RawDataDTO;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = InsightApp.class)
public class RawDataSearchTest {
    @Autowired
    private RawDataService rawDataService;
    @Autowired
    private GeneratorService generatorService;
    private final Logger log = LoggerFactory.getLogger(RawDataSearchTest.class);

    @Before
    public void setup() {
        this.generatorService.feed(1);
    }

    @Test
    public void searchByCriteriaTest() {
        final Query query = new Query();
        final RawDataDTO rawDataDTO = new RawDataDTO();
        final String bidou = "bidou";
        rawDataDTO.setRawDataName(bidou);
        this.rawDataService.save(rawDataDTO);
        query.addCriteria(Criteria.where("rawDataName").is(bidou));
        final List<RawDataDTO> search = this.rawDataService.searchByCriteria(query);
        Assert.assertNotNull(search);
    }

    @Test
    public void sortLocationsTest() {
        final Query query = buildQuery("rawDataCoordinates");
        final List<RawDataDTO> search = this.rawDataService.searchByCriteria(query);
        Assert.assertNotNull(search);
        Assert.assertTrue(search.size() > 0);
        SimpleDateFormat formatter = new SimpleDateFormat("dd MM yyyy HH:mm:ss");
        search.stream().forEach((rawDataDTO -> this.log.info(formatter.format(Date.from(rawDataDTO.getRawDataCreationDate())))));
    }

    @Test
    public void sortLocationsPageTest() {
        final Query query = buildQuery("rawDataCoordinates");
        final Page<RawDataDTO> rawDataDTOS = this.rawDataService.searchByCriteria(query, PageRequest.of(0, 10));
        Assert.assertNotNull(rawDataDTOS);
        Assert.assertTrue(rawDataDTOS.getTotalElements() > 0);
        SimpleDateFormat formatter = new SimpleDateFormat("dd MM yyyy HH:mm:ss");
        rawDataDTOS.stream().forEach((rawDataDTO -> this.log.info(formatter.format(Date.from(rawDataDTO.getRawDataCreationDate())))));
    }

    @Test
    public void filterImagesTest() throws IOException {
        final RawDataDTO withImageDTO = createWithImageDTO();
        this.rawDataService.save(withImageDTO);
        final Query query = buildQuery("rawDataData");
        final List<RawDataDTO> search = this.rawDataService.searchByCriteria(query);
        Assert.assertNotNull(search);
        Assert.assertTrue(search.size() > 0);
        search.stream().forEach((rawDataDTO -> this.log.info(rawDataDTO.toString())));
    }

    @Test
    public void filterImagesAndLocationsTest() throws IOException {
        final RawDataDTO withImageDTO = createWithImageDTO();
        this.rawDataService.save(withImageDTO);
        Query query = new Query();
        query = buildQueryWithExistsCriteria(query, Arrays.asList("rawDataData", "rawDataCoordinates"));
        final Page<RawDataDTO> rawDataDTOS = this.rawDataService.searchByCriteria(query, PageRequest.of(0, 10));
        Assert.assertNotNull(rawDataDTOS);
        Assert.assertTrue(rawDataDTOS.getTotalElements() > 0);
        rawDataDTOS.stream().forEach((rawDataDTO -> this.log.info(rawDataDTO.toString())));
    }

    private RawDataDTO createWithImageDTO() throws IOException {
        final RawDataDTO withImageDTO = new RawDataDTO();
        final String withImage = "withImage";
        withImageDTO.setRawDataName(withImage);
        withImageDTO.setRawDataCoordinates("52, 28");
        final InputStream imageStream = this.getClass().getResourceAsStream("/noobnoob.jpg");
        Assert.assertNotNull(imageStream);
        withImageDTO.setRawDataData(StreamUtils.copyToByteArray(imageStream));
        return withImageDTO;
    }

    private Query buildQuery(String attributeName) {
        final Query query = new Query();
        query.addCriteria(Criteria.where(attributeName).exists(true));
        query.limit(1000);
        query.with(new Sort(Sort.Direction.DESC, "rawDataCreationDate"));
        return query;
    }

    private Query buildQueryWithExistsCriteria(Query query, List<String> attributeNames) {
        attributeNames.stream().forEach((attributeName) -> query.addCriteria(Criteria.where(attributeName).exists(true)));
        query.with(new Sort(Sort.Direction.DESC, "rawDataCreationDate"));
        return query;
    }

    @After
    public void cleanTest() {
        this.generatorService.clean();
    }

}
