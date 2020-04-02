# sfl-core-condition
condition matching module and central project to turn on a chain of services

- sfl-core-condition
    -  sfl-api-advertiser
    -  sfl-api-publisher
    -  sfl-platform-advertiser
    -  sfl-platform-advertiser

# Docker Instructions
###  Build 
> docker-compose build

###  Start Build 
> docker-compose up

###  Start Build In Background 
> docker-compose up -d

###  Start Build With Debug 
> docker-compose --verbose up

###  Build & Start 
> docker-compose up --build -e release`=443

###  List Images Created 
> docker Images

###  List active containers 
> docker ps

###  List Inactive containers 
> docker ps -l

###  SSH INTO Container 
> docker exec -it core-condition /bin/bash

###  STOP/START Container 
> docker-compose stop

> docker-compose start

###  Stop All Service & Remove Containers 
> docker-compose  down

### Remove All Images Without Associated Container
> docker image prune -a

### Deploy New Release Specific Service
> RELEASE=[TAG] docker-compose up -d --no-deps --build core-condition

# [PRODUCTION COMMANDS]

### [RUN With Production File]
> RELEASE=[TAG] docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps --build core-condition

# [STAGING COMMANDS]

### [RUN With Production File]
> RELEASE=[TAG] docker-compose -f docker-compose.yml -f docker-compose.stage.yml up -d --no-deps --build core-condition

### [TURN ON ALL SERVICES AT ONCE]
> RELEASE-CORE=0.0.11 RELEASE-API-A=0.0.11 RELEASE-API-P=0.0.1 RELEASE-PLATFORM-A=0.0.1 RELEASE-PLATFORM-P=0.0.1 docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps --build core-condition