# De eerlijkheid van de Willem-Alexander roeibaan nabij Rotterdam
Dit is mijn inzending voor het vak Programmeerproject 2015
Floris Stevens	10182195

##idee##

####Hoe eerlijk is de Willem-Alexander baan?####
In de roeiwereld wordt veel gepraat over zogeheten "voordeellanen", waar je voordeel zou kunnen ondervinden van de wind, waar je in een andere laan op de roeibaan dit voordeel niet hebt en zelfs een nadeel zou kunnen hebben.  Recent is er een nieuwe roeibaan in Nederland aangelegt, de Willem-Alexander baan. Deze baan is niet alleen qua faciliteiten een verbetering op de in Amsterdam gelegen Bosbaan, hij zou ook een stuk eerlijker zijn dan laatstgenoemde. Van de Bosbaan wordt gezegd dat het weer zeer veel invloed heeft op de stroming van het water in de  verschillende lanen, bij de nieuwe Willem-Alexanderbaan zou dit niet zo'n effect hebben.

De site van de Willem-Alexander baan zegt zelf:
"De roeibaan als geheel ligt open onder de hemel, alleen omringd door kleine rietlanden. De wind heeft er weliswaar vrij spel, maar treft alle banen even hard. Het maakt de Willem Alexander Baan tot een eerlijke wedstrijdbaan."

Ik ben benieuwd in hoeverre dit correct is. Is de Willem-Alexander baan echt zo eerlijk als dat ze zelf beweren of is de baan in feite, net als de Bosbaan, beinvloedbaar door de wind.

##Verschillende onderdelen##
1. HTML pagina
  * Met CSS file
  * Baan kaart bovenaan (statisch)
2. Windroos
  * Windrichting van de dag, afhankelijk van de gekozen dag bij punt 3.
  * Wind snelheid, afhankelijk van gekozen dag bij punt 3. 
3. Keuze menu voor verschillende velden
  * Kies wedstrijd (Westelijke 2015/Damen 2015/ Damen 2014)
  * Kies dag (Zaterdag/Zondag)
  * Kies veld (een specifiek roei-veld of alle velden)
4. Grafiek die weergeeft in welke laan de winnende ploeg lag, per heat.

##Benodigde data##
Om de vraag te kunnen beantwoorden hoe eerlijk de Willem-Alexander baan nou is moet er natuurlijk weersdata zijn en roeiuitslagen nodig

De weersdata zal worden gedownload van http://www.knmi.nl/climatology/daily_data/selection.cgi voor weersstation Rotterdam waar de Richting van de wind en de snelheid de belangrijkste variabelen zijn.  
1.	23 & 24 mei 2015 (Westelijke)
2.	 2 &  3 mei 2015 (Damen 2015)
3.	 3 &  4 mei 2014 (Damen 2014).

De roeiuitslagen zullen worden gescraped van time-team.nl.  
1.	Westelijke 2015
2.	Damen 2015
3.	Damen 2014.

De uitslagen zullen voor elke heat opgeslagen worden met de starttijd, de ploegen, de gevaren tijd, de laan, de behaalde plaats. De gevaren
tijd van de winnende ploeg zal gezien worden als 100% score. De andere tijden worden teruggerekend naar een percentage om een maatstaaf te
hebben die kan worden gebruikt voor visuele eigenschappen.
Uiteindelijke visualisatie zal met behulp van D3 gemaakt worden en dus zal de data waarschijnlijk omgezet worden in JSON formaat.

##Mogelijke problemen##
Keuze menu voor de wedstrijden, de dag en het veld.
