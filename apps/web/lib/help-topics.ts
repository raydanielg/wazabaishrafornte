/** Help Center content — structured, localized (§14). */
export interface HelpTopic {
  slug: string;
  en: { title: string; description: string; steps: string[] };
  sw: { title: string; description: string; steps: string[] };
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    slug: "getting-started",
    en: {
      title: "Getting started",
      description: "Set up your account and business in minutes.",
      steps: [
        "Create your account with your email or phone number.",
        "Choose a plan — you can start free and upgrade later.",
        "Open the Wazabiashara app and add your first business.",
        "Add your products or services with their prices and stock.",
        "Start recording sales — everything else updates automatically.",
      ],
    },
    sw: {
      title: "Kuanza",
      description: "Weka akaunti na biashara yako tayari kwa dakika chache.",
      steps: [
        "Tengeneza akaunti kwa barua pepe au namba ya simu.",
        "Chagua mpango — unaweza kuanza bure na kuboresha baadaye.",
        "Fungua app ya Wazabiashara uongeze biashara yako ya kwanza.",
        "Ongeza bidhaa au huduma zako kwa bei na hisa.",
        "Anza kurekodi mauzo — mengine yote yanajisasisha yenyewe.",
      ],
    },
  },
  {
    slug: "businesses",
    en: {
      title: "Businesses",
      description: "Manage one or many businesses from a single account.",
      steps: [
        "Each business has its own products, sales, customers and reports.",
        "Switch between businesses from the business switcher — data stays separate.",
        "Your plan determines how many businesses you can create.",
      ],
    },
    sw: {
      title: "Biashara",
      description: "Simamia biashara moja au nyingi kutoka akaunti moja.",
      steps: [
        "Kila biashara ina bidhaa, mauzo, wateja na ripoti zake mwenyewe.",
        "Badilisha biashara kwa switcher — data haichanganyiki.",
        "Mpango wako huamua biashara ngapi unaweza kuunda.",
      ],
    },
  },
  {
    slug: "sales",
    en: {
      title: "Sales",
      description: "Record sales quickly — cash or credit.",
      steps: [
        "Open a sale, add items, choose the payment method and confirm.",
        "Credit sales automatically create a customer debt to track.",
        "Stock reduces automatically when a sale is recorded.",
        "Every sale gets a receipt number for easy reference.",
      ],
    },
    sw: {
      title: "Mauzo",
      description: "Rekodi mauzo haraka — cash au kwa deni.",
      steps: [
        "Fungua mauzo, ongeza bidhaa, chagua njia ya malipo kisha thibitisha.",
        "Mauzo ya deni yanaunda deni la mteja moja kwa moja.",
        "Hisa hupungua moja kwa moja mauzo yanaporekodiwa.",
        "Kila mauzo hupata namba ya risiti kwa urahisi wa kurejea.",
      ],
    },
  },
  {
    slug: "products",
    en: {
      title: "Products & stock",
      description: "Keep your catalog and inventory accurate.",
      steps: [
        "Add products with name, price, cost and category.",
        "Set an opening stock to start tracking quantities.",
        "Every stock change is recorded as a traceable movement.",
        "Low-stock alerts notify you before you run out.",
      ],
    },
    sw: {
      title: "Bidhaa na hisa",
      description: "Weka bidhaa na hisa zako sahihi.",
      steps: [
        "Ongeza bidhaa kwa jina, bei, gharama na kategoria.",
        "Weka hisa ya mwanzo ili kuanza kufuatilia wingi.",
        "Kila mabadiliko ya hisa yanarekodiwa kama movement.",
        "Arifa za hisa ndogo hukujulisha kabla hujakosa.",
      ],
    },
  },
  {
    slug: "customers",
    en: {
      title: "Customers",
      description: "Know your customers and their balances.",
      steps: [
        "Add customers with their contact details.",
        "See each customer's purchase history and outstanding debts.",
        "Record debt payments as they come in — balances update instantly.",
      ],
    },
    sw: {
      title: "Wateja",
      description: "Wajue wateja wako na madeni yao.",
      steps: [
        "Ongeza wateja kwa mawasiliano yao.",
        "Ona historia ya manunuzi na madeni ya kila mteja.",
        "Rekodi malipo ya madeni yanavyokuja — salio linajisasisha.",
      ],
    },
  },
  {
    slug: "suppliers",
    en: {
      title: "Suppliers",
      description: "Track who supplies your stock and what you owe them.",
      steps: [
        "Keep supplier contact details in one place.",
        "Supplier debts are tracked alongside customer debts.",
      ],
    },
    sw: {
      title: "Wasambazaji",
      description: "Fuatilia wanaokupa bidhaa na unachowaona.",
      steps: [
        "Weka mawasiliano ya wasambazaji sehemu moja.",
        "Madeni ya wasambazaji yanafuatiliwa pamoja na ya wateja.",
      ],
    },
  },
  {
    slug: "expenses",
    en: {
      title: "Expenses",
      description: "See where your business money goes.",
      steps: [
        "Record expenses under categories like rent, transport or stock purchases.",
        "Expenses feed directly into your profit reports.",
      ],
    },
    sw: {
      title: "Matumizi",
      description: "Ona pesa ya biashara yako inakwenda wapi.",
      steps: [
        "Rekodi matumizi kwa makundi kama kodi, usafiri au manunuzi ya bidhaa.",
        "Matumizi yanaingia moja kwa moja kwenye ripoti za faida.",
      ],
    },
  },
  {
    slug: "debts",
    en: {
      title: "Debts",
      description: "Never forget who owes you — or who you owe.",
      steps: [
        "Credit sales create debts automatically.",
        "Partial payments update the balance and status.",
        "Settle a debt fully to close it.",
      ],
    },
    sw: {
      title: "Madeni",
      description: "Usisahau anayekudai — au unayemdai.",
      steps: [
        "Mauzo ya deni yanaunda madeni moja kwa moja.",
        "Malipo ya sehemu husasisha salio na hali.",
        "Lipa deni lote kulifunga.",
      ],
    },
  },
  {
    slug: "staff",
    en: {
      title: "Staff & roles",
      description: "Give your team access without giving away everything.",
      steps: [
        "Invite staff by email — they accept and set their own password.",
        "Assign roles like cashier or manager to control what each person can do.",
        "Remove access instantly when someone leaves.",
      ],
    },
    sw: {
      title: "Wafanyakazi na majukumu",
      description: "Wape timu yako ruhusa bila kupoteza udhibiti.",
      steps: [
        "Waalike wafanyakazi kwa barua pepe — wanakubali na kuweka nywila yao.",
        "Wape majukumu kama cashier au manager kudhibiti wanachofanya.",
        "Ondoa ruhusa mara moja mtu anapoondoka.",
      ],
    },
  },
  {
    slug: "reports",
    en: {
      title: "Reports",
      description: "Turn activity into understanding.",
      steps: [
        "Sales, expenses, profit, stock and debt reports are built in.",
        "Filter by date range to compare periods.",
        "Export reports as PDF or CSV for sharing.",
      ],
    },
    sw: {
      title: "Ripoti",
      description: "Geuza shughuli kuwa maarifa.",
      steps: [
        "Ripoti za mauzo, matumizi, faida, hisa na madeni ziko tayari.",
        "Chuja kwa tarehe kulinganisha vipindi.",
        "Pakua ripoti kama PDF au CSV kwa kushiriki.",
      ],
    },
  },
  {
    slug: "subscriptions",
    en: {
      title: "Subscriptions & plans",
      description: "How plans, trials and limits work.",
      steps: [
        "Every business gets its own subscription.",
        "Plans define which modules and limits your business has.",
        "Upgrade or change plans — limits apply immediately.",
        "If a subscription expires, your data stays safe — only access is limited.",
      ],
    },
    sw: {
      title: "Mipango na malipo",
      description: "Jinsi mipango, majaribio na mipaka inavyofanya kazi.",
      steps: [
        "Kila biashara ina mfuko wake mwenyewe.",
        "Mipango huamua moduli na mipaka ya biashara yako.",
        "Boresha au badilisha mpango — mipaka hutumika mara moja.",
        "Mfuko ukikwisha, data yako inabaki salama — ni upatikanaji tu unaopungua.",
      ],
    },
  },
  {
    slug: "security",
    en: {
      title: "Security",
      description: "How your data stays safe.",
      steps: [
        "Each business's data is isolated — no cross-business leakage.",
        "Role-based permissions control what staff can access.",
        "Sessions can be revoked from your account page.",
        "All sensitive actions are recorded in audit logs.",
      ],
    },
    sw: {
      title: "Usalama",
      description: "Jinsi data yako inavyolindwa.",
      steps: [
        "Data ya kila biashara imetengwa — hakuna uvujaji.",
        "Ruhusa za majukumu hudhibiti wafanyakazi wanachoona.",
        "Vipindi vinaweza kuondolewa kwenye ukurasa wa akaunti yako.",
        "Hatua zote muhimu zinarekodiwa kwenye audit logs.",
      ],
    },
  },
];
