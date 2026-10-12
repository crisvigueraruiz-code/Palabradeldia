import { DailyEdition } from '../types.ts';

export const INITIAL_EDITIONS: DailyEdition[] = [
  {
    date: '2026-10-08',
    formattedDate: '8 de Octubre, 2026',
    editionNumber: 1428,
    dominantTheme: 'Reconfiguración de Alianzas y la Carrera por la Soberanía Tecnológica',
    worldTensionIndex: 67,
    summaryLead: 'Las potencias mundiales intensifican su repliegue estratégico hacia cadenas de suministro blindadas, mientras los foros multilaterales buscan consensos urgentes sobre la gobernanza de la computación cuántica y las transiciones hídricas en cuencas transfronterizas.',
    wordOfTheDay: {
      id: 'w-2026-10-08',
      word: 'POLICRISIS',
      phonetic: '[po-li-cri-sis] • /po.liˈkɾi.sis/',
      partOfSpeech: 'Sustantivo femenino invariable',
      etymology: 'Del griego clásico «polýs» (mucho, múltiple) y «krísis» (juicio, ruptura o momento decisivo). Acuñado en los años 1990 por el filósofo francés Edgar Morin y popularizado en el Foro Económico Mundial de Davos.',
      definition: 'Situación en la que múltiples crisis globales (climáticas, bélicas, financieras y tecnológicas) interactúan de forma simultánea, de modo que el impacto conjunto supera con creces la suma de sus partes y anula las respuestas aisladas.',
      whyToday: 'Las deliberaciones simultáneas de esta semana sobre estrés energético en Europa central, volatilidad de divisas en economías emergentes y tensiones en el comercio marítimo del Índico evidencian que los gobiernos ya no afrontan emergencias lineales, sino un entramado de crisis mutuamente reforzadas.',
      globalHeadline: '«La gobernanza mundial entra formalmente en el paradigma de la policrisis», advierte el informe conjunto de organismos multilaterales.',
      contextQuote: '«Quien intente resolver la inflación sin entender las rutas de fertilizantes o la sequía fluvial está combatiendo los síntomas de un organismo bajo policrisis sistémica.»',
      synonyms: ['Crisis en cascada', 'Tormenta sistémica perfecta', 'Intercrisis global'],
      antonyms: ['Estabilidad homeostática', 'Equilibrio sistémico', 'Paz positiva'],
      citizenImpact: 'Para los ciudadanos, la policrisis se manifiesta en la imposibilidad de planificar el coste de vida con recetas tradicionales: el precio del pan se vincula a una sequía en ultramar y la tarifa eléctrica depende de un cuello de botella de chips a miles de kilómetros.',
      category: 'geopolitica',
      academicInsight: 'El historiador Adam Tooze conceptualizó la policrisis no como una simple acumulación de problemas, sino como una falla en la capacidad de los modelos cognitivos estatales para predecir circuitos de retroalimentación.',
      historicalPrecedent: 'El colapso de la Edad del Bronce tardía (circa 1177 a.C.), donde terremotos, hambrunas, invasiones y colapso de rutas comerciales derribaron civilizaciones enteras en el Mediterráneo oriental.',
      cartoonBrief: {
        visualIdea: 'Un ciudadano en la terraza de un bar en Madrid o Sevilla mirando el ticket de un café con leche mientras en la tele del bar dan noticias de guerras de chips, sequía y tipos de interés.',
        charactersOrElements: 'El cliente perplejo, un camarero secando un vaso con un trapo, la cuenta ardiendo sutilmente y un titular de fondo.',
        punchlineOrIrony: '«—Póngame otra caña, Paco, a ver si así amortiguo la inflación del Cáucaso y el estrés hídrico.»',
        setting: 'Terraza de bar castizo español con ventilador o toldo.',
        spainContext: 'La sensación en España de que cualquier tensión al otro lado del globo acaba inexplicablemente encareciendo el aceite de oliva y la cesta de la compra.'
      }
    },
    newsItems: [
      {
        id: 'news-1',
        title: 'Cumbre de Ginebra alcanza el primer marco preliminar para el control de armas cibernéticas y algoritmos ofensivos',
        category: 'geopolitica',
        region: 'Europa',
        country: 'Suiza',
        coordinates: [46.2044, 6.1432],
        summary: 'Delegados de 48 naciones acuerdan establecer zonas de exclusión para infraestructura hospitalaria y redes eléctricas en ciberconflictos.',
        keyPoints: [
          'Compromiso vinculante de no desplegar malware autónomo contra redes de soporte vital civil.',
          'Creación de una Agencia de Verificación Algorítmica con sede en Viena para auditorías cruzadas.',
          'Persisten discrepancias entre las tres mayores superpotencias sobre qué constituye un "vector de ataque preventivo".'
        ],
        whyItMatters: 'Representa el mayor avance diplomático desde los tratados de no proliferación del siglo XX, adaptado a la guerra silenciosa en el ciberespacio.',
        relatedConcept: 'Disuasión digital asimétrica',
        impactScore: 5,
        sources: ['Reuters Global', 'Le Temps', 'Geneva Diplomatic Dispatch'],
        readTimeMinutes: 3,
        detailedAnalysis: 'La reunión a puerta cerrada culminó con una declaración que los diplomáticos califican de histórica. A diferencia de las armas convencionales, el código malicioso carece de firmas físicas, lo que obligó a redactar protocolos basados en trazabilidad de servidores de mando y control.'
      },
      {
        id: 'news-2',
        title: 'Avance en superconductores a temperatura ambiente genera cautela y optimismo en los laboratorios de Kioto',
        category: 'tecnologia',
        region: 'Asia-Pacífico',
        country: 'Japón',
        coordinates: [35.0116, 135.7681],
        summary: 'Científicos del Instituto de Física Aplicada presentan datos replicables de conducción eléctrica sin resistencia a 18°C bajo presiones moderadas.',
        keyPoints: [
          'Material sintetizado a base de hidruros dopados con lantano estructurado en nanotubos.',
          'Tres laboratorios independientes en Seúl, Zúrich y Berkeley inician protocolos de verificación simultánea.',
          'De confirmarse, revolucionaría la transmisión eléctrica mundial, reduciendo pérdidas globales en un 14%.'
        ],
        whyItMatters: 'La superconductividad accesible transformaría trenes de levitación, computación cuántica sin helio líquido y redes eléctricas de escala continental.',
        relatedConcept: 'Salto paradigmático de materiales',
        impactScore: 5,
        sources: ['Nature Materials', 'Nikkei Science', 'Kyoto University Press'],
        readTimeMinutes: 4,
        detailedAnalysis: 'La comunidad científica mantiene una prudencia férrea tras los falsos anuncios de años anteriores. No obstante, las curvas de susceptibilidad magnética presentadas en el simposio muestran el efecto Meissner con una nitidez inédita.'
      },
      {
        id: 'news-3',
        title: 'Los bancos centrales de América Latina consolidan la primera red de liquidación transfronteriza sin dólar',
        category: 'economia',
        region: 'América',
        country: 'Brasil',
        coordinates: [-15.7975, -47.8919],
        summary: 'El mecanismo «Conexión Sur» permite liquidar el 30% del comercio bilateral agroalimentario directamente en monedas locales indexadas a reservas.',
        keyPoints: [
          'Participan inicialmente los bancos centrales de Brasil, Chile, Colombia y Uruguay.',
          'Ahorro estimado en costes de conversión de divisas de 1.800 millones de dólares anuales.',
          'El FMI califica la iniciativa como un experimento pionero en fragmentación monetaria controlada.'
        ],
        whyItMatters: 'Reduce la vulnerabilidad de las economías exportadoras ante los ciclos de endurecimiento monetario de la Reserva Federal estadounidense.',
        relatedConcept: 'Desdolarización selectiva',
        impactScore: 4,
        sources: ['Valor Econômico', 'Financial Times Americas', 'CEPAL Brief'],
        readTimeMinutes: 3,
        detailedAnalysis: 'El sistema emplea una cámara de compensación automatizada basada en contratos inteligentes respaldados por depósitos en los bancos centrales miembros, mitigando el riesgo de balanza de pagos para los pequeños exportadores agrícolas.'
      },
      {
        id: 'news-4',
        title: 'Acuerdo histórico para la preservación de los acuíferos profundos de la Cuenca del Chad',
        category: 'clima',
        region: 'África',
        country: 'Chad',
        coordinates: [12.1348, 15.0557],
        summary: 'Seis países subsaharianos firman un pacto vinculante de recarga y bombeo sostenible para frenar la desertificación acelerada.',
        keyPoints: [
          'Fondo dotado con 4.200 millones de euros financiados por bancos multilaterales de desarrollo.',
          'Instalación de 3.000 sensores satelitales para monitorizar el nivel freático en tiempo real.',
          'Plan de regeneración comunitaria con bosques de acacias y barreras verdes contra el avance del Sahel.'
        ],
        whyItMatters: 'Afecta la seguridad hídrica y alimentaria de más de 40 millones de personas en una de las regiones más vulnerables del planeta.',
        relatedConcept: 'Hidrodiplomacia preventiva',
        impactScore: 4,
        sources: ['African Development Bank', 'Jeune Afrique', 'UN Environment Programme'],
        readTimeMinutes: 3,
        detailedAnalysis: 'La firma en Yamena pone fin a más de una década de litigios sobre los derechos de perforación en formaciones fósiles no renovables, estableciendo cuotas de extracción proporcionales al volumen de recarga pluviométrica.'
      },
      {
        id: 'news-5',
        title: 'Copenhague inaugura el primer museo mundial dedicado a la preservación de lenguas en peligro crítico',
        category: 'sociedad',
        region: 'Europa',
        country: 'Dinamarca',
        coordinates: [55.6761, 12.5683],
        summary: 'El centro alberga un archivo inmersivo sonoro con grabaciones de más de 1.200 lenguas con menos de cien hablantes vivos.',
        keyPoints: [
          'Colaboración directa con comunidades indígenas de la Amazonía, el Ártico y Oceanía.',
          'Modelos de IA acústica entrenados para reconstruir patrones fonéticos antes de su extinción biológica.',
          'Entrada libre y acceso universal a través de una plataforma digital descentralizada.'
        ],
        whyItMatters: 'Cada 14 días muere una lengua en el mundo; el proyecto busca convertir la memoria lingüística en patrimonio vivo y accesible para futuras generaciones.',
        relatedConcept: 'Biocultura y memoria epistémica',
        impactScore: 3,
        sources: ['UNESCO Courier', 'Politiken', 'The Guardian Culture'],
        readTimeMinutes: 2,
        detailedAnalysis: 'Los visitantes pueden sumergirse en domos acústicos que reproducen canciones de cuna, mitos de creación y vocablos botánicos intraducibles, preservando cosmovisiones que desafían el pensamiento hegemónico moderno.'
      }
    ]
  },
  {
    date: '2026-10-07',
    formattedDate: '7 de Octubre, 2026',
    editionNumber: 1427,
    dominantTheme: 'Fracturas Comerciales y la Geografía del Desacople',
    worldTensionIndex: 72,
    summaryLead: 'El replanteamiento de rutas logísticas marítimas y los aranceles sobre tecnologías limpias precipitan un nuevo mapa de comercio bilateral, donde la autosuficiencia desplaza a la eficiencia de costes.',
    wordOfTheDay: {
      id: 'w-2026-10-07',
      word: 'DESACOPLE',
      phonetic: '[de-sa-co-ple] • /de.saˈko.ple/',
      partOfSpeech: 'Sustantivo masculino',
      etymology: 'Del prefijo latino «dis-» (separación) y el verbo romance «acoplar» (del latín «copulare», unir o conectar). Popularizado en la jerga de política exterior anglosajona («decoupling»).',
      definition: 'Proceso de separación o reducción calculada de la interdependencia económica, tecnológica y de infraestructuras entre dos economías o bloques geopolíticos históricamente entrelazados.',
      whyToday: 'El cierre de nuevos acuerdos de producción de semiconductores en suelo norteamericano y las restricciones de tierras raras anunciadas por Beijing marcan un punto de inflexión en la ruptura de la cadena de suministro transpacífica.',
      globalHeadline: '«El desacople ya no es una hipótesis de gabinete, sino la hoja de ruta industrial dominante», señala el Barómetro de Comercio Global.',
      contextQuote: '«Hemos pasado de la era donde la fábrica más barata gobernaba el planeta a la era donde la fábrica más segura determina la soberanía de una nación.»',
      synonyms: ['Desvinculación estratégica', 'Fragmentación de cadenas', 'Segregación económica'],
      antonyms: ['Interdependencia económica', 'Integración simbiótica', 'Apertura comercial irrestricta'],
      citizenImpact: 'Afecta la disponibilidad y el precio de productos tecnológicos cotidianos, acelera la relocalización de fábricas locales y genera nuevos requerimientos laborales en industrias nacionales.',
      category: 'economia',
      academicInsight: 'Analistas del CSIS señalan que el desacople rara vez es total; a menudo se transforma en una "reconexión a través de intermediarios" (friendshoring).',
      historicalPrecedent: 'El bloqueo continental napoleónico de 1806, que buscó aislar comercialmente a Gran Bretaña del resto de la Europa continental.',
      cartoonBrief: {
        visualIdea: 'Un matrimonio en una tienda de electrodomésticos en España intentando comprar una tostadora o una tele y el vendedor les explica que el enchufe viene de Taiwán, el cable de Vietnam y el tornillo está retenido en aduanas.',
        charactersOrElements: 'Pareja con cara de circunstancias, vendedor sudando con un mapa mundi lleno de tachones.',
        punchlineOrIrony: '«—Queríamos solo tostarnos el pan, no desarmar el orden geopolítico bipolar.»',
        setting: 'Tienda de barrio o gran almacén de electrónica.',
        spainContext: 'Cómo la reindustrialización y el desacople hacen que cualquier recambio tarde 4 meses en llegar a tu taller local.'
      }
    },
    newsItems: [
      {
        id: 'news-7-1',
        title: 'Singapur lanza el primer corredor de transporte marítimo 100% libre de emisiones hacia Róterdam',
        category: 'clima',
        region: 'Asia-Pacífico',
        country: 'Singapur',
        coordinates: [1.3521, 103.8198],
        summary: 'Buques propulsados por amoniaco verde y metanol sintético comenzarán a operar en la ruta comercial más transitada de Eurasia.',
        keyPoints: [
          'Alianza entre las autoridades portuarias de Singapur y el puerto holandés de Róterdam.',
          'Subsidios cruzados para garantizar paridad de costes frente al fueloil pesado.',
          'Reducción calculada de 1,2 millones de toneladas de CO₂ en su primer año de vigencia.'
        ],
        whyItMatters: 'Marca la pauta para la descarbonización de un sector marítimo que representa el 3% de las emisiones antropogénicas globales.',
        relatedConcept: 'Corredores verdes de navegación',
        impactScore: 4,
        sources: ['Straits Times', 'Maritime Executive', 'Lloyd’s List'],
        readTimeMinutes: 3
      },
      {
        id: 'news-7-2',
        title: 'La Agencia Espacial Europea aprueba la misión «Helios-Sentinels» para monitorizar tormentas solares',
        category: 'tecnologia',
        region: 'Europa',
        country: 'Alemania',
        coordinates: [50.1109, 8.6821],
        summary: 'Constelación de microsatélites en órbita solar profunda alertará con 72 horas de antelación sobre eyecciones de masa coronal destructivas.',
        keyPoints: [
          'Presupuesto de 850 millones de euros con entrega prevista para 2028.',
          'Blindaje contra apagones que podrían inutilizar satélites GPS y redes de telecomunicaciones.',
          'Participación conjunta de la ESA, NASA y la Agencia Espacial Japonesa (JAXA).'
        ],
        whyItMatters: 'Una tormenta solar de categoría Carrington causaría daños estimados en 2 billones de dólares a la infraestructura tecnológica global.',
        relatedConcept: 'Meteorología espacial y resiliencia de redes',
        impactScore: 4,
        sources: ['ESA Newsroom', 'Aviation Week', 'Frankfurter Allgemeine'],
        readTimeMinutes: 3
      }
    ]
  },
  {
    date: '2026-10-06',
    formattedDate: '6 de Octubre, 2026',
    editionNumber: 1426,
    dominantTheme: 'Soberanía Digital y la Disputa por los Centros de Datos',
    worldTensionIndex: 61,
    summaryLead: 'El crecimiento exponencial de la demanda eléctrica de los clusters de inteligencia artificial choca con las metas climáticas nacionales, obligando a los gobiernos a regular la radicación de centros de cómputo.',
    wordOfTheDay: {
      id: 'w-2026-10-06',
      word: 'SOBERANÍA COMPUTACIONAL',
      phonetic: '[so-be-ra-ní-a com-pu-ta-cio-nal]',
      partOfSpeech: 'Locución sustantiva femenina',
      etymology: 'De «soberanía» (del latín vulgar «superanus», el que tiene autoridad superior) y «computacional» (del latín «computare», contar, calcular juntos).',
      definition: 'Capacidad de un Estado o comunidad política de poseer, regular y operar sus propios centros de datos, microprocesadores de vanguardia y modelos algorítmicos sin depender de infraestructura extranjera.',
      whyToday: 'Tres naciones escandinavas y dos asiáticas aprobaron moratorias sobre nuevos megacentros de datos extranjeros para proteger sus redes eléctricas y exigir que el procesamiento de datos sensibles se mantenga bajo jurisdicción local.',
      globalHeadline: '«Sin servidores propios no hay soberanía nacional»: el nuevo consenso de seguridad en las cancillerías.',
      contextQuote: '«En el siglo XX la soberanía se medía en barriles de petróleo y silos de trigo; en el XXI se mide en gigavatios y teraflops bajo bandera soberana.»',
      synonyms: ['Independencia algorítmica', 'Autonomía de infraestructura de datos', 'Autarquía digital'],
      antonyms: ['Dependencia en la nube transnacional', 'Colonialismo de datos', 'Vulnerabilidad cibernética externa'],
      citizenImpact: 'Determina si la privacidad de los historiales médicos, bancarios y fiscales de los ciudadanos se rige por leyes nacionales o por tribunales de potencias foráneas.',
      category: 'tecnologia',
      academicInsight: 'Investigadores de Oxford definen la soberanía computacional como la última frontera del pacto westfaliano adaptado a la nube.',
      historicalPrecedent: 'La creación de industrias siderúrgicas estatales en la posguerra europea para no depender del carbón y acero foráneo.'
    },
    newsItems: [
      {
        id: 'news-6-1',
        title: 'Los países nórdicos imponen requisitos de reutilización de calor residual a los centros de datos',
        category: 'clima',
        region: 'Europa',
        country: 'Suecia',
        coordinates: [59.3293, 18.0686],
        summary: 'Toda nueva instalación informática de más de 20 megavatios deberá alimentar la calefacción urbana de barrios circundantes.',
        keyPoints: [
          'Reducción esperada del 25% en la factura energética de 400.000 hogares en Estocolmo y Oslo.',
          'Las tecnológicas aceptan el marco a cambio de garantías de suministro eólico renovable.',
          'Modelo estudiado para réplica en Canadá y el norte de Japón.'
        ],
        whyItMatters: 'Integra la revolución de los datos en la economía circular urbana en lugar de ser un parásito del consumo eléctrico.',
        relatedConcept: 'Termocombustión digital y calefacción comunitaria',
        impactScore: 4,
        sources: ['Dagens Nyheter', 'Bloomberg Green', 'Nordic Energy Research'],
        readTimeMinutes: 3
      }
    ]
  }
];
