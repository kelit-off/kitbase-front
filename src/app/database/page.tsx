import VitrineLayout from "@/layout/vitrineLayout";

export default function Database() {
    return (
        <VitrineLayout>
            <div className="relative isolate px-6 pt-14 lg:px-8">
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
                            C'est juste Postgres
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                            Chaque projet dispose d'une base de données Postgres dédiée.
                            <br />
                            Postgres est l'une des bases de données les plus évolutives au monde.
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

            {/* Présentation en 3 catégories */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                        <div>
                            <dt className="text-lg font-semibold text-white">Juste Postgres</dt>
                            <dd className="mt-2 text-sm text-gray-400">
                                Chaque projet est une base de données Postgres dédiée.
                            </dd>
                        </div>
                        <div>
                            <dt className="text-lg font-semibold text-white">Sécurisé par défaut</dt>
                            <dd className="mt-2 text-sm text-gray-400">
                                Chiffrement, isolation réseau et contrôle d'accès inclus.
                            </dd>
                        </div>
                        <div>
                            <dt className="text-lg font-semibold text-white">Haute disponibilité</dt>
                            <dd className="mt-2 text-sm text-gray-400">
                                Sauvegardes automatiques, réplication et PITR inclus.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Fonctionnalités dashboard */}
            {/* <div className="relative bg-black text-white py-24 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-semibold mb-4">
                        Interface simple à utiliser
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        La simplicité d'un éditeur de tables, ou la puissance d'un éditeur SQL.
                        À vous de choisir.
                    </p>

                    <div className="mt-8 flex justify-center gap-8 border-b border-gray-800">
                        <button className="pb-3 text-sm font-medium relative text-white cursor-pointer">
                            Éditeur de tables
                            <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-white" />
                        </button>
                        <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-300">
                            Éditeur SQL
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl blur-3xl opacity-40" />
                        <div className="relative bg-[#111] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#0b0b0b] text-xs text-gray-400">
                                <span className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="ml-4">app.kitbase.cloud</span>
                            </div>

                            <div className="p-4 text-sm text-gray-300">
                                <div className="flex gap-2 mb-3">
                                    <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                                        Édition type tableur
                                    </span>
                                    <span className="px-2 py-1 bg-gray-800 rounded text-xs opacity-50">
                                        Créer des tables
                                    </span>
                                </div>

                                <div className="border border-gray-800 rounded overflow-hidden">
                                    <div className="grid grid-cols-3 bg-gray-900 text-xs font-medium">
                                        <div className="p-2 border-r border-gray-800">inséré_le</div>
                                        <div className="p-2 border-r border-gray-800">message</div>
                                        <div className="p-2">user_id</div>
                                    </div>
                                    <div className="grid grid-cols-3 text-xs">
                                        <div className="p-2 border-t border-gray-800">2021-03-24</div>
                                        <div className="p-2 border-t border-gray-800 text-green-400">Bonjour le monde 👋</div>
                                        <div className="p-2 border-t border-gray-800">8d0fd2b3</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-semibold mb-4">
                            La simplicité d'un tableur
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Ajoutez, modifiez et mettez à jour vos données avec la simplicité
                            d'un outil no-code.
                        </p>
                        <a
                            href="/docs"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                        >
                            Voir la documentation →
                        </a>

                        <div className="mt-10 bg-[#0b0b0b] border border-gray-800 rounded-xl p-4 text-sm text-gray-300">
                            <div className="font-semibold mb-1">@Elsolo244</div>
                            <p>Où était @kitbase toute ma vie ? 😍</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </VitrineLayout>
    );
}
