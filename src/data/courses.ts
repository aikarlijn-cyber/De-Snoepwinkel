export interface Course {
  id: number;
  title: string;
  category: 'Extern' | 'Collega' | 'Overig' | 'Congres';
  description: string;
  targetAudience?: string;
  maxParticipants?: string;
  duration?: string;
  location?: string;
  costs?: string;
  details?: string[];
  learningGoals?: string[];
  totalHours?: number;
}

export const courses: Course[] = [
  {
    id: 1,
    title: "Training Goed in Gesprek deel 1 basis (Rol&Co)",
    category: 'Extern',
    description: "In drie losse dagdelen ga je aan de slag met je persoonlijke ontwikkelpunt en vaardigheden die je goed kunt inzetten in je praktijk als ABer. In een veilige en vertrouwde leersetting werk je aan technieken die nodig zijn voor een goed en effectief gesprek.",
    targetAudience: "Voor AB-ers en logopedisten",
    maxParticipants: "Maximaal 8 deelnemers, we bieden komend jaar maximaal 2 groepen aan.",
    duration: "3 dagdelen (12 uur)",
    location: "Op locatie",
    details: [
      "De kunst van het luisteren en doorvragen.",
      "Het geven van opbouwende feedback.",
      "Omgaan met weerstand.",
      "Hoe zorg je ervoor dat je geen 'redder' wordt?",
      "De kunst van het begrenzen."
    ]
  },
  {
    id: 2,
    title: "Training Goed in Gesprek vervolg (Rol&Co)",
    category: 'Extern',
    description: "Rol&Co biedt een verdiepende training aan. Deze training kun je volgen als je de training Goed in Gesprek deel 1 hebt gevolgd. In deze training kijken we naar jouw kwaliteiten, persoonlijke uitdagingen en belemmerende patronen.",
    targetAudience: "Voor AB-ers en logopedisten",
    maxParticipants: "Maximaal 8 deelnemers, we bieden komend jaar maximaal 2 groepen aan.",
    duration: "3 dagdelen (12 uur)",
    location: "Op locatie",
    details: [
      "Contact maken en houden met je gesprekspartner.",
      "Regie nemen en houden in een gesprek.",
      "Omgaan met grensoverschrijdend gedrag en het stellen van grenzen.",
      "Kernkwaliteiten van Ofman vertaald naar concreet gedrag.",
      "Systemische benadering: acceptatie en begrip van de leerkracht en de school."
    ]
  },
  {
    id: 3,
    title: "Persoonlijk leiderschap",
    category: 'Extern',
    description: "Hoe verhoud ik mij als Kentalis medewerker binnen inclusiever onderwijs tot alle betrokkenen? In deze cursus staat de omslag in doen en denken centraal, waarbij veel handvatten aangereikt worden om zelfbewuster en doeltreffender de nieuwe situatie in te kunnen gaan.",
    targetAudience: "Voor AB-ers en logopedisten",
    maxParticipants: "Maximaal 8 deelnemers per groep",
    duration: "5 bijeenkomsten van elk 3,5 uur en 8 uur zelfstudie (25,5 uur)",
    location: "Op locatie",
    totalHours: 25.5,
    learningGoals: [
      "De effectiviteit van je gedrag inschatten",
      "Je (interpersoonlijke) effectiviteit vergroten",
      "Een stroef lopend proces vlot trekken",
      "Omgaan met verschillende loyaliteiten",
      "Proactief zijn",
      "Omgaan met cultuurverschillen",
      "Effectief samenwerken",
      "Vormgeven van het ambassadeurschap van Kentalis"
    ]
  },
  {
    id: 4,
    title: "Oracy",
    category: 'Extern',
    description: "Training gericht op Oracy (mondelinge taalvaardigheid) binnen de context van AD Arnhem.",
    targetAudience: "Voor alle medewerkers",
    maxParticipants: "Maximaal 16 personen",
    duration: "24 uur (3 dagen)",
    location: "Op locatie bij AD Arnhem",
    totalHours: 24
  },
  {
    id: 5,
    title: "Lego Serious Play",
    category: 'Extern',
    description: "Met LEGO® Serious Play® (LSP) maak je overleggen met leerkrachten en/of ouders en kindgesprekken tastbaar. Gedachtes worden zichtbaar. Je zet LSP in om doelen te bepalen of gedachtes te visualiseren.",
    targetAudience: "AB-ers en leraarondersteuners",
    maxParticipants: "Maximaal 15 personen",
    duration: "1 bijeenkomst van 8 uur",
    location: "Op locatie",
    totalHours: 8,
    learningGoals: [
      "Het ontstaan van de LSP Methode",
      "Het proces van de LSP Methode",
      "Bouwtechnieken",
      "Het ontwerpen van een sessie",
      "Toepassen van LSP op jouw praktijk",
      "Je eigen pitch voor je eerste sessie!"
    ]
  },
  {
    id: 6,
    title: "Taalronde",
    category: 'Extern',
    description: "De taalronde is een taalontwikkelende werkvorm geschikt voor alle groepen waarin het spreken, luisteren, tekenen en schrijven over eigen ervaringen van leerlingen centraal staat.",
    targetAudience: "Voor alle medewerkers",
    maxParticipants: "Minimaal 10, maximaal 20 personen",
    duration: "1 bijeenkomst van 2,5 uur",
    location: "Op locatie - kringopstelling gewenst",
    totalHours: 2.5
  },
  {
    id: 7,
    title: "Helder schrijven",
    category: 'Extern',
    description: "In deze training leren deelnemers hoe je een tekst helder en aansprekend schrijft. Ze maken kennis met de techniek van piramideschrijven. Hierdoor wordt een tekst sneller geschreven en beter gelezen.",
    targetAudience: "Voor AB-ers en logopedisten",
    maxParticipants: "Aantal deelnemers onbekend",
    duration: "2 x 3 uur",
    location: "Online",
    totalHours: 6,
    details: [
      "Basisprincipes van helder schrijven",
      "Oefenen met e-mails, korte berichten en ondersteuningsplannen",
      "Piramideschrijven: kernboodschap eerst",
      "Taalniveau B1: korte zinnen, actieve stijl"
    ]
  },
  {
    id: 8,
    title: "EDI 2.0 Intro",
    category: 'Extern',
    description: "Introductie tot Expliciete Directe Instructie 2.0. Leer de lesfasen en technieken van het EDI-lesmodel benoemen en omschrijven.",
    targetAudience: "Voor alle medewerkers",
    maxParticipants: "Maximaal 30 medewerkers",
    duration: "1 bijeenkomst van 3 uur",
    location: "Op locatie",
    totalHours: 3,
    learningGoals: [
      "Lesfasen en technieken van het EDI-lesmodel",
      "Theoretische onderbouwing en wetenschappelijke studies",
      "Voorbeeldles(fragment) bekijken",
      "Begrip controleren bij leerlingen"
    ]
  },
  {
    id: 9,
    title: "Bordwerk en aantekeningen module 1.0",
    category: 'Extern',
    description: "Instructie wint aan kracht als je hierbij op het bord schrijft. Leer hoe je het bord optimaal gebruikt om kennis te delen via teksten, plaatjes, animaties en video's.",
    targetAudience: "Voor alle medewerkers",
    maxParticipants: "Maximaal 30 medewerkers",
    duration: "1 bijeenkomst van 3 uur",
    location: "Op locatie"
  },
  {
    id: 10,
    title: "Ondersteunend tekenen bij TOS basistraining",
    category: 'Extern',
    description: "Terwijl wordt verteld, wordt de kern van de talige boodschap ter plekke meegetekend. Een traject van ongeveer 9 weken met online live bijeenkomsten.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max. 16 deelnemers",
    duration: "3 bijeenkomsten van 2,5 uur",
    location: "Online",
    totalHours: 7.5,
    details: [
      "3 online live bijeenkomsten (via Zoom)",
      "Tijdelijke WhatsAppgroep",
      "Toegang tot online academie en visuele bibliotheek"
    ]
  },
  {
    id: 11,
    title: "Ondersteunend tekenen bij TOS.inc PLUS",
    category: 'Extern',
    description: "Nog meer kilometers maken met Ondersteunend tekenen! Fysieke basisworkshop van 3 uur voor professionals die de basis al hebben gevolgd.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max. 16 deelnemers",
    duration: "1 bijeenkomst van 3 uur",
    location: "Op locatie"
  },
  {
    id: 12,
    title: "Gespreksvaardigheden Systemisch aan leerling en schooldoelen werken",
    category: 'Extern',
    description: "Gespreksvaardigheden m.b.t. het systemisch aan leerling- en schooldoelen werken. Hoe breng ik de systemische benadering binnen de scholen en bij de leerkrachten?",
    targetAudience: "Alle medewerkers: AB 'ers",
    maxParticipants: "Maximaal 10 deelnemers",
    duration: "2 dagdelen van 3 uur",
    location: "Op locatie",
    totalHours: 6
  },
  {
    id: 13,
    title: "Taal en denken in spel",
    category: 'Extern',
    description: "Jonge kinderen ontwikkelen zich spelenderwijs. Leer hoe je jonge kinderen meer laat denken en praten tijdens hun spel door passende spelbegeleiding, thema's en materialen.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max. 25 deelnemers",
    duration: "2 bijeenkomsten van 3 uur",
    location: "Op locatie",
    totalHours: 6,
    learningGoals: [
      "Verloop van spelontwikkeling en taal/denkontwikkeling",
      "Duiden van en aansluiten bij de taal van het spelende kind",
      "Belang van doen-alsof-spel en sociaal spel",
      "Koppelen van taal aan themaspel of prentenboek"
    ]
  },
  {
    id: 14,
    title: "Gestructureerd werken",
    category: 'Extern',
    description: "Heb jij een gebrek aan overzicht? Leer hoe je overzicht aanbrengt in je openstaande taken en mails, prioriteiten stelt en een haalbare planning maakt.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max 8 personen",
    duration: "4 uur (1 dagdeel)",
    location: "Op locatie",
    totalHours: 4,
    details: [
      "Introductie effectief plannen",
      "E-mail organisatie & beheer (Outlook)",
      "Structuur in taken & planning (Outlook/To Do)"
    ]
  },
  {
    id: 15,
    title: "De invloed van TOS op lezen en spellen",
    category: 'Extern',
    description: "Hoe kunnen we kinderen met TOS begeleiden bij hun lees- en spellingproblemen? De cursus is vooral gericht op de praktijk met veel voorbeelden en casuïstiek.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 20 personen",
    duration: "4 dagdelen van 3,5 uur",
    location: "Op locatie",
    totalHours: 14,
    details: [
      "Achtergrondinformatie TOS en dyslexie",
      "Technisch lezen",
      "Spellen",
      "Begrijpend lezen"
    ]
  },
  {
    id: 16,
    title: "Intervisie ICB",
    category: 'Extern',
    description: "Intervisie voor medewerkers die ICB hebben afgerond. Onder begeleiding van een beeldcoachdocent ICB vaardigheden onderhouden.",
    targetAudience: "AB-ers die ICB hebben afgerond",
    maxParticipants: "3-5 per groep",
    duration: "2-3 uur",
    location: "Online",
    totalHours: 2.5
  },
  {
    id: 17,
    title: "‘Waarom vraag je dat?’",
    category: 'Extern',
    description: "Een gesprek biedt kansen om nieuwe taal te leren. In deze workshop staan we stil bij verschillende type vragen en de mogelijke invloed van een vraag op een gesprek.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 20 deelnemers",
    duration: "2,5 uur",
    location: "Op locatie"
  },
  {
    id: 18,
    title: "Werkbijeenkomst na ‘Waarom vraag je dat?’",
    category: 'Extern',
    description: "Werken met voorbeelden uit de praktijk. Analyseer samen het verloop van een gesprek aan de hand van audio en transcriptie.",
    targetAudience: "AB-ers die de scholing ‘waarom vraag je dat?’ hebben gevolgd",
    maxParticipants: "Maximaal 5 deelnemers",
    duration: "2,5 uur",
    location: "Op locatie"
  },
  {
    id: 19,
    title: "Interculturele Communicatie & Diversiteit",
    category: 'Extern',
    description: "Scholing over interculturele communicatie en diversiteit binnen de onderwijsregio.",
    targetAudience: "Alle medewerkers",
    location: "Op locatie bij AD Arnhem"
  },
  {
    id: 21,
    title: "MD traject",
    category: 'Extern',
    description: "Denk jij er wel eens over na om schoolleider te worden? Dit traject is een kennismaking met de functie van schoolleider voor medewerkers die dit willen onderzoeken.",
    targetAudience: "AB-ers en logopedisten (min. 2 jaar in dienst)",
    maxParticipants: "Maximaal 3 deelnemers",
    duration: "20 uur; 5 bijeenkomsten van 3 uur + voorbereiding",
    costs: "1200 euro, de dienst neemt de helft voor haar rekening",
    totalHours: 20,
    details: [
      "Talenten Motivatie Analyse",
      "Intakegesprek",
      "Professionele identiteit",
      "Persoonlijk leiderschap en visie",
      "Bezoek van een school en interview met directeur"
    ]
  },
  {
    id: 22,
    title: "Oriëntatie op IB/KC",
    category: 'Extern',
    description: "Oriënteer je op de rol van intern begeleider / kwaliteitscoördinator (IB/KC). Ontdek of deze rol past bij je kwaliteiten en persoonlijkheid.",
    targetAudience: "AB-ers (min. 2 jaar in dienst)",
    maxParticipants: "Maximaal 3 deelnemers",
    duration: "20 uur; 5 bijeenkomsten van 3 uur + voorbereiding",
    totalHours: 20,
    details: [
      "De rol van IB/KC",
      "Domein leren en ontwikkelen",
      "Domein ondersteuning en zorg",
      "Domein data, monitoring en reflectie"
    ]
  },
  {
    id: 23,
    title: "Metalinguïstiek",
    category: 'Extern',
    description: "Workshop over het stimuleren van het nadenken over taal bij leerlingen. Hoe ga je in gesprek over klanken, grammaticale regels of dubbele betekenissen?",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 20 deelnemers",
    duration: "1 uur",
    location: "Op locatie bij AD Nijmegen",
    totalHours: 1
  },
  {
    id: 24,
    title: "Hoe voer je een gesprek dat écht werkt?",
    category: 'Extern',
    description: "Leer helder en respectvol communiceren, onderhandelingstechnieken en krijg inzicht in hoe fysieke fitheid en mentale weerbaarheid bijdragen aan de kwaliteit van een gesprek.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 16 deelnemers",
    duration: "3 uur",
    totalHours: 3
  },
  {
    id: 25,
    title: "SMART leerlingdoelen stellen (basis)",
    category: 'Collega',
    description: "Leer cluster-2 specifieke én SMART doelstellingen formuleren. Dit helpt bij de inhoudelijke begeleiding van leerlingen en communicatie met leerkrachten.",
    targetAudience: "AB-ers",
    maxParticipants: "Maximaal 12 deelnemers",
    duration: "6 uur",
    location: "Op locatie",
    totalHours: 6
  },
  {
    id: 26,
    title: "SMART leerlingdoelen stellen opfrisbijeenkomst",
    category: 'Collega',
    description: "Opfrismoment voor wie de basisworkshop al heeft gevolgd. Ga aan de slag met je eigen leerlingdoelen middels actieve werkvormen.",
    targetAudience: "AB-ers",
    maxParticipants: "Maximaal 12 deelnemers",
    duration: "1,5 uur",
    location: "Op locatie"
  },
  {
    id: 27,
    title: "SMART schooldoelen stellen",
    category: 'Collega',
    description: "Vind je het lastig om concrete schooldoelen op te stellen? In deze workshop ga je met dit vraagstuk aan de slag en leer je van elkaars casussen.",
    targetAudience: "AB-ers",
    maxParticipants: "Maximaal 12 deelnemers",
    duration: "Totaal 4 uur, 2 bijeenkomsten",
    location: "Op de dienst",
    totalHours: 4
  },
  {
    id: 28,
    title: "Vitaliteit",
    category: 'Collega',
    description: "Deel je werkplek en -manieren met collega's. Wissel ideeën uit over werkgeluk, ergonomie en efficiënt werken, zowel thuis als op locatie.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 18 deelnemers",
    duration: "1,5 uur",
    location: "Op locatie"
  },
  {
    id: 29,
    title: "Visualiseren (bij rekenen), stapsgewijs werken",
    category: 'Collega',
    description: "TOS en visualiseren bij rekenen. Wat zijn de bevindingen uit onderzoek en hoe kun je dit vertalen naar de praktijk voor jouw leerling?",
    targetAudience: "Voor alle medewerkers",
    maxParticipants: "Maximaal 18 deelnemers",
    duration: "1 bijeenkomst van 1,5 uur",
    location: "Op locatie"
  },
  {
    id: 30,
    title: "Gitaarles voor beginners",
    category: 'Collega',
    description: "Leer jezelf begeleiden op gitaar om de taalontwikkeling van kinderen op een speelse manier te stimuleren met kinderliedjes.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 10-15 deelnemers",
    duration: "1 bijeenkomst van 1 uur",
    location: "Op locatie",
    totalHours: 1
  },
  {
    id: 31,
    title: "Handlettering",
    category: 'Collega',
    description: "Maak taal zichtbaar en voelbaar door handlettering. Geef belangrijke woorden extra stevigheid en bouw samen met leerlingen aan betekenis door vorm en ritme.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 20 deelnemers",
    duration: "1 bijeenkomst van 1 uur",
    totalHours: 1
  },
  {
    id: 32,
    title: "Praktisch aan de slag met logopedische testen",
    category: 'Collega',
    description: "Wil je weten hoe een logopedische test eruitziet en wat er gevraagd wordt? We pakken de testen erbij en gaan ze echt uitproberen.",
    targetAudience: "AB-ers en logopedisten",
    maxParticipants: "Maximaal 10 deelnemers",
    duration: "2,5 uur",
    location: "Op locatie",
    totalHours: 2.5,
    details: [
      "Uitleg taalaspecten",
      "Bekijken Schlichting, CELF-V-NL, Peabody",
      "Uitleg scores (Q-scores, percentielen)",
      "Casuïstiek"
    ]
  },
  {
    id: 33,
    title: "Van (logopedisch) papier naar praktijk! + inzet ‘TOS-web in een zakje’",
    category: 'Collega',
    description: "Worstel je met logopedische verslagen en het inzetten van het TOS-web? Leer relevante informatie analyseren en vertalen naar participatieniveau.",
    targetAudience: "AB-ers en logopedisten",
    maxParticipants: "Maximaal 10 deelnemers",
    duration: "3,5 uur op locatie (2 bijeenkomsten)",
    totalHours: 3.5,
    learningGoals: [
      "Informatie halen uit logopedisch verslag",
      "Gebruik van TOS-web voor analyse",
      "Vertaling naar activiteits- en participatieniveau",
      "Bespreken eigen casus"
    ]
  },
  {
    id: 34,
    title: "Denkstimulerende Gespreksmethodiek (DGM)",
    category: 'Collega',
    description: "Hoe kan DGM ingezet worden vanuit de systemische benadering? (Inhoud wordt nog nader beschreven).",
    targetAudience: "Alle medewerkers die DGM al hebben gevolgd",
    maxParticipants: "Maximaal 24 deelnemers",
    duration: "1 x 2,5 uur",
    totalHours: 2.5
  },
  {
    id: 35,
    title: "Eigenaarschap. Kindgesprek in de praktijk",
    category: 'Collega',
    description: "Verschillende soorten kindgesprekken: welke inhoud, materialen en vragen zijn passend bij de leeftijd en het doel?",
    targetAudience: "Voor LO-ers en nieuwe AB-ers",
    maxParticipants: "Maximaal 12 deelnemers",
    duration: "3 uur (2 bijeenkomsten van 1,5 uur)",
    location: "Op locatie",
    totalHours: 3
  },
  {
    id: 36,
    title: "Spraakverstaanbaarheid. Praktisch aan de slag!",
    category: 'Collega',
    description: "Krijg inzicht in hoe je klanken maakt en wat er gebeurt bij een leerling met problemen in de spraakverstaanbaarheid.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 20",
    duration: "2,5 uur (incl. 1 uur voorbereiding)",
    location: "Op locatie",
    totalHours: 2.5
  },
  {
    id: 37,
    title: "Close reading",
    category: 'Collega',
    description: "Werkt jouw school met close reading? Leer welke aspecten passend zijn voor de TOS leerling en hoe je passende doelen stelt.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max. 12 deelnemers",
    duration: "1 bijeenkomst van 1,5 uur",
    location: "Op locatie"
  },
  {
    id: 38,
    title: "Dramadriehoek",
    category: 'Collega',
    description: "Leer in je rol te blijven tijdens gesprekken en niet meegesleept te worden in dynamieken. Herken de dramadriehoek en buig om naar groei.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max. 20 deelnemers",
    duration: "1 bijeenkomst van 1,5 uur",
    location: "Op locatie"
  },
  {
    id: 39,
    title: "De Eigenwijzer",
    category: 'Collega',
    description: "De Eigenwijzer is een praktisch hulpmiddel om met basisschoolkinderen met TOS in gesprek te gaan over wat zij moeilijk vinden en wat helpt.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Max. 20 deelnemers",
    duration: "1 bijeenkomst van 1,5 uur",
    location: "Op locatie"
  },
  {
    id: 40,
    title: "TOS & Woordenschat",
    category: 'Collega',
    description: "Hoe ondersteun je leerlingen met TOS effectief bij woordenschatverwerving? Focus op woordbewustzijn, rijke contexten en herhaling.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 24 deelnemers",
    duration: "1 x 2 uur",
    totalHours: 2
  },
  {
    id: 41,
    title: "Kerndoelen & TOS",
    category: 'Collega',
    description: "Aan de slag met de nieuwe kerndoelen Nederlands en de kansen voor TOS-ondersteuning in het PO.",
    targetAudience: "Ambulant begeleiders",
    maxParticipants: "Maximaal 24 deelnemers",
    duration: "1 bijeenkomst van 2 uur"
  },
  {
    id: 42,
    title: "Spelscripts voor kleuters",
    category: 'Collega',
    description: "Ontdek hoe je met spelscripts het vrij spel van kleuters kunt verdiepen en verrijken zonder het te strak te structureren.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Maximaal 15 deelnemers",
    duration: "1 bijeenkomst van 2 uur"
  },
  {
    id: 43,
    title: "Rijke taal",
    category: 'Collega',
    description: "Scholing over het creëren van een rijke taalomgeving voor leerlingen.",
    targetAudience: "Alle medewerkers"
  },
  {
    id: 44,
    title: "Meeloopdag Martinus van Beekschool of de Taalster",
    category: 'Overig',
    description: "Een kijkje nemen in het SO cluster 2. Wat doet het SO specifiek voor de TOS leerling en hoe verschilt dit van de ambulante begeleiding?",
    targetAudience: "Voor alle medewerkers",
    duration: "1 dagdeel",
    location: "Oss of Nijmegen",
    costs: "Geen kosten",
    totalHours: 4
  },
  {
    id: 45,
    title: "Collegiale consultatie",
    category: 'Overig',
    description: "Bezoek een collega, wees aanwezig bij gesprekken en voer samen een reflectiegesprek. Word gematcht met een gemotiveerde collega.",
    targetAudience: "Alle medewerkers",
    duration: "8 uur (2 dagdelen)",
    location: "Op locatie",
    totalHours: 8
  },
  {
    id: 46,
    title: "Casusbespreking over systemische benadering",
    category: 'Overig',
    description: "Samen casussen bespreken vanuit de systemische benadering. Leer van elkaars aanpak, ook als er geen handelingsverlegenheid is.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Groepjes van maximaal 4 personen",
    duration: "2 momenten van 1,5 uur",
    location: "Online",
    totalHours: 3
  },
  {
    id: 47,
    title: "C&A bespreking",
    category: 'Overig',
    description: "Bekijk C&A verslagen van elkaar en leer van elkaars aanpak. Bespreek handelingsverlegenheid en kom samen verder.",
    targetAudience: "Alle medewerkers",
    maxParticipants: "Groepjes van maximaal 4 personen",
    duration: "3 uur (2 uur online + 1 uur voorbereiding)",
    location: "Online",
    totalHours: 3
  },
  {
    id: 48,
    title: "ICT themabijeenkomsten",
    category: 'Overig',
    description: "Themabijeenkomsten over ICT-toepassingen in de begeleiding.",
    targetAudience: "Alle medewerkers",
    location: "Online"
  },
  {
    id: 49,
    title: "Good Habitz ICT",
    category: 'Overig',
    description: "E-learnings via Good Habitz gericht op ICT vaardigheden.",
    targetAudience: "Alle medewerkers",
    location: "Online"
  },
  {
    id: 50,
    title: "LOWAN congres VO",
    category: 'Congres',
    description: "Congres voor onderwijs aan nieuwkomers in het voortgezet onderwijs.",
    targetAudience: "Voor alle medewerkers",
    duration: "8 uur",
    location: "Ede",
    costs: "Ong. 180 euro"
  },
  {
    id: 51,
    title: "Congres Partners in Verstaan",
    category: 'Congres',
    description: "Jaarlijks congres over horen en verstaan. Focus op de laatste ontwikkelingen en praktijkervaringen.",
    targetAudience: "Voor alle medewerkers",
    duration: "8 uur of 16 uur",
    location: "Apeldoorn",
    costs: "280 euro of 400 euro",
    totalHours: 8
  },
  {
    id: 52,
    title: "LOWAN congres PO",
    category: 'Congres',
    description: "Congres voor onderwijs aan nieuwkomers in het primair onderwijs.",
    targetAudience: "Voor medewerkers PO",
    duration: "8 uur",
    location: "Ede",
    costs: "Ong. 180 euro"
  },
  {
    id: 53,
    title: "Conferentie Naar Inclusiever Onderwijs",
    category: 'Congres',
    description: "Conferentie over de weg naar inclusiever onderwijs. Bij meer interesse wordt er geloot.",
    targetAudience: "Voor alle medewerkers",
    duration: "8 uur",
    location: "Niet bekend",
    costs: "Ong. 260 euro",
    totalHours: 8
  },
  {
    id: 54,
    title: "Kennisdag TOS",
    category: 'Congres',
    description: "Kennisdag over Taalontwikkelingsstoornissen (TOS), verzorgd door Kentalis.",
    targetAudience: "Voor alle medewerkers",
    duration: "8 uur",
    location: "Niet bekend",
    totalHours: 8
  },
  {
    id: 55,
    title: "TOS Centraal Congres",
    category: 'Congres',
    description: "Congres van TOS Centraal over de laatste wetenschappelijke inzichten en praktijktoepassingen rondom TOS.",
    targetAudience: "Voor alle medewerkers",
    duration: "8 uur",
    location: "Niet bekend",
    costs: "Ong. 150 euro",
    totalHours: 8
  },
  {
    id: 56,
    title: "TaalStaal congres: Opgroeien met TOS",
    category: 'Congres',
    description: "Zesde editie van TaalStaal met thema 'OPgroeien met TOS'. Aandacht voor ontwikkelingslijnen in de levensloop van kinderen, adolescenten en volwassenen.",
    targetAudience: "Voor alle medewerkers",
    duration: "8 uur",
    location: "Nieuwegein",
    costs: "280 euro",
    totalHours: 8
  }
];
