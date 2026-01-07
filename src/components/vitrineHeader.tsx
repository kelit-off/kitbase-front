import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type MenuItem = {
    title: string;
    description?: string;
    href?: string;
    icon?: React.ElementType;
    children?: MenuItem[];
};

const menuItems: MenuItem[] = [
    {
        title: "Product",
        children: [
            {
                title: "Database",
                description: "Fully portable Postgres database",
                href: "/database",
            },
            // { title: 'Authentication', description: 'User Management out of the box', href: '/auth' },
            // { title: 'Storage', description: 'Serverless storage for any media', href: '/storage' },
        ],
    },
    {
        title: "Docs",
        href: "/docs",
    },
];

export default function VitrineHeader() {
    const user = null
    // const { auth } = usePage<SharedData>().props;
    return (
        <header className="border-b shadow-md px-72 py-4 w-full max-w-screen">
            <nav className="flex items-center justify-between w-full">
                <div className="flex items-center gap-16">
                    <div className="font-bold text-lg">KitBase</div>

                    <div className="flex gap-6">
                        {menuItems.map((item) => (
                            <div key={item.title}>
                                {item.children?.length ? (
                                    // Mega menu si item a des children
                                    <Popover className="relative">
                                        <PopoverButton className="flex items-center gap-1 font-semibold cursor-pointer focus:outline-0 -z-50">
                                            {item.title}{" "}
                                            <ChevronDown className="w-4 h-4" />
                                        </PopoverButton>

                                        <PopoverPanel className="absolute left-0 mt-2 w-[600px] bg-white dark:bg-black border rounded-xl shadow-lg p-4 flex gap-6 z-50">
                                            {/* Colonne principale */}
                                            <div className="flex flex-col gap-3 w-[280px]">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.title}
                                                        href={child.href || "#"}
                                                    >
                                                        <div className="flex gap-3 p-2 hover:bg-gray-700 rounded-md">
                                                            {child.icon && (
                                                                <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg">
                                                                    <child.icon className="w-5 h-5 text-gray-600" />
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold">
                                                                    {
                                                                        child.title
                                                                    }
                                                                </span>
                                                                {child.description && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {
                                                                            child.description
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </PopoverPanel>
                                    </Popover>
                                ) : (
                                    // Lien direct si pas d'enfant
                                    <Link
                                        href={item.href || "#"}
                                        className="font-semibold"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="font-semibold mr-3"
                            >
                                <button variant={"success"} size={"sm"}>
                                    Dashboard
                                </button>
                            </Link>
                            {/* <NavUser /> */}
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="font-semibold">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="ml-4 font-semibold"
                            >
                                Start your project
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
