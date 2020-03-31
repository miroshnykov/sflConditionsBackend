FROM ubuntu:18.04
COPY . /app
RUN apt-get update

COPY tests/run_docker_tests.sh /usr/local/bin/run_docker_tests.sh
CMD chmod +x /usr/local/bin/run_docker_tests.sh

