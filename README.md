# Citadel
> :warning: Warning: :construction: This tool is still in active development and doesn't have a stable version, feel free to try it and make feedback/contribute :construction:

Citadel is an open source tool and UI to create game servers on the fly, it's currently mainly based on Docker and containers but has a providers system which should allow to add more backends (Ansible, Vagrant, ...)

You can see this tool as an orchestrator for game servers. Citadel is composed of a main ReST API (the Hive) and multiple others API (Drones) which launch the game instances.

## Terminology
- Hive: The hearth of Citadel, the main server which registers the Drones
- Drone: The agents of Citadel, they launch the containers / instances of the game servers
- Instance: A game server created in Citadel

## Games supported
| Game        |  Supported         |
|-------------|:------------------:|
| Garry's Mod | :heavy_check_mark: |

## Dashboard
The dashboard allows to create game instances with a simple UI

*The Dashboard:*
![image](https://user-images.githubusercontent.com/2706559/161236045-fa589b51-c07b-4a81-b144-d60c916c703c.png)
*The Instance page:*
![image](https://user-images.githubusercontent.com/2706559/161236403-2b2ecd27-f67f-40ab-84e2-09c3036c2081.png)

## Getting started

**The software uses the LTS version of Node.JS (Currently Node 18)**

1. Pull the repository
2. Run `yarn install` to install dependencies
3. Run `docker compose up -d` to run the mongo database or run a mongo on your own
4. Create a *.env* file under `citadel-hive/.env` with this content:  
```bash
JWT_SECRET=secretsecret
PASSWORD_SALT=citadelsalt
```
5. Create a *.env* file under `citadel-drone/.env` with this content:  
```bash
CITADEL_HIVE_TOKEN=01H7G0A9JK6P5430N8PBTEJ9PH
CITADEL_HIVE_HOST=http://localhost:3000
```
6. Run `yarn hive seed` to seed the running database
7. In 3 differents consoles, run:
    - `yarn hive dev`
    - `yarn drone dev` 
    - `yarn app start`
8. You can open the Citadel UI in your browser with [http://localhost:3002]() and connect with these credentials:
    - username: `dev@citadel.io`
    - password: `password`
 
## Contributing
There is still no contribution guide or issue template.
