#!/usr/bin/env python

from mcstatus import MinecraftServer
from socket import gaierror
import chevron



view = {
    'servers': [
        { 'name': 'Survival (Main)', 'url': 'whsminecraft.de', 'description': 'Die wichtigste Welt von uns. Eigentlich alles entscheidende läuft hier ab. Auch die Karte auf der Startseite bezieht sich auf diese Welt.' },
        { 'name': 'Creative', 'url': 'creative.whsminecraft.de', 'description': 'Eine Kopie der Survival-Welt mit Creative-Modus und Worldedit für alle. Gut geeignet um z.B. große Bauwerke zu planen.' },
        { 'name': 'Beta', 'url': 'beta.whsminecraft.de', 'description': 'Hier werden Minecraft-Versionen getestet, die später auf den Hauptserver kommen. Aktuell läuft hier Version 1.17, da PaperMC noch nicht offiziell diese Version unterstützt.' }
    ]
}


for server in view['servers']:
    is_online = False
    status = None
    try:
        srv = MinecraftServer.lookup(server['url'])
        status = srv.status()
        is_online = True
    except (ConnectionRefusedError, gaierror):
        pass

    server['is_online'] = is_online
    server['players_online'] = status.players.online if is_online else 0
    server['players_max'] = status.players.max if is_online else 0


print("Content-Type: text/html")
print()
with open("template.mustache", "r") as t:
    print(chevron.render(t, view))
