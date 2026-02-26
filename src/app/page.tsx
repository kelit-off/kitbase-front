import { Button } from "@/components/ui/button";
import VitrineLayout from "@/layout/vitrineLayout";

const columns = [
    [
        {
            username: "@orlandopedro_",
            text: "J'adore les domaines personnalisés de @kitbase, ça rend l'authentification tellement meilleure",
        },
        {
            username: "@edm_lawson",
            text: "Les edge functions de KitBase sont top. Cursor + KitBase + MCP + Docker Desktop, c'est tout ce qu'il me faut.",
        },
    ],
    [
        {
            username: "@dusteric",
            text: "KitBase MCP est incroyable. Claude Code non seulement planifie les tâches à sauvegarder mais génère aussi les scripts de migration en analysant le schéma.",
        },
        {
            username: "@themadgeniusx",
            text: "J'utilise KitBase plutôt qu'AWS ou GCP pour mes produits — économies réelles et builds rapides sans toute l'infra lourde. Excellente solution.",
        },
        {
            username: "@gokul_j",
            text: "Première fois que j'utilise KitBase en local. Ça marche tout seul. Très bonne DX.",
        },
    ],
    [
        { username: "@pontusab", text: "J'adore tout ce que propose KitBase" },
        {
            username: "@dadooos_",
            text: "Je suis avec KitBase depuis les débuts et voir l'évolution depuis cette époque, c'est comme regarder mon enfant grandir.",
        },
    ],
    [
        {
            username: "@nerdbum",
            text: "C'est fun, léger, et rapide à démarrer en quelques touches. Je le recommande !",
        },
        {
            username: "@sarah_dev",
            text: "Les fonctionnalités temps réel sont incroyables. Créer une appli de chat a été un jeu d'enfant !",
        },
        {
            username: "@alex_codes",
            text: "La migration depuis Firebase s'est faite sans accroc. J'adore la puissance de PostgreSQL derrière.",
        },
    ],
    [
        {
            username: "@maria_tech",
            text: "La sécurité au niveau des lignes change tout pour mon application SaaS.",
        },
        {
            username: "@john_builder",
            text: "Meilleure décision que de passer à KitBase. La documentation est au top !",
        },
    ],
    [
        {
            username: "@lisa_dev",
            text: "L'API de stockage est simple mais puissante. Gérer les uploads n'a jamais été aussi facile.",
        },
        {
            username: "@mike_startup",
            text: "J'ai construit mon MVP en un week-end grâce à KitBase. Maintenant je monte à des milliers d'utilisateurs !",
        },
        {
            username: "@emma_tech",
            text: "L'option self-hosting est parfaite pour les clients enterprise. J'adore la flexibilité !",
        },
    ],
];

