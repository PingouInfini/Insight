def globals = [:]
// define the default TraversalSource to bind queries to - this one will be named "g".

globals << [hook: [
    onStartUp : { ctx ->
        ctx.logger.warn("Creating indexes.")
        graph.tx().rollback()
        res = graph.openManagement().containsGraphIndex('insightIdNameComposite')
        ctx.logger.warn("Index already exists: " + res)
        if (res) {
            ctx.logger.warn("Index already exists.")
        } else {
            mgmt = graph.openManagement()
            propertyKey = mgmt.getPropertyKey('idInsight')
            if (propertyKey == null) {
                propertyKey = mgmt.makePropertyKey('idInsight').dataType(String.class).make()
                mgmt.makeVertexLabel("idInsight").make()
            }
            ctx.logger.warn("property key  : " + propertyKey.toString())
            //compositeIndex = mgmt.buildIndex('insightIdNameComposite', Vertex.class).addKey(propertyKey).buildCompositeIndex()
            //ctx.logger.warn("compositeIndex  : " + compositeIndex.toString())
            
            mixedIndex = mgmt.buildIndex('insightIdNameMixed', Vertex.class).addKey(propertyKey).buildMixedIndex("search")
            ctx.logger.warn("compositeIndex  : " + mixedIndex.toString())
            mgmt.commit()
            res = graph.openManagement().containsGraphIndex('insightIdNameComposite')
            ctx.logger.warn("Index created : " + res.toString())
        }
    },
    onShutDown: { ctx ->
        ctx.logger.warn("Executed once at shutdown of Gremlin Server.")
    }
] as LifeCycleHook]
globals << [g   : graph.traversal(),
            mgmt: graph.openManagement()]


