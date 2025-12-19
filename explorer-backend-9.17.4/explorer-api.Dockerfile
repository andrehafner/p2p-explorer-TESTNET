FROM eclipse-temurin:8-jre AS builder
RUN apt-get update && \
    apt-get install -y --no-install-recommends apt-transport-https apt-utils bc dirmngr gnupg && \
    echo "deb https://repo.scala-sbt.org/scalasbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823 && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends sbt && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
COPY . /explorer-backend
WORKDIR /explorer-backend
RUN sbt explorer-api/assembly
RUN mv `find . -name ExplorerApi-assembly-*.jar` /explorer-api.jar
CMD ["/usr/bin/java", "-jar", "/explorer-api.jar"]

FROM eclipse-temurin:8-jre
COPY --from=builder /explorer-api.jar /explorer-api.jar
ENTRYPOINT java -jar /explorer-api.jar $0