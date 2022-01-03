package com.pingouinfini.insight.service;

public interface GeneratorService {
    void feed();

    void feed(int threshold);

    void clean();
}
