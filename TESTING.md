# Testing the Centralized Dashboard Module

This document provides instructions for running tests in the centralized-dashboard module.

## Prerequisites

- Java 17 or later
- Maven (optional, as we use Maven Wrapper)
- PowerShell (for running test scripts)

## Running Tests

### Using the Test Script (Recommended)

1. Open a terminal in the `centralized-dashboard` directory
2. Run the test script:
   ```
   .\run-tests.bat
   ```
   This will execute all tests using the Maven Wrapper.

### Using Maven Directly

If you have Maven installed and prefer to use it directly:

```bash
mvn clean test
```

### Running Specific Tests

To run specific test classes:

```bash
mvn test -Dtest=MetricCollectorServiceImplTest
```

Or multiple test classes:

```bash
mvn test -Dtest="MetricCollectorServiceImplTest,CrossDomainControllerIntegrationTest"
```

## Test Structure

- Unit tests are located in `src/test/java`
- Integration tests are in `src/test/java` with `*IntegrationTest` suffix
- Test utilities and base classes are in `src/test/java/com/microecommerce/centralizeddashboard/core`

## Test Coverage

To generate a test coverage report:

```bash
mvn clean test jacoco:report
```

The report will be available at `target/site/jacoco/index.html`

## Debugging Tests

To debug tests, you can run Maven in debug mode:

```bash
mvnDebug test
```

Then attach a remote debugger to port 8000.

## Continuous Integration

Tests are automatically run in the CI/CD pipeline. Any push to the main branch will trigger a full test suite run.

## Troubleshooting

- If you encounter Maven download issues, try:
  ```
  mvn dependency:purge-local-repository
  ```
  Then run the tests again.

- For test failures, check the logs in `target/surefire-reports/` for detailed error information.
