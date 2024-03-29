FROM alpine:3.15.4

# Minecraft version
ARG MC_VERSION=1.18.2
ARG MC_JAR_SHA1=c8f83c5655308435b3dcf03c06d9fe8740a77469

# Set default JVM options
ENV _JAVA_OPTIONS '-Xms256M -Xmx1024M'

# Create Minecraft directories
RUN mkdir -pv /opt/minecraft /etc/minecraft

# Create non-root user
RUN adduser -DHs /sbin/nologin minecraft

# Add the EULA file
COPY ./eula.txt /etc/minecraft/eula.txt

# Install dependencies, fetch Minecraft server jar file and chown files
ARG JAR_URL=https://launcher.mojang.com/v1/objects/${MC_JAR_SHA1}/server.jar
RUN apk add --update ca-certificates nss tzdata wget \
  && apk add openjdk17-jre-headless \
  && wget -O /opt/minecraft/minecraft_server.jar ${JAR_URL} \
  && apk del --purge wget && rm -rf /var/cache/apk/* \
  && chown -R minecraft:minecraft /etc/minecraft /opt/minecraft

# Define volumes
VOLUME /etc/minecraft/world

RUN mkdir /etc/minecraft/world
RUN chown minecraft:minecraft /etc/minecraft/world

# Expose port
EXPOSE 25565

# Set running user
USER minecraft

# Set the working dir
WORKDIR /etc/minecraft

# Default run command
CMD ["java", "-jar", "/opt/minecraft/minecraft_server.jar", "nogui"]
