call mvn package -DskipTests -Pprod -Pgraphy verify jib:dockerBuild
docker login --username=pingouinfinihub
docker tag insight pingouinfinihub/insight:latest
docker push pingouinfinihub/insight:1.0.0
