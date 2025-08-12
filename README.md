# API_UI_DemoTests

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/mohamednabil27/API_UI_DemoTests/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/mohamednabil27/API_UI_DemoTests/tree/ci-setup)

NightwatchJS UI automation + Jest API tests, wired to run locally and in CircleCI.  
Repo: https://github.com/mohamednabil27/API_UI_DemoTests

---

## Contents

- **UI (NightwatchJS)**
  - Page Objects under `page-objects/`
  - Specs under `test/UI/`
  - HTML report & screenshots in `tests_output/`
- **API (Jest + Supertest)**
  - Specs under `test/API/`
  - Mock server: `mock-user-auth`
  - Reports in `reports/api/`
- **CI/CD**
  - `.circleci/config.yml` runs **UI then API**
  - Status badge above

