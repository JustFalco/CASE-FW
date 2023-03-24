# TraineeshipEindcase

Tijdens deze eindcase is een full stack web applicatie gerealiseerd. Deze applicatie autimatiseerd geïntergreerde cursus- en cursistenadministratie.

## benodigdheden

Voor dat de applicatie geïnstalleerd kan worden zijn er een aantal benodigdheden vereist:

1. Een locale SQL server database (voor installatie van deze database zie: [SQL Server Installatiehandleiding](https://learn.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server?view=sql-server-ver16))
1. De laatste versies van NodeJS en NPM.
    - NodeJS versie 18.x.x of hoger (voor installatie zie [NodeJS Installatiehandleiding](https://phoenixnap.com/kb/install-node-js-npm-on-windows))
    - NPM versie 9.x.x of hoger (voor installatie zie [NPM Installatiehandleiding](https://phoenixnap.com/kb/install-node-js-npm-on-windows))
    - dotnet versie 7.x.x of hoger (voor installatie zie [dotnet Installatiehandleiding](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70))

## Installatie

1. Download het .zip bestand van [Github](https://github.com/JustFalco/CASE-FW) en pak deze uit (gebruik hiervoor bijvoorbeeld 7zip)
1. Open een terminal op de locatie van het zojuist uitgepakte bestand:
    - Open een terminal door rechtermuis klik in de folder -> Open CMD (of iterm) here
    - OF open een terminal en navigeer naar de folder met het commando

    ```bash
    cd {Your_Path_To_Folder}/CASE-FW-main/CASE-FW-main
    ```

1. Voordat de server kan draaien moet de database bekend zijn bij de server.
1. Voer het volgende commando in de terminal uit:

    ```bash
    cd EindcaseASPNETBackend/ && dotnet ef database update --context CourseContext --project Data-access-layer --startup-project EindcaseASPNETBackend 
    ```

1. Als dit commando een error terug geeft zal de connectionstring van de applicatie aangepast moeten worden.
1. Open de folder (niet in de terminal) EindcaseASPNETBackend/ en open vervolgens het EindcaseASPNETBackend.sln bestand
1. Als de IDE geopend is, zoek dan het bestand appsettings.json (EindcaseASPNETBackend/appsettings.json)
1. Open dit bestand
1. Verander LocalConnection naar "Server=localhost;Database=Eindcase-FW;User Id={YOUR_USER_ID};Password={YOUR_PASSWORD};"
1. Sla het bestand op en voer het bovenstaande commando opnieuw uit

----

## Starten van de server (Terminal)

***NOTE:*** Voordat de server gestart wordt, zorg dat er geen andere applicaties van studenten draaien.

1. In de terminal, navigeer naar de backend folder met:

    ```bash
    cd EindcaseASPNETBackend/
    ```

1. Start de productie server met het volgende commando:

    ```bash
    dotnet run --configuration Release --launch-profile https --project EindcaseASPNETBackend
    ```

1. Na het opstarten zal het volgende scherm verschijnen:

    ```bash
    info: Microsoft.Hosting.Lifetime[14]
        Now listening on: https://localhost:7010
    info: Microsoft.Hosting.Lifetime[14]
        Now listening on: http://localhost:5060
    ```

1. Controlleer of het scherm in de terminal aangeeft dat de server naar <https://localhost:7010> luisterd, is dit niet het geval moet de server via een IDE opgestart worden.

----
## Starten van de server (IDE)

1. Open de folder EindcaseASPNETBackend/ en open vervolgens het EindcaseASPNETBackend.sln bestand (met visual studio)
1. In de IDE, zet de configuration naar Release (Als deze nog op Debug staat)
1. Start de server zonder te debuggen
1. Controlleer of de server op <https://localhost:7010> draait

----

## Starten van de front-end (Terminal)

***NOTE:*** Voordat de server gestart wordt, zorg dat er geen andere applicaties van studenten draaien.

1. Open een nieuwe terminal op de locatie van het uitgepakte zip bestand
1. In de terminal, navigeer naar de backend folder met:

    ```bash
    cd EindcaseAngularFrontend/
    ```

1. Installeer de benodigde modules met:

    ```bash
    npm i
    ```

1. Start vervolgens de server met:

    ```bash
    ng serve
    ```

1. De server zou nu moeten draaien op <http://localhost:4200>, zoals te zien is in de terminal output.

***NOTE:*** Mocht deze poort al bezet zijn zal de terminal dit aangeven en vragen om gebruik te maken van een andere poort, deze nieuwe poort is terug te vinden in de terminal output. Zorg hierbij wel dat de CORS instelling van de server aangepast worden op basis van de nieuwe poort. Open EindcaseASPNETBackend/EindcaseASPNETBackend/Program.cs en verander de variabele frontendUrl op regel 10 naar de nieuwe url van de frontend.