export default function Home() {
    return (
        <VitrineLayout>
            {/* Section Hero */}
            <div className="relative isolate px-6 lg:px-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
                            Des bases de données prêtes pour la production, sans la charge opérationnelle
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                            Déployez, faites évoluer et sécurisez vos bases de données en quelques minutes.
                            Nous gérons les sauvegardes, les mises à jour, la supervision et la haute disponibilité —
                            pour que votre équipe se concentre sur la création de produits.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="/auth/register"
                                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Commencer
                            </a>
                            <a
                                href="/docs"
                                className="text-sm/6 font-semibold text-white"
                            >
                                Voir la documentation{" "}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                    />
                </div>
            </div>

            {/* Section Bento */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-center text-base/7 font-semibold text-indigo-400">
                        Plateforme DBaaS managée
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                        Des bases de données prêtes pour la production, sans surcharge opérationnelle
                    </p>
                    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-gray-800 lg:rounded-l-4xl" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                        Expérience développeur
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                        Provisionnez, faites évoluer et supervisez vos bases
                                        via une interface et une API claires.
                                        <br />
                                        Conçu pour les développeurs qui exigent vitesse,
                                        clarté et contrôle.
                                    </p>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 lg:rounded-l-4xl" />
                        </div>
                        <div className="relative max-lg:row-start-1">
                            <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-t-4xl" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                        Haute performance & scalabilité
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                        Moteurs optimisés, accès basse latence
                                        et scaling horizontal conçus
                                        <br />
                                        pour supporter des charges de production à toute échelle.
                                    </p>
                                </div>
                                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                    <img
                                        alt=""
                                        src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-performance.png"
                                        className="w-full max-lg:max-w-xs"
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-t-4xl" />
                        </div>
                        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                            <div className="absolute inset-px rounded-lg bg-gray-800" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                        Sécurité & conformité
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                        Chiffrement au repos et en transit,
                                        isolation réseau, contrôle d'accès
                                        <br />
                                        et journaux d'audit pour répondre aux exigences enterprise et réglementaires.
                                    </p>
                                </div>
                                <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                    <img
                                        alt=""
                                        src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png"
                                        className="h-[min(152px,40cqw)] object-cover"
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15" />
                        </div>
                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                        Automatisation & APIs
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                        Gestion complète du cycle de vie via des APIs REST
                                        et des intégrations infrastructure-as-code
                                        <br />
                                        pour les pipelines CI/CD et les workflows cloud-native.
                                    </p>
                                </div>
                                <div className="relative min-h-120 w-full grow">
                                    <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900/60 outline outline-white/10">
                                        <div className="flex bg-gray-900 outline outline-white/5">
                                            <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                                                <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                                                    connexionBdd.js
                                                </div>
                                                <div className="border-r border-gray-600/10 px-4 py-2">
                                                    App.jsx
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 pt-6 pb-14">
                                            <pre className="text-sm text-gray-200 overflow-x-auto">
                                                <code>
                                                    {`import { Client } from "pg";

const client = new Client({
  host: "demo.db.kitbase.cloud",
  port: 5432,
  user: "demo_user",
  password: "demo_password",
  database: "demo_db",
  ssl: true,
});

async function connecterBase() {
  await client.connect();

  const result = await client.query("SELECT NOW()");
  console.log("Connecté à :", result.rows[0]);

  await client.end();
}
connecterBase();`}
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Témoignages */}
            <div className="text-white py-20 overflow-hidden">
                <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-scroll-left {
          animation: scrollLeft 60s linear infinite;
        }
      `}</style>

                <div className="max-w-7xl mx-auto mb-16 px-4">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">
                            Rejoignez la communauté
                        </h1>
                        <p className="text-zinc-400 text-lg mb-8">
                            Découvrez ce que notre communauté dit de son expérience avec KitBase.
                        </p>
                        <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            Rejoindre Discord
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div
                        className="absolute left-0 top-0 bottom-0 w-96 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 100% 100% at left center, black 0%, transparent 100%)",
                        }}
                    ></div>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-64 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(270deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 100% 100% at right center, black 0%, transparent 100%)",
                        }}
                    ></div>
                    <div
                        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 150% 100% at top center, black 0%, transparent 100%)",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 150% 100% at bottom center, black 0%, transparent 100%)",
                        }}
                    ></div>

                    <div className="flex overflow-hidden bg-transparent">
                        <div className="flex gap-6 animate-scroll-left pt-4">
                            {columns.map((column, colIndex) => (
                                <div key={colIndex} className="flex-shrink-0 w-80">
                                    {column.map((testimonial, index) => (
                                        <div
                                            key={index}
                                            className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 mb-4 animate-fadeIn"
                                            style={{ animationDelay: `${colIndex * 150 + index * 100}ms` }}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                                                    {testimonial.username.substring(1, 3).toUpperCase()}
                                                </div>
                                                <span className="text-zinc-400 font-medium">{testimonial.username}</span>
                                            </div>
                                            <p className="text-zinc-300 leading-relaxed">{testimonial.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {columns.map((column, colIndex) => (
                                <div key={`dup-${colIndex}`} className="flex-shrink-0 w-80">
                                    {column.map((testimonial, index) => (
                                        <div
                                            key={index}
                                            className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 mb-4"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                                                    {testimonial.username.substring(1, 3).toUpperCase()}
                                                </div>
                                                <span className="text-zinc-400 font-medium">{testimonial.username}</span>
                                            </div>
                                            <p className="text-zinc-300 leading-relaxed">{testimonial.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section CTA */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Prêt à lancer votre base de données en quelques minutes ?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-200">
                        Démarrez votre instance PostgreSQL, MySQL ou MongoDB managée dès aujourd'hui.
                        Aucune configuration d'infrastructure, aucun souci —
                        des bases de données évolutives, sécurisées et performantes.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/auth/register"
                            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-900 shadow-lg hover:bg-gray-100 transition"
                        >
                            Commencer gratuitement
                        </a>
                        <a
                            href="/docs"
                            className="inline-block rounded-lg border border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-indigo-900 transition"
                        >
                            Voir la documentation
                        </a>
                    </div>
                    <p className="mt-6 text-sm text-indigo-300">
                        Plan gratuit disponible. Résiliation à tout moment. Aucune carte bancaire requise.
                    </p>
                </div>
            </section>
        </VitrineLayout>
    );
}
