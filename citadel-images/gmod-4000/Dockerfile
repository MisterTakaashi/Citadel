FROM cm2network/steamcmd

# Instal dependencies
USER root
RUN apt-get update -y
RUN apt-get install -y gdb

# Create Gameserver
USER steam
WORKDIR /home/steam
RUN mkdir gameserver
RUN ./steamcmd/steamcmd.sh +login anonymous +force_install_dir /home/steam/gameserver +app_update 4020 validate +quit
WORKDIR /home/steam/gameserver

# Expose ports
EXPOSE 27015/udp

# Add start script
USER root
ADD start.sh start.sh
RUN chmod 755 ./start.sh
RUN chown steam:steam ./start.sh

USER steam
CMD ["/home/steam/gameserver/start.sh"]

