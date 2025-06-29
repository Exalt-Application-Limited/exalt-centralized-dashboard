        AnalyticsEvent event = AnalyticsEvent.builder()
                .eventType(eventType)
                .sourceService(sourceService)
                .userId(userId)
                .sessionId(sessionId)
                .build();