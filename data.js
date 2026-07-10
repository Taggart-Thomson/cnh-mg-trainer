/* ============================================================================
   DETRAN-MG CNH THEORY TRAINER — CONTENT BANK v3
   ----------------------------------------------------------------------------
   LANGUAGE SPLIT (per user request):
     examPool      -> Portuguese, verbatim from the Auto Clique book. The ONLY
                      pool the exam and practice tests draw from, so you always
                      train in the exam's real language.
     studyExamples -> English learning versions, shown ONLY in the study/lesson
                      flow as bilingual worked examples, never in a scored test.

   VERIFICATION: examPool answers were assigned from the CTB and the book's own
   study pages (the book ships no answer key). gab = assigned answer letter.
   v:false = not yet confirmed against Auto Clique's correction video.
   conf:"check" = verify these first when a chave de acesso is obtained.
   ========================================================================== */

(function(){

const VOCAB = {
  proibido: { pt: "Proibido", en: "Prohibited / forbidden", note: "If you see this, the answer is about what you must NOT do." },
  obrigatorio: { pt: "Obrigatório", en: "Mandatory / required", note: "Signals something you MUST do." },
  permitido: { pt: "Permitido", en: "Allowed / permitted", note: "Something you MAY do." },
  exceto: { pt: "Exceto", en: "Except", note: "Flips the question. The answer is the ODD ONE OUT." },
  salvo: { pt: "Salvo", en: "Except / unless", note: "Legal-text cousin of exceto: 'salvo risco iminente' = unless there is imminent danger." },
  vedado: { pt: "Vedado", en: "Forbidden (formal)", note: "Same as proibido, used in legal text." },
  conforme: { pt: "Conforme", en: "According to / as per", note: "'Conforme o manual' = as the manual says. Points at the official rule." },
  incorreta: { pt: "Incorreta", en: "Incorrect", note: "'Assinale a alternativa incorreta' = pick the FALSE statement. Easy to miss under time pressure." },
  preferencia: { pt: "Preferência", en: "Right of way / priority", note: "Who goes first at a crossing." },
  velocidade: { pt: "Velocidade", en: "Speed", note: "velocidade máxima = maximum speed." },
  ultrapassagem: { pt: "Ultrapassagem", en: "Overtaking / passing", note: "Passing another vehicle." },
  faixa: { pt: "Faixa", en: "Lane / stripe / crosswalk", note: "faixa de pedestres = pedestrian crossing." },
  pedestre: { pt: "Pedestre", en: "Pedestrian", note: "Person on foot; they often have priority." },
  conversao: { pt: "Conversão", en: "Turn (change of direction)", note: "Official CTB definition: an angled left or right movement changing the vehicle's original direction." },
  sentido: { pt: "Sentido", en: "Direction of travel", note: "sentido único = one way. Sentidos opostos = opposite directions." },
  via: { pt: "Via", en: "Road / way", note: "The road itself. Urban types: trânsito rápido, arterial, coletora, local." },
  condutor: { pt: "Condutor", en: "Driver", note: "The person driving; 'you' in most questions." },
  infracao: { pt: "Infração", en: "Infraction / violation", note: "Graded leve, média, grave, gravíssima." },
  penalidade: { pt: "Penalidade", en: "Penalty", note: "The consequence: fine, points, suspension." },
  multa: { pt: "Multa", en: "Fine", note: "The monetary penalty." },
  suspensao: { pt: "Suspensão", en: "Suspension", note: "suspensão do direito de dirigir = losing your right to drive for a period." },
  recolhimento: { pt: "Recolhimento", en: "Collection / seizure (of a document)", note: "recolhimento da CNH = your licence document is taken by the authority." },
  regulamentacao: { pt: "Regulamentação", en: "Regulatory sign", note: "An order you must obey. Round with red border. R-codes (R-1 = PARE)." },
  advertencia: { pt: "Advertência", en: "Warning sign", note: "Yellow diamond. Warns of a hazard ahead. A-codes." },
  indicacao: { pt: "Indicação", en: "Information sign", note: "Usually blue/green. Guides and informs. SAU-codes mark services." },
  acostamento: { pt: "Acostamento", en: "Road shoulder", note: "For emergency stops, pedestrians and bicycles. Overtaking on it is gravíssima." },
  cruzamento: { pt: "Cruzamento", en: "Intersection", note: "Official definition: where two roads cross at the same level." },
  passeio: { pt: "Passeio", en: "Sidewalk (pedestrian part)", note: "The part of the calçada reserved for pedestrians." },
  aquaplanagem: { pt: "Aquaplanagem", en: "Aquaplaning / hydroplaning", note: "Tyres lose contact with the road because of water. Worn tyres make it worse." },
  habilitacao: { pt: "Habilitação", en: "Driver licensing", note: "CNH = the licence. PPD = the 1-year provisional permit." },
  parada: { pt: "Parada", en: "Stop (brief)", note: "Immobilised only long enough to pick up or drop off people. Longer = estacionamento." },
  farol: { pt: "Farol", en: "Headlight", note: "farol baixo = low beam; farol alto = high beam. Motorcycles: headlight on day AND night." },
  freio: { pt: "Freio", en: "Brake", note: "freio motor = engine braking, used on long descents." },
  pneu: { pt: "Pneu", en: "Tyre", note: "Tyres propel, brake and steer the car. Balance them when the steering wheel vibrates." },
  cinto: { pt: "Cinto de segurança", en: "Seatbelt", note: "Mandatory for all occupants." },
  socorro: { pt: "Primeiros socorros", en: "First aid", note: "What to do at a crash scene." },
  sinalizar: { pt: "Sinalizar", en: "To signal / secure the area", note: "First step at a crash: make the scene safe so there is no second crash." },
  vitima: { pt: "Vítima", en: "Victim / casualty", note: "Don't move a vítima unless there is imminent danger (salvo risco iminente)." },
  coluna: { pt: "Coluna", en: "Spine", note: "lesão na coluna = spinal injury: unable to move arms and legs. Immobilise with colar cervical." },
  poluicao: { pt: "Poluição", en: "Pollution", note: "Air (CO2, chuva ácida, respiratory illness) and noise (buzina, escapamento)." },
};

const MODULES = [
  {
    id: "legislacao",
    title: "Legislação de Trânsito",
    subtitle: "The law: licences, documents, infractions",
    color: "red",
    vocab: ["infracao", "penalidade", "multa", "suspensao", "recolhimento", "habilitacao", "via", "parada", "condutor", "preferencia"],
    teach: [
      { c: "The infraction ladder", t: "Every infração has a class and a points value on your CNH: gravíssima 7 points (multa R$ 293,47), grave 5 points (R$ 195,23), média 4 points (R$ 130,16), leve 3 points (R$ 88,38). Questions constantly ask which class an act falls into. Overtaking on the acostamento is the classic gravíssima example." },
      { c: "Suspension by points", t: "Suspensão do direito de dirigir happens at 20 points if you have 2 or more gravíssimas in 12 months, at 30 points with exactly 1 gravíssima, and at 40 points with none. The three-tier rule is heavily tested." },
      { c: "Your licence timeline", t: "The PPD (Permissão Para Dirigir) is the 1-year provisional permit, from age 18. Renewal of the exame de aptidão física e mental: every 10 years under age 50, every 5 years from 50 to 69, every 3 years from 70. Paying a fine by the due date without SNE membership: 80% of the value (20% discount)." },
      { c: "Who runs the system", t: "CONTRAN is the órgão máximo NORMATIVO (top rule-making body) of the Sistema Nacional de Trânsito, under the Ministério dos Transportes. The state DETRAN registers and licenses vehicles. The CRLV is the annual licensing document; it can be collected (recolhido) if a vehicle retention cannot be fixed on the spot." },
      { c: "Roads and their speeds", t: "Vias urbanas: via de trânsito rápido (80 km/h unsigned), arterial (60), coletora (40), local (30). Coletoras collect and distribute traffic toward the faster roads. Vias rurais: rodovias and estradas. Parada = stopping only to load or unload people; anything longer is estacionamento." },
      { c: "Circulation rules the exam loves", t: "Stop before crossing a railway line and before entering a road with priority. Right-side overtaking is allowed only when the vehicle ahead signals a LEFT turn on a one-way street. Slower vehicles in a line keep distance so others can slot in. Animal-drawn vehicles use the rightmost lane. A vehicle making a conversão loses priority; between two vehicles at an unsigned crossing, the one on the RIGHT goes first. On rodovias with no return point, wait on the right shoulder." },
    ],
    // Portuguese, verbatim — drives exam + practice
    examPool: [
      { q: "Motocicleta é um veículo automotor de duas rodas, com ou sem side-car, dirigido por condutor:", options: ["Da categoria “B”.", "Da categoria “ACC”.", "Em posição montada.", "Em posição sentada."], answer: 2, gab: "c", why: "The CTB definition of motocicleta specifies the rider is astride (em posição montada). Sitting position defines a motoneta.", src: "AC-S01-Q1", v: false },
      { q: "Para transitar nas vias públicas, o veículo deverá ser _________ junto ao órgão executivo de trânsito.", options: ["Licenciado.", "Vistoriado.", "Autorizado.", "Liberado."], answer: 0, gab: "a", why: "Vehicles must be licensed (licenciado) annually with the state traffic authority.", src: "AC-S01-Q2", v: false },
      { q: "O uso do farol baixo é:", options: ["Obrigatório para motocicletas, motonetas e ciclomotores durante o dia e a noite.", "Recomendado para ônibus, durante o dia, se estiver em faixa exclusiva.", "Obrigatório para automóveis, em qualquer via, mesmo durante o dia.", "Recomendado para ciclomotores durante o dia."], answer: 0, gab: "a", why: "Motorcycles must ride with the headlight on day and night. For cars, daytime low beam is required on rodovias, not every via.", hint: "obrigatório", src: "AC-S01-Q3", v: false },
      { q: "Os proprietários de veículos que não aderiram ao SNE, poderão efetuar o pagamento da multa até a data do vencimento, da seguinte forma:", options: ["Por 90% do seu valor.", "Pelo valor integral.", "Por 80% do seu valor.", "Pela metade do valor integral."], answer: 2, gab: "c", why: "Paying by the due date gives a 20% discount, so you pay 80%. The SNE system raises the discount to 40%.", hint: "multa", src: "AC-S01-Q4", v: false },
      { q: "Ultrapassar outro veículo pelo acostamento, cruzamentos ou passagens de nível, é uma infração de que natureza?", options: ["Grave – Cinco pontos.", "Leve – Três pontos.", "Gravíssima – Sete pontos.", "Média – Cinco pontos."], answer: 2, gab: "c", why: "Overtaking on the shoulder, at crossings or at level crossings is gravíssima: 7 points.", hint: "acostamento", src: "AC-S01-Q5", v: false },
      { q: "Os sinais luminosos de regulamentação têm a função de:", options: ["Regulamentar as manobras.", "Controlar e orientar fluxos de veículos e pedestres.", "Controlar fluxo de veículos e orientar os motoristas e motociclistas.", "Controlar fluxo de pedestres e alertar nas ultrapassagens."], answer: 1, gab: "b", why: "Traffic lights control and guide the flows of BOTH vehicles and pedestrians.", src: "AC-S01-Q6", v: false },
      { q: "Os veículos mais lentos, quando em fila, deverão circular:", options: ["Mantendo a velocidade.", "Mantendo a distância entre eles.", "Aumentando a velocidade.", "Sempre pela esquerda."], answer: 1, gab: "b", why: "Slower vehicles in a line keep enough distance between them so overtaking vehicles can slot back in safely (CTB Art. 31).", src: "AC-S01-Q7", v: false },
      { q: "Manter o veículo imobilizado apenas pelo tempo necessário para embarque e desembarque de pessoas, caracteriza-se como:", options: ["Parada para carga e descarga.", "Parada.", "Estacionamento para carga e descarga.", "Estacionamento."], answer: 1, gab: "b", why: "Immobilised only long enough for people to get in or out = parada. Anything beyond that is estacionamento.", hint: "parada", src: "AC-S01-Q8", v: false },
      { q: "O Ministério _________ é o coordenador máximo do Sistema Nacional de Trânsito.", options: ["Das Cidades.", "Dos Transportes.", "Do Planejamento.", "Da Infra-estrutura."], answer: 1, gab: "b", why: "The SNT sits under the Ministério dos Transportes (home of SENATRAN).", src: "AC-S01-Q9", v: false },
      { q: "As características de um veículo podem ser modificadas quando:", options: ["O infrator não houver completado 20 pontos.", "Houver prévia autorização da autoridade de trânsito.", "Sempre que for envolvido em sinistro de trânsito.", "O proprietário simplesmente quitar seus débitos com o órgão competente."], answer: 1, gab: "b", why: "Modifying a vehicle's characteristics requires PRIOR authorization from the traffic authority.", src: "AC-S01-Q10", v: false },
      { q: "A velocidade máxima permitida em uma via coletora sem sinalização é de:", options: ["30 km/hora.", "40 km/hora.", "50 km/hora.", "60 km/hora."], answer: 1, gab: "b", why: "Unsigned defaults (CTB Art. 61): trânsito rápido 80, arterial 60, coletora 40, local 30.", hint: "velocidade", src: "AC-S01-Q11", v: false },
      { q: "De quem é a preferência de passagem? (Desenho: o veículo 1 segue em linha reta pela via; o veículo 2 chega ao cruzamento pela via à direita do veículo 1.)", options: ["Do veículo 1, pois trafega em linha reta.", "Do veículo 2, pois está à direita do veículo 1.", "Do veículo 1, pois está à direita do veículo 2.", "Do veículo 2, pois trafega em preferencial."], answer: 1, gab: "b", why: "At an unsigned crossing, priority belongs to the vehicle approaching from the right.", hint: "preferência", src: "AC-S01-Q12", v: false },
      { q: "Ocorre o recolhimento da CNH, quando o condutor:", options: ["Estacionar em local proibido pela sinalização.", "Estacionar sobre a faixa de pedestre.", "Transpor bloqueio policial, sem autorização.", "Dirigir sem utilizar o cinto de segurança."], answer: 2, gab: "c", why: "Forcing through a police blockade is gravíssima and triggers collection of the licence document.", hint: "recolhimento", src: "AC-S02-Q1", v: false },
      { q: "O órgão máximo normativo do Sistema Nacional de Trânsito é:", options: ["A Secretaria Nacional de Trânsito – SENATRAN.", "O Conselho Nacional de Trânsito – CONTRAN.", "O Ministério da Justiça.", "O Departamento Estadual de Trânsito – DETRAN."], answer: 1, gab: "b", why: "CONTRAN is the top NORMATIVE (rule-making) body. SENATRAN is the top executive body. Watch the adjective.", src: "AC-S02-Q2", v: false },
      { q: "O recolhimento do Certificado de Licenciamento Anual poderá ocorrer quando:", options: ["Dirigir veículo com Carteira Nacional de Habilitação ou Permissão para dirigir vencida há mais de 30 dias.", "Usar o veículo para arremessar, sobre os pedestres ou veículos, água ou detritos.", "Estacionar no passeio ou sobre faixa destinada a pedestre.", "No caso de retenção do veículo, se a irregularidade não puder ser sanada no local."], answer: 3, gab: "d", why: "When a retained vehicle's irregularity cannot be fixed on the spot, the CRLV is collected.", hint: "recolhimento", src: "AC-S02-Q3", v: false },
      { q: "Quando da renovação da CNH o condutor de veículo automotor deverá ser submetido ao exame de aptidão física e mental, nos seguintes períodos:", options: ["De 5 em 5 anos, para condutores entre 50 e 69 anos de idade.", "De 10 em 10 anos, até os 50 anos de idade.", "De 5 em 5 anos, após os 70 anos de idade.", "De 3 em 3 anos, após os 50 anos de idade."], answer: 0, gab: "a", why: "The precise tier is 5 years for ages 50 to 69. Under 50 is 10 years, 70 and over is 3 years.", src: "AC-S02-Q4", v: false },
      { q: "O condutor poderá ultrapassar outro veículo pela direita quando:", options: ["O veículo da frente autorizar.", "A via de mão única com entrada a esquerda e o condutor do veículo a ser ultrapassado indicar, por sinal, que vai entrar para esse lado.", "A via for de mão única com retorno ou entrada à direita e o condutor do veículo que estiver à direita indicar, por sinal, que vai entrar para esse lado.", "A via for de mão dupla com retorno ou entrada à esquerda e apenas uma faixa de trânsito."], answer: 1, gab: "b", why: "Passing on the right is legal only when the vehicle ahead has clearly signalled it will turn LEFT.", hint: "ultrapassagem", src: "AC-S02-Q5", v: false },
      { q: "Onde não houver sinalização regulamentadora, a velocidade máxima nas vias locais será de:", options: ["30 km/h.", "20 km/h.", "50 km/h.", "40 km/h."], answer: 0, gab: "a", why: "Local roads default to 30 km/h when unsigned.", hint: "velocidade", src: "AC-S02-Q6", v: false },
      { q: "Assinale a alternativa correta:", options: ["Todo veículo poderá retornar em qualquer local, nas vias urbanas, desde que facilite o trânsito para os outros veículos.", "A circulação pelo acostamento das rodovias é permitida em situações de congestionamento.", "Todo condutor deve dar preferência aos pedestres apenas quando estes se encontram sobre faixa de segurança.", "É dever do condutor parar o seu veículo antes de transpor linha férrea ou entrar em via com preferência de passagem."], answer: 3, gab: "d", why: "You must stop before crossing a railway line or entering a priority road. The other three are all violations dressed up as permissions.", src: "AC-S02-Q7", v: false },
      { q: "Nas rodovias, onde não houver local apropriado para a operação de retorno, o condutor deverá parar veículo:", options: ["Junto ao eixo central.", "No acostamento à direita da via.", "No centro da via.", "No acostamento da esquerda da via."], answer: 1, gab: "b", why: "Wait on the RIGHT shoulder for a safe gap; never stage a U-turn from the centre of the road.", hint: "acostamento", src: "AC-S02-Q8", v: false },
      { q: "A importância e o objetivo da sinalização estão em informar aos usuários da via sobre:", options: ["Condições da via, restrições impostas ao trânsito e obrigações e proibições no uso da via.", "A situação do trânsito.", "A condição do veículo.", "A proibição de cometer atos de imprudência."], answer: 0, gab: "a", why: "Signage exists to inform about road conditions, restrictions, obligations and prohibitions.", src: "AC-S02-Q9", v: false },
      { q: "Quando inexistir uma faixa especial, um veículo de tração animal deverá ocupar:", options: ["A faixa mais à esquerda da pista de rolamento.", "A faixa mais à direita da pista de rolamento.", "Qualquer faixa, desde que facilite o trânsito.", "A faixa da direita ou da esquerda, dependendo da categoria do veículo."], answer: 1, gab: "b", why: "Animal-drawn vehicles keep to the rightmost lane when there is no special lane.", src: "AC-S02-Q10", v: false },
      { q: "Segundo a classificação do Código de Trânsito Brasileiro, vias coletoras são aquelas:", options: ["Que a sinalização de trânsito indica como tais.", "Que se destinam apenas ao acesso às áreas restritas.", "Bloqueadas ao trânsito local, sem cruzamentos, com entradas e saídas especiais e que permitem trânsito livre.", "Que geram ou coletam trânsito para as vias preferenciais ou de trânsito rápido."], answer: 3, gab: "d", why: "Coletoras collect and distribute traffic toward the arterial and rapid-transit roads.", hint: "via", src: "AC-S02-Q11", v: false },
      { q: "De acordo com o desenho, marque a resposta correta: (Desenho: o veículo 1 faz uma conversão à esquerda, cruzando a trajetória do veículo 2, que segue em linha reta.)", options: ["O veículo 1 perde a preferência por fazer uma conversão à esquerda.", "O veículo 2 tem a preferência por trafegar na principal.", "O veículo 1 tem a preferência por trafegar à direita do 2.", "O veículo 2 tem a preferência por trafegar em linha reta."], answer: 0, gab: "a", why: "A vehicle making a left conversão gives way; the key phrases it as vehicle 1 LOSING priority by turning.", hint: "conversão", src: "AC-S02-Q12", v: false },
    ],
    // English learning versions — study cards only
    studyExamples: [
      { q: "Numa rotatória (roundabout), quem tem preferência?", options: ["Vehicles already circulating in the roundabout", "Vehicles entering the roundabout", "The larger vehicle", "The faster vehicle"], answer: 0, why: "Traffic already in the roundabout has right of way.", hint: "preferência", src: "curated", v: true },
      { q: "Ao fazer uma conversão, o condutor deve dar preferência:", options: ["To pedestrians crossing the road he is entering", "To no one, since he is turning", "Only to larger vehicles", "To vehicles behind him"], answer: 0, why: "When turning, yield to pedestrians crossing your path.", hint: "conversão", src: "curated", v: true },
      { q: "Em um cruzamento sem sinalização, geralmente tem preferência o veículo que vem:", options: ["From the right", "From the left", "From behind", "Downhill"], answer: 0, why: "With no signs, yield to the vehicle on your right.", src: "curated", v: true },
      { q: "Um pedestre atravessando na faixa de pedestres tem:", options: ["Priority over vehicles", "No priority", "Priority only at night", "Priority only if elderly"], answer: 0, why: "Pedestrians on the crossing have priority.", hint: "faixa de pedestres", src: "curated", v: true },
      { q: "Veículos sobre trilhos em relação aos demais:", options: ["Have priority", "Must always yield", "Have no special rule", "Yield only to buses"], answer: 0, why: "Rail vehicles have priority over other traffic.", src: "curated", v: true },
      { q: "Ambulância com sirene e luz vermelha ligada: os demais condutores devem:", options: ["Pull over and give way", "Speed up to clear the road", "Ignore it if in a hurry", "Follow closely behind it"], answer: 0, why: "Emergency vehicles in service have absolute priority; give way.", src: "curated", v: true },
      { q: "Ao sair de uma garagem ou estacionamento para a via, o condutor:", options: ["Must yield to vehicles and pedestrians already on the way", "Has priority over the road traffic", "Should accelerate to merge quickly", "Need not signal"], answer: 0, why: "Entering the flow from a driveway, you yield to those already there.", src: "curated", v: true },
      { q: "Numa via preferencial, o condutor:", options: ["Has right of way over crossing roads", "Must always stop at every corner", "Yields to all side streets", "Has no special status"], answer: 0, why: "A via preferencial gives priority over crossing streets.", hint: "preferência", src: "curated", v: true },
      { q: "Quando o semáforo está verde mas há pedestres ainda terminando a travessia, o condutor:", options: ["Waits until they finish crossing", "Advances immediately", "Honks to hurry them", "Drives around them"], answer: 0, why: "Even on green, you must let pedestrians finish crossing safely.", src: "curated", v: true },
      { q: "Numa via urbana local, sem sinalização de velocidade, a máxima é:", options: ["30 km/h", "60 km/h", "80 km/h", "110 km/h"], answer: 0, why: "Local urban roads default to 30 km/h when unsigned.", hint: "velocidade máxima", src: "curated", v: true },
      { q: "Numa via arterial urbana sem placa, a velocidade máxima é:", options: ["60 km/h", "30 km/h", "80 km/h", "100 km/h"], answer: 0, why: "Urban arterial default is 60 km/h (CTB Art. 61). Corrected against the official key: only vias de trânsito rápido default to 80.", src: "curated", v: true },
      { q: "Numa via coletora urbana sem sinalização, a velocidade máxima é:", options: ["40 km/h", "60 km/h", "80 km/h", "30 km/h"], answer: 0, why: "Collector roads default to 40 km/h (CTB Art. 61). Corrected against the official key.", src: "curated", v: true },
      { q: "A ultrapassagem deve ser feita, em regra, pela:", options: ["Left side", "Right side", "Either side", "Shoulder"], answer: 0, why: "Overtake on the left; the right only in specific legal exceptions.", hint: "ultrapassagem", src: "curated", v: true },
      { q: "É proibido ultrapassar:", options: ["On curves, bridges and crests", "On straight clear roads", "During daytime", "When the road is empty"], answer: 0, why: "Overtaking is forbidden where visibility is limited.", hint: "proibido", src: "curated", v: true },
      { q: "O excesso de velocidade em mais de 50% do limite é infração:", options: ["Gravíssima (most severe)", "Leve (mild)", "Média (medium)", "Not an infraction"], answer: 0, why: "More than 50% over the limit is gravíssima.", src: "curated", v: true },
      { q: "O uso do cinto de segurança é:", options: ["Mandatory for all occupants", "Optional for back seats", "Only for the driver", "Required only on highways"], answer: 0, why: "Seatbelts are mandatory for every occupant.", hint: "obrigatório", src: "curated", v: true },
      { q: "Recusar o teste do bafômetro:", options: ["Carries the same penalty as testing positive", "Has no consequence", "Is a mild infraction", "Is encouraged"], answer: 0, why: "Refusal is penalised as heavily as a positive test.", src: "curated", v: true },
      { q: "Manusear o celular enquanto dirige é infração:", options: ["Gravíssima (very severe)", "Leve (mild)", "Not an infraction", "Média only"], answer: 0, why: "Handling a phone while driving is gravíssima.", src: "curated", v: true },
      { q: "Documentos obrigatórios para dirigir incluem:", options: ["CNH and the vehicle's CRLV", "Only a photo ID", "Just the CNH", "A birth certificate"], answer: 0, why: "Carry your CNH and the vehicle's CRLV.", src: "curated", v: true },
      { q: "A CNH na categoria B permite dirigir:", options: ["Cars up to 3.500 kg and up to 8 passengers", "Motorcycles", "Buses", "Heavy trucks over 6.000 kg"], answer: 0, why: "Category B: standard cars up to 3.5 t, 8 passengers plus driver.", src: "curated", v: true },
      { q: "Transportar uma criança pequena no banco da frente é:", options: ["Prohibited (children go in the back with a restraint)", "Allowed always", "Allowed if she wears a belt", "Allowed on short trips"], answer: 0, why: "Young children ride in the back with an appropriate restraint.", src: "curated", v: true },
      { q: "Parar sobre a faixa de pedestres ao aguardar o semáforo é:", options: ["An infraction, you block the crossing", "Permitted", "Recommended", "Only wrong at night"], answer: 0, why: "Stopping on the crosswalk obstructs pedestrians.", hint: "faixa de pedestres", src: "curated", v: true },
      { q: "Usar o pisca-alerta é correto quando:", options: ["The vehicle is stopped in an emergency", "Driving in the rain normally", "Parking legally", "Overtaking"], answer: 0, why: "Hazard lights signal an emergency stop or immobilised vehicle.", src: "curated", v: true },
      { q: "O farol baixo deve ser usado obrigatoriamente:", options: ["In tunnels and at night", "Only when it rains", "Never during the day", "Only on dirt roads"], answer: 0, why: "Low beams are required in tunnels, at night, and on rodovias by day.", hint: "farol baixo", src: "curated", v: true },
    ],
  },
  {
    id: "sinalizacao",
    title: "Sinalização",
    subtitle: "Signs, road marks, signals & gestures",
    color: "yellow",
    vocab: ["regulamentacao", "advertencia", "indicacao", "proibido", "faixa", "sentido"],
    teach: [
      { c: "Three sign families, three shapes", t: "Regulamentação: round with a red border, an ORDER (R-codes: R-1 PARE octagon, R-2 Dê a preferência inverted triangle, R-10 no motor vehicles, R-16 maximum width, R-28 two-way traffic). Advertência: yellow diamond, a HAZARD ahead (A-codes: A-42a start of divided road). Indicação/Serviços: blue squares that guide (SAU-codes: SAU-26 bus stop). Colour and shape answer many questions before you read a word." },
      { c: "The hierarchy of authority", t: "When orders conflict: agente de trânsito (officer's gestures and whistle) beats semáforo, which beats placas, which beat marcas no solo. The book's whistle table: dois silvos breves = order to proceed. Warning semaphores are one or two YELLOW lights, unlike the three-colour regulation semaphore." },
      { c: "Yellow vs white lines", t: "Yellow road marks regulate OPPOSITE flows (sentidos opostos); white separates same-direction lanes. A continuous white line means lane changes and transpositions are prohibited on that stretch. Tachas and tachões (raised markers) improve perception and physically separate lanes." },
      { c: "Reading R-signs with numbers", t: "A number inside a red-bordered circle is a LIMIT: R-16 with '3,0 m' between horizontal arrows limits WIDTH (largura); the vertical-arrow version (R-15) limits height. The exam tests whether you can tell which dimension the arrows point at." },
    ],
    // Portuguese, verbatim — drives exam + practice
    examPool: [
      { q: "A placa SAU-26 (quadrado azul com o pictograma de um ônibus) indica:", options: ["Terminal ferroviário.", "Ponto de parada.", "Pedágio.", "Terminal rodoviário."], answer: 1, gab: "b", why: "SAU-26 marks a bus stop (ponto de parada).", hint: "indicação", src: "AC-S01-Q13", v: false },
      { q: "A sinalização semafórica de advertência é composta de:", options: ["Duas luzes dispostas na sequência de cores verde e amarela.", "Três luzes dispostas na sequência de cores verde, amarela e vermelha.", "Uma ou duas luzes de cor amarelas.", "Duas luzes dispostas na sequência de cores verde e vermelha."], answer: 2, gab: "c", why: "Warning semaphores are one or two YELLOW lights. Three colours make a regulation semaphore.", hint: "advertência", src: "AC-S01-Q14", v: false },
      { q: "As divisões de fluxos feitas por faixas brancas contínuas indicam ao condutor que:", options: ["Ficam proibidas as ultrapassagens pelo acostamento.", "É permitido realizar transposições apenas para entrar à esquerda.", "As mudanças de faixa e as transposições são proibidas nesse trecho.", "As ultrapassagens são permitidas apenas se forem realizadas pela esquerda."], answer: 2, gab: "c", why: "Continuous white lines: no lane changes or transpositions on that stretch.", src: "AC-S01-Q15", v: false },
      { q: "De acordo com a sinalização sonora feita pelo agente de trânsito, qual afirmativa está correta?", options: ["Dois silvos breves para ordem de seguir.", "Um silvo longo para diminuir a velocidade.", "Um silvo breve para ordem de parada.", "Um silvo breve e um longo para parada ortogonal."], answer: 0, gab: "a", why: "Per the book's whistle table: two short whistles mean proceed.", src: "AC-S01-Q16", v: false },
      { q: "A placa R-10 (círculo com borda vermelha e um automóvel ao centro) proíbe:", options: ["Trânsito de automóveis na área abrangida pela placa.", "Trânsito de veículos automotores na área sinalizada.", "Trânsito de veículos de quatro rodas, na área abrangida pela placa.", "Trânsito de carros de passeio com até mil cilindradas."], answer: 1, gab: "b", why: "R-10 bans ALL motor vehicles in the signed area, not just cars.", hint: "proibido", src: "AC-S01-Q17", v: false },
      { q: "O formato da sinalização vertical circular com orla vermelha se refere a que grupo?", options: ["De advertência.", "De indicação.", "De regulamentação.", "De informações complementares."], answer: 2, gab: "c", why: "Round with a red border = regulatory. That shape IS the order.", hint: "regulamentação", src: "AC-S01-Q18", v: false },
      { q: "A placa de forma triangular é característica da sinalização de:", options: ["Sentido proibido.", "Dê a preferência.", "Parada obrigatória.", "Proibido estacionar."], answer: 1, gab: "b", why: "The (inverted) triangle is unique to Dê a preferência (R-2).", hint: "preferência", src: "AC-S02-Q13", v: false },
      { q: "Diante da placa R-16 (círculo com borda vermelha e a indicação ‘3,0 m’ entre setas horizontais), você entende que aqui só é permitido circulação de veículos com:", options: ["Altura até o limite indicado na placa.", "Largura até o limite indicado na placa.", "Peso por eixo até o limite indicado na placa.", "Comprimento até o limite indicado."], answer: 1, gab: "b", why: "Horizontal arrows around the number = WIDTH limit (R-16). Vertical arrows would be height (R-15).", src: "AC-S02-Q14", v: false },
      { q: "Na sinalização horizontal a cor utilizada para a regulação de fluxos de sentidos opostos, é:", options: ["Amarela.", "Branca.", "Azul.", "Preta."], answer: 0, gab: "a", why: "Yellow regulates opposing flows; white separates same-direction lanes.", hint: "sentidos opostos", src: "AC-S02-Q15", v: false },
      { q: "A placa A-42a (losango amarelo com setas indicando divisão da pista) adverte o condutor da existência adiante de:", options: ["Início de pista dupla.", "Fim de pista dupla.", "Mão dupla adiante.", "Pista irregular."], answer: 0, gab: "a", why: "A-42a warns the divided road (pista dupla) is STARTING. A-42b is the end.", hint: "advertência", src: "AC-S02-Q16", v: false },
      { q: "Diante da placa R-28 (círculo com borda vermelha e duas setas verticais em sentidos opostos), você entende que:", options: ["É proibido realizar a operação de ultrapassagem no trecho regulamentado.", "Os ônibus e caminhões devem usar, obrigatoriamente, a faixa da direita.", "É permitido o tráfego nos dois sentidos.", "É proibido mudar de faixa de rolamento."], answer: 2, gab: "c", why: "R-28 regulates two-way circulation: traffic flows in both directions.", src: "AC-S02-Q17", v: false },
      { q: "Melhoram a percepção do condutor e separam as faixas de trânsito:", options: ["As marcas transversais.", "Faixas contínuas.", "As taxas e os tachões.", "Todas as afirmativas acima."], answer: 2, gab: "c", why: "Tachas and tachões (raised pavement markers) both improve perception and physically separate lanes.", src: "AC-S02-Q18", v: false },
    ],
    // English learning versions — study cards only
    studyExamples: [
      { q: "A placa de 'Regulamentação' tem qual função?", options: ["Give an order the driver must obey", "Warn of a hazard ahead", "Indicate a tourist attraction", "Show the distance to a city"], answer: 0, why: "Regulatory signs impose an obligation or prohibition.", hint: "regulamentação", src: "curated", v: true },
      { q: "Uma placa amarela em formato de losango é do tipo:", options: ["Advertência (warning)", "Regulamentação (regulatory)", "Indicação (information)", "Educativa (educational)"], answer: 0, why: "Yellow diamond signs warn of a hazard ahead.", hint: "advertência", src: "curated", v: true },
      { q: "O que significa uma placa circular vermelha com 'PROIBIDO ESTACIONAR'?", options: ["Parking is forbidden here", "Parking is mandatory here", "Parking is allowed only at night", "A parking lot is ahead"], answer: 0, why: "Proibido estacionar = no parking.", hint: "proibido", src: "curated", v: true },
      { q: "Placas de 'Indicação' geralmente servem para:", options: ["Guide and inform the driver", "Order the driver to stop", "Forbid a manoeuvre", "Warn of an accident"], answer: 0, why: "Information signs guide (directions, services, distances).", src: "curated", v: true },
      { q: "Uma placa azul circular com uma seta indicando 'SIGA EM FRENTE' é:", options: ["Mandatory (you must go straight)", "A prohibition", "A warning", "Merely a suggestion"], answer: 0, why: "Blue circular signs are mandatory instructions.", hint: "obrigatório", src: "curated", v: true },
      { q: "O símbolo de uma placa com faixa diagonal vermelha sobre uma buzina significa:", options: ["Sounding the horn is prohibited", "You must sound the horn", "A workshop is ahead", "Loud vehicles only"], answer: 0, why: "Red diagonal bar over a symbol = that action is prohibited.", src: "curated", v: true },
      { q: "Linha branca contínua no solo indica que o condutor:", options: ["Must not cross or change lanes", "May change lanes freely", "Must stop", "Is entering a one-way street"], answer: 0, why: "A continuous white line must not be crossed.", src: "curated", v: true },
      { q: "Uma placa triangular com a ponta para baixo ('DÊ A PREFERÊNCIA') significa:", options: ["Yield the right of way", "You have priority", "No entry", "Mandatory stop"], answer: 0, why: "Dê a preferência = give way / yield.", hint: "preferência", src: "curated", v: true },
      { q: "Placas educativas têm como objetivo:", options: ["Promote safe and courteous behaviour", "Impose a fine", "Regulate speed", "Mark distances"], answer: 0, why: "Educational signs encourage good conduct, not orders.", src: "curated", v: true },
      { q: "A cor predominante das placas de indicação de serviços auxiliares é:", options: ["Blue", "Red", "Yellow", "Orange"], answer: 0, why: "Service/information signs are typically blue.", src: "curated", v: true },
      { q: "Quando um agente de trânsito e um semáforo dão ordens diferentes, o condutor deve obedecer:", options: ["The traffic officer", "The traffic light", "Whichever is closer", "Neither, use judgement"], answer: 0, why: "A traffic officer's order overrides signs and signals.", src: "curated", v: true },
      { q: "Uma placa retangular na cor laranja normalmente indica:", options: ["Road works / temporary conditions", "A permanent speed limit", "A tourist site", "A one-way street"], answer: 0, why: "Orange signage marks works and temporary situations.", src: "curated", v: true },
      { q: "O semáforo com luz amarela (fixa) acesa significa:", options: ["Attention, the signal is about to change to red", "Go faster to beat the red", "Stop immediately always", "The light is broken"], answer: 0, why: "Steady yellow: caution, prepare to stop; proceed only if stopping would be unsafe.", src: "curated", v: true },
    ],
  },
  {
    id: "direcao",
    title: "Direção Defensiva",
    subtitle: "Defensive driving: seeing trouble early",
    color: "blue",
    vocab: ["aquaplanagem", "velocidade", "farol", "condutor", "salvo", "conforme"],
    teach: [
      { c: "Margins and automatisms", t: "The safety margins of the road change with the vehicle's condition, the driver's actions AND the road's condition: when a question offers 'todas estão corretas' on this, take it. Automatisms (automatismos) are the REFLEXES a driver acquires through training, repetition and discipline." },
      { c: "Risk comes from everywhere", t: "The risks in traffic relate to the vehicles, the roads, the environment and people's behaviour, all together. Tailgater behind you? Ease slightly to the right and reduce speed if needed; never brake-check, never race." },
      { c: "Distances", t: "Distância de reação: from perceiving danger to touching the brake. Distância de FRENAGEM: from pressing the brake until the full stop. Both grow with speed, fatigue, alcohol (which delays reflexes and wrecks self-assessment) and bad conditions." },
      { c: "Curves, priority vehicles, shoulders", t: "Slow down BEFORE the curve, never brake inside it. When a priority vehicle (sirens on) appears, move right and clear the way. Stopping on a rodovia shoulder outside an emergency is prohibited; it creates risk for through traffic." },
    ],
    // Portuguese, verbatim — drives exam + practice
    examPool: [
      { q: "As margens de segurança da via se alteram dependendo das:", options: ["Condições do veículo.", "Ações do condutor.", "Condições da via.", "Todas estão corretas."], answer: 3, gab: "d", why: "Vehicle, driver and road all shift your safety margins. All three together.", src: "AC-S01-Q19", v: false },
      { q: "A atitude correta para se livrar de um veículo ‘colado’ à sua retaguarda é:", options: ["Acender o pisca-alerta, fazendo sinal de braço para o outro condutor.", "Projetar seu veículo um pouco mais à direita da pista, reduzindo a velocidade, se necessário.", "Desviar para a esquerda, sinalizando para o outro condutor.", "Aumentar a velocidade em relação ao outro veículo."], answer: 1, gab: "b", why: "Ease right and reduce speed so the tailgater can pass. De-escalation, always.", src: "AC-S01-Q20", v: false },
      { q: "Os riscos e os perigos a que estamos sujeitos no trânsito estão relacionados com:", options: ["A sinalização das vias.", "As edificações nas áreas urbanas.", "Os veículos, as vias de trânsito, o ambiente e o comportamento das pessoas.", "Os lotes lindeiros ao longo da via."], answer: 2, gab: "c", why: "Risk is the combination of vehicles, roads, environment and human behaviour.", src: "AC-S01-Q21", v: false },
      { q: "A parada no acostamento à direita de uma rodovia é:", options: ["Obrigatória, se for convergir à esquerda.", "Proibida, pois oferece risco aos veículos que trafegam no sentido oposto.", "Permitido, se o trânsito estiver lento ou com retenções.", "Possível, para procurar um banheiro."], answer: 1, gab: "b", why: "Casual stops on the shoulder are prohibited; the shoulder is for genuine emergencies only.", hint: "acostamento", src: "AC-S01-Q22", v: false },
      { q: "Podemos considerar automatismos do condutor os _________ adquiridos através de treinamento, repetição e disciplina.", options: ["Conhecimentos.", "Efeitos gestuais.", "Reflexos.", "Comportamentos."], answer: 2, gab: "c", why: "Automatisms are trained REFLEXES: built by training, repetition and discipline.", src: "AC-S01-Q23", v: false },
      { q: "A distância e o tempo que o veículo percorre desde o momento em que o condutor pisa no freio até a parada, chama-se de distância e tempo de:", options: ["Seguimento.", "Parada.", "Frenagem.", "Reação."], answer: 2, gab: "c", why: "From pressing the brake to the full stop = FRENAGEM. Before the brake is reação.", src: "AC-S02-Q19", v: false },
      { q: "O uso abusivo de álcool e drogas pelo condutor causa efeitos comprometendo a sua capacidade de auto-avaliação e:", options: ["Aumento de acuidade visual.", "A melhoria da audição.", "O desenvolvimento da atenção.", "O retardamento dos reflexos."], answer: 3, gab: "d", why: "Alcohol and drugs delay the reflexes and destroy honest self-assessment.", src: "AC-S02-Q20", v: false },
      { q: "Existem veículos que tem prioridade de passagem. Ao se deparar com um deles o condutor deve proceder da seguinte maneira:", options: ["Aumentar a velocidade do seu veículo.", "Dirigir-se para a direita, desobstruindo a via.", "Seguir o veículo que tem prioridade.", "Buzinar com insistência."], answer: 1, gab: "b", why: "Move right and clear the way for priority vehicles.", src: "AC-S02-Q21", v: false },
      { q: "Para realizar uma curva com segurança, deve-se:", options: ["Aumentar a velocidade antes de chegar à curva.", "Pisar no freio durante a manobra.", "Acelerar fortemente na curva.", "Diminuir a velocidade, antes de chegar à curva."], answer: 3, gab: "d", why: "All braking happens BEFORE the curve; inside it you hold a steady line.", src: "AC-S02-Q22", v: false },
      { q: "O condutor que dirige com segurança é aquele que:", options: ["Circula em alta velocidade em qualquer situação.", "Circula com velocidade adequada a via.", "Ultrapassa outro veículo pela direita.", "Ultrapassa nos viadutos e pontes."], answer: 1, gab: "b", why: "Safe driving means speed adequate to the road, not maximum speed.", src: "AC-S02-Q23", v: false },
    ],
    // English learning versions — study cards only
    studyExamples: [
      { q: "Ao dirigir sob chuva, o condutor deve:", options: ["Reduce speed and increase following distance", "Keep the same speed", "Follow closer to see better", "Use only the handbrake"], answer: 0, why: "Wet roads reduce grip; slow down and leave more space.", src: "curated", v: true },
      { q: "A aquaplanagem (hidroplanagem) ocorre quando:", options: ["Tyres lose contact with the road because of water", "The engine overheats", "The brakes get wet", "The clutch slips"], answer: 0, why: "Aquaplaning: tyres ride on water and lose road contact. Worn tyres make it worse.", hint: "aquaplanagem", src: "curated", v: true },
      { q: "Ao dirigir sob neblina (cerração), deve-se usar:", options: ["Farol baixo (low beam)", "Farol alto (high beam)", "Pisca-alerta em movimento", "Nenhuma luz"], answer: 0, why: "Fog: LOW beam. High beam reflects off the fog into your eyes.", hint: "farol baixo", src: "curated", v: true },
      { q: "Antes de iniciar uma ultrapassagem, o condutor deve certificar-se de que:", options: ["The lane is clear and it can be done safely", "There is a car coming, to race it", "It is night time", "The horn works"], answer: 0, why: "Only overtake when the opposite lane is clear and safe.", hint: "ultrapassagem", src: "curated", v: true },
      { q: "Ao ser ultrapassado por outro veículo, o condutor deve:", options: ["Keep to the right and not speed up", "Accelerate to block it", "Move left", "Brake suddenly"], answer: 0, why: "When being overtaken, hold your line and don't accelerate.", src: "curated", v: true },
    ],
  },
  {
    id: "socorros",
    title: "Primeiros Socorros",
    subtitle: "First response at a crash scene",
    color: "green",
    vocab: ["socorro", "sinalizar", "vitima", "coluna", "salvo", "incorreta"],
    teach: [
      { c: "Protect yourself first", t: "Prevenir-se ao prestar socorro means avoiding personal risk and secondary crashes: secure the scene (sinalizar) before anything else, then call for help (192 SAMU, 193 Bombeiros, 190 Polícia)." },
      { c: "The two-stage check", t: "Análise primária: airways, circulation, body temperature. Análise secundária: visible wounds, fractures (open or closed), possible spinal injury. And a vocabulary trap the exam loves: HIPOTERMIA means LOW body temperature, not high." },
      { c: "Spine and neck", t: "Inability to move arms and legs after a crash points to lesão na coluna (spinal injury). The device that immobilises the neck is the colar cervical. Never move such a vítima, salvo risco iminente." },
      { c: "Bleeding and signalling", t: "Nosebleed: head higher than the heart, pinch the nostrils, cold compresses on nose, nape and forehead. Crash on a two-way road blocking lanes: signal in BOTH directions so everyone approaching is warned." },
    ],
    // Portuguese, verbatim — drives exam + practice
    examPool: [
      { q: "Indica incapacidade de movimentar pernas e braços após um sinistro de trânsito:", options: ["Ferimentos no crânio.", "Politraumatismo.", "Lesão na coluna.", "Lesão nos membros superiores."], answer: 2, gab: "c", why: "Losing movement in arms and legs signals spinal injury.", hint: "coluna", src: "AC-S01-Q24", v: false },
      { q: "Assinale a alternativa incorreta:", options: ["Na análise secundária deveremos observar ferimentos aparentes e se existe lesão na coluna.", "Hipotermia significa temperatura alta.", "Observar se a vítima apresenta fraturas, fechadas ou expostas, faz parte da análise secundária.", "Na análise primaria devemos observar as vias aéreas, a circulação e a temperatura corpórea."], answer: 1, gab: "b", why: "Hipotermia means LOW temperature; the statement claiming 'alta' is the false one. Watch for 'incorreta' in the stem.", hint: "incorreta", src: "AC-S01-Q25", v: false },
      { q: "Na ocorrência de um sinistro em via de duplo sentido com interrupção de faixas, a sinalização deve:", options: ["Ser feita com muita antecedência para não comprometer o fluxo.", "Estar bem visível no sentido que trafega em direção às faixas interditadas pelo sinistro.", "Ser feita nos dois sentidos a fim de se alertar todos que trafegam em direção ao sinistro.", "Ser feita com sinalizadores luminosos e com dispositivos auxiliares de sinalização."], answer: 2, gab: "c", why: "Blocked lanes on a two-way road: warn traffic in BOTH directions.", hint: "sinalizar", src: "AC-S01-Q26", v: false },
      { q: "Prevenir-se ao prestar socorro a alguém, significa:", options: ["Somente socorrer se estiver acompanhado por alguém.", "Evitar riscos pessoais e sinistros secundários.", "Evitar ser chamado como testemunha.", "Socorrer somente durante o dia."], answer: 1, gab: "b", why: "Self-protection first: avoid personal risk and prevent a second crash.", src: "AC-S02-Q24", v: false },
      { q: "Se há sangramento no nariz, deixe a cabeça da vítima mais alta que o nível do coração, e:", options: ["Comprima as narinas e coloque compressas de gelo sobre o nariz, nuca e testa.", "Deixe o sangue sair a vontade.", "Tampe as narinas com saco plástico.", "Levante a vítima imediatamente."], answer: 0, gab: "a", why: "Pinch the nostrils and apply cold compresses to nose, nape and forehead.", src: "AC-S02-Q25", v: false },
      { q: "O aparelho usado para imobilizar o pescoço, quando há suspeita de fratura na coluna, é:", options: ["Garrote.", "Colar cervical.", "Torniquete.", "Bandagem."], answer: 1, gab: "b", why: "Suspected spinal fracture: immobilise the neck with a cervical collar.", hint: "coluna", src: "AC-S02-Q26", v: false },
    ],
    // English learning versions — study cards only
    studyExamples: [
      { q: "A primeira providência ao chegar no local de um acidente é:", options: ["Secure and signal the scene to prevent new crashes", "Move the victims immediately", "Give the victims water", "Remove a motorcyclist's helmet"], answer: 0, why: "Secure the scene first. Everything else comes after.", hint: "sinalizar", src: "curated", v: true },
      { q: "O telefone do SAMU é:", options: ["192", "190", "193", "191"], answer: 0, why: "SAMU 192, Bombeiros 193, Polícia 190.", src: "curated", v: true },
      { q: "Vítima inconsciente com suspeita de lesão na coluna:", options: ["Must not be moved, unless there is imminent danger", "Should be sat upright", "Should be driven to hospital in your car", "Should be given liquids"], answer: 0, why: "Do not move a spinal-injury victim unless danger (like fire) forces it.", hint: "salvo", src: "curated", v: true },
      { q: "Em caso de hemorragia visível, uma ação de primeiros socorros é:", options: ["Apply pressure to the wound", "Give the person food", "Make them walk", "Remove their clothes"], answer: 0, why: "Direct pressure controls visible bleeding until help arrives.", src: "curated", v: true },
      { q: "O capacete de um motociclista acidentado deve ser retirado:", options: ["Only by trained rescuers, unless breathing is obstructed", "Immediately, by anyone", "Always, to ventilate the victim", "Never, under any circumstance"], answer: 0, why: "Helmet removal is for trained rescuers, except when breathing is blocked.", hint: "salvo", src: "curated", v: true },
      { q: "Ao sinalizar um acidente à noite, é importante:", options: ["Make yourself and the triangle visible to others", "Turn off all lights", "Stand in the middle of the lane", "Do nothing until help comes"], answer: 0, why: "Visibility is critical at night.", src: "curated", v: true },
    ],
  },
  {
    id: "ambiente",
    title: "Meio Ambiente e Convívio Social",
    subtitle: "Pollution, health, coexistence",
    color: "green",
    vocab: ["poluicao", "conforme", "condutor"],
    teach: [
      { c: "What burning fuel releases", t: "Vehicle combustion releases aldeídos, dióxido de carbono and dióxido de enxofre. When a question asks which substance is NOT a combustion pollutant, the odd one out is something like ácidos graxos (fatty acids)." },
      { c: "Acid rain and your lungs", t: "Chuva ácida corrodes METALS: that concrete consequence is the tested answer. Air pollution's main human toll is RESPIRATORY illness. Hazardous products are classified by their CHEMICAL COMPOSITION." },
      { c: "Convívio social", t: "The social-coexistence questions always resolve to respect, courtesy and cooperation between road users. Any aggressive, hurried or self-important option is wrong." },
    ],
    // Portuguese, verbatim — drives exam + practice
    examPool: [
      { q: "Qual substância abaixo não é poluente liberado pela queima de combustíveis nos veículos:", options: ["Aldeídos.", "Dióxido de carbono.", "Dióxido de enxofre.", "Ácidos graxos."], answer: 3, gab: "d", why: "Fatty acids are not a combustion pollutant; the other three are.", hint: "não — odd one out", src: "AC-S01-Q27", v: false },
      { q: "Os produtos perigosos classificam-se de acordo com:", options: ["A sua composição química.", "A sua tonalidade.", "A sua viscosidade.", "O seu aroma."], answer: 0, gab: "a", why: "Hazardous products are classified by chemical composition.", src: "AC-S01-Q28", v: false },
      { q: "Além dos males causados pela poluição do ar por veículos, assinale a alternativa que corresponde a consequência da chuva ácida:", options: ["Corrosão em metais.", "Tontura.", "Dor de cabeça.", "Edema pulmonar."], answer: 0, gab: "a", why: "Acid rain's signature consequence: corrosion of metals.", hint: "poluição", src: "AC-S02-Q27", v: false },
      { q: "A poluição do ar causa problemas de saúde que resultam, principalmente, em:", options: ["Doenças do aparelho digestivo.", "Doenças respiratórias.", "Alterações visuais.", "Dores de cabeça."], answer: 1, gab: "b", why: "Air pollution's main health toll is respiratory disease.", hint: "poluição", src: "AC-S02-Q28", v: false },
    ],
    // English learning versions — study cards only
    studyExamples: [
      { q: "Um motor mal regulado, em relação à poluição:", options: ["Pollutes more", "Pollutes less", "Has no effect", "Saves fuel"], answer: 0, why: "A poorly tuned engine emits more pollutants and burns more fuel.", hint: "poluição", src: "curated", v: true },
      { q: "Buzinar de forma excessiva e desnecessária é:", options: ["Noise pollution and an infraction", "A good way to alert others", "Always permitted", "Required in traffic"], answer: 0, why: "Excessive honking is noise pollution and a violation.", src: "curated", v: true },
      { q: "O convívio social no trânsito exige:", options: ["Respect, courtesy and cooperation between road users", "Imposing yourself over others", "Speed above everything", "Constant horn use"], answer: 0, why: "Coexistence questions always resolve to respect and cooperation.", src: "curated", v: true },
    ],
  },
  {
    id: "mecanica",
    title: "Noções de Veículo",
    subtitle: "Basic mechanics: systems and instruments",
    color: "blue",
    vocab: ["pneu", "freio", "conforme"],
    teach: [
      { c: "Systems by their parts", t: "Ignition key, coil and distributor belong to the sistema de IGNIÇÃO: its job is to ignite the air-fuel mix. The parts that propel, brake AND steer the car are the PNEUS: everything the car does passes through the tyres." },
      { c: "Instruments and wheels", t: "Amperímetro shows the dynamo's charge and the battery's discharge (the others in that classic question are scrambled on purpose). Wheel balancing (balanceamento) is done when the steering wheel starts vibrating." },
    ],
    // Portuguese, verbatim — drives exam + practice
    examPool: [
      { q: "Tem como componentes a chave de ignição, bobina, distribuidor e sua função é inflamar a mistura ar-combustível, o sistema de:", options: ["Alimentação.", "Lubrificação.", "Ignição.", "Arrefecimento."], answer: 2, gab: "c", why: "Key, coil, distributor = ignition system: it ignites the air-fuel mixture.", src: "AC-S01-Q29", v: false },
      { q: "Quais itens são responsáveis por impulsionar, frear e manter a dirigibilidade do veículo:", options: ["Árvore de transmissão.", "Diferencial.", "Pneus.", "Embreagem."], answer: 2, gab: "c", why: "Propulsion, braking and steering all reach the road through the TYRES.", hint: "pneu", src: "AC-S01-Q30", v: false },
      { q: "Assinale a alternativa correta:", options: ["Termômetro: indica a pressão do óleo do motor.", "Voltímetro: indica o número de voltas das rodas.", "Manômetro: indica o nível de água do radiador.", "Amperímetro: indica a carga de dínamo e a descarga de bateria."], answer: 3, gab: "d", why: "Only the amperímetro line is matched correctly: dynamo charge and battery discharge.", src: "AC-S02-Q29", v: false },
      { q: "O balanceamento das rodas deve ser executado:", options: ["Pelo menos uma vez por mês.", "Quando a direção estiver pesada.", "Quando surgirem vibrações no volante.", "Depois de cada calibragem."], answer: 2, gab: "c", why: "Vibration in the steering wheel is the sign the wheels need balancing.", hint: "pneu", src: "AC-S02-Q30", v: false },
    ],
    // English learning versions — study cards only
    studyExamples: [
    ],
  },
];

const EXAM_WEIGHTS = { legislacao: 12, sinalizacao: 6, direcao: 5, socorros: 3, ambiente: 2, mecanica: 2 };

/* Expose to the app: the ONLY name that leaves this file */
window.CNH_DATA = { VOCAB, MODULES, EXAM_WEIGHTS };
})();
