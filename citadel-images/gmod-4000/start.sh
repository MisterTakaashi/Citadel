#!/bin/bash

cd /home/steam/steamcmd && ./steamcmd.sh +login anonymous \
                  +force_install_dir /home/steam/gameserver \
                  +app_update 4020 validate \
                  +quit

cd /home/steam/gameserver && ./srcds_run -debug -game garrysmod -console -usercon  \
                              +maxplayers 12 \  
                              +map gm_flatgrass
