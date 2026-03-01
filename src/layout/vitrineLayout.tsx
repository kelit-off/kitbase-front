import VitrineHeader from "@/components/vitrineHeader";
import Link from "next/link";

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <VitrineHeader />
            <main>
                {children}
            </main>
            <footer className="border-t border-white/10 bg-black text-gray-400 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-white">KitBase</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                                    Bêta
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                La plateforme de bases de données managées pour les équipes modernes.
                            </p>
                        </div>

                        {/* Produit */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white">Produit</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/database" className="hover:text-white transition-colors">Base de données</Link></li>
                                <li><Link href="/auth/register" className="hover:text-white transition-colors">Commencer gratuitement</Link></li>
                                <li><span className="text-gray-600">Tarifs (bientôt)</span></li>
                            </ul>
                        </div>

                        {/* Ressources */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white">Ressources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                                <li><span className="text-gray-600">Changelog (bientôt)</span></li>
                                <li><span className="text-gray-600">Statut (bientôt)</span></li>
                            </ul>
                        </div>

                        {/* Entreprise */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white">Entreprise</h4>
                            <ul className="space-y-2 text-sm">
                                <li><span className="text-gray-600">À propos (bientôt)</span></li>
                                <li><span className="text-gray-600">Mentions légales (bientôt)</span></li>
                                <li><span className="text-gray-600">Confidentialité (bientôt)</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                        <span>© {new Date().getFullYear()} KitBase. Tous droits réservés.</span>
                        <span>Construit avec ❤️ pour les développeurs</span>
                    </div>
                </div>
            </footer>
        </>
    );
}
