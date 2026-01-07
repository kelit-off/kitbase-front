import VitrineHeader from "@/components/vitrineHeader";

export default function VitrineLayout({children}): React.ReactNode {
    return (
        <>
            <VitrineHeader />
            <main>
                {children}
            </main>
        </>
    )
}