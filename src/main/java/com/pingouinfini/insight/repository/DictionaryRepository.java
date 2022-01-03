package com.pingouinfini.insight.repository;


import com.pingouinfini.insight.domain.dictionary.Dictionary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface DictionaryRepository extends MongoRepository<Dictionary, String> {
}
