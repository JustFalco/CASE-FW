# Planning en documentatie

## Documentatie

De applicatie bestaat uit twee delen: de asp.net web api en de angular frontend.

***Asp.net api***

De asp.net api is een server opgebouwd in 3 lagen: de repository laag, de service laag en de controller laag. Deze lagen zijn terug te vinden in aparte projecten. De productie server draait standaard op <https://localhost:7010>. De configuratie hiervoor is terug te vinden in launchsettings.json.
De server beschikt over de volgende endpoints:

- <https://localhost:7010/api/courses?week=12&year=2023> [GET]

    ```txt
    Query params: week (number) & year (number)
    ```

- <https://localhost:7010/api/courses/{id}> [GET]
- <https://localhost:7010/api/courses?startdate=29-10-2023&endDate=30-10-2023> [POST]

    ```txt
    Query params: startDate (DateTime) & endDate (DateTime)
    Accepts a txt file
    ```

- <https://localhost:7010/api/student> [POST]

    ```json
    accepts following json body:
    {
        "FirstName": "Falco",
        "LastName": "Wolkorte",
        "CourseInstanceId": 1
    }
    ```

***Angular Frontend***

De angular frontend bestaat uit meerder pagina's. De server draait standaard op <http://localhost:4200/> en bestaat uit meerdere routes.

- <http://localhost:4200/> de home route, laat een lijst van cursusen per week zien. Bied ook de mogelijkheid om een week en jaar te kiezen.
- <http://localhost:4200/create> de create route, bied de mogelijkheid om op basis van een txt bestand en een start en einddatum cursussen te importeren in de applicatie. Geeft ook feedback of het importeren gelukt is.
- <http://localhost:4200/course/:id> de course details route, geeft een lijst met studenten per cursus instantie weer. Bied ook de mogelijkheid om een student aan een cursus toe te voegen.

## Planning

Bijgevoegd in deze map is de sprint backlog (.xlsx bestand). In dit bestand is een overzicht van backlog items. De items die zijn gerealiseerd zijn groen gekleurd. De items waar nog aan gewerkd wordt zijn oranje gekleurd.