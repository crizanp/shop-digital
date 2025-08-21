import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Menu, X, Search, Package } from 'lucide-react';
import LoadingLink from './LoadingLink';

const Sidebar = ({ categories = [], activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const checkViewport = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsOpen(window.innerWidth >= 1024);
        };
        checkViewport();
        window.addEventListener('resize', checkViewport);

        const onOpen = () => setIsOpen(true);
        const onToggle = () => setIsOpen(v => !v);
        const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };

        window.addEventListener('openSidebar', onOpen);
        window.addEventListener('toggleSidebar', onToggle);
        window.addEventListener('keydown', onKey);

        return () => {
            window.removeEventListener('resize', checkViewport);
            window.removeEventListener('openSidebar', onOpen);
            window.removeEventListener('toggleSidebar', onToggle);
            window.removeEventListener('keydown', onKey);
        };
    }, []);

    useEffect(() => {
        if (activeCategory) {
            setExpandedCategories(prev => ({ ...prev, [activeCategory]: true }));
        }
    }, [activeCategory]);

    useEffect(() => {
        if (categories && categories.length) {
            const expanded = {};
            categories.forEach(cat => {
                if (cat.hasSubcategories) expanded[cat.slug] = true; // sensible default open
            });
            setExpandedCategories(expanded);
        }
    }, [categories]);

    const toggleCategory = (slug) =>
        setExpandedCategories(prev => ({ ...prev, [slug]: !prev[slug] }));

    const filtered = categories.filter(cat => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        if (cat.name.toLowerCase().includes(q)) return true;
        return (cat.subcategories || []).some(s => s.name.toLowerCase().includes(q));
    });

    return (
        <>
            {/* Mobile floating toggle (optional) - keep for convenience */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsOpen(v => !v)}
                    className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-500 transition"
                    aria-label={isOpen ? 'Close categories' : 'Open categories'}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && isMobile && (
                <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />
            )}

            <aside
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform duration-300 ease-in-out
                            ${isMobile ? `fixed inset-y-0 left-0 w-3/4 max-w-xs z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : 'relative z-40'}`}
                style={{ padding: 18 }}
                aria-hidden={!isOpen && isMobile}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Package size={22} className="text-black" />
                        <h3 className="text-xl font-semibold text-gray-900">Product Category</h3>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsOpen(false)} className="text-gray-500">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </span>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search categories"
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <nav className={`space-y-1 pr-2 ${isMobile ? 'max-h-[56vh] overflow-auto' : ''}`}>
                    <LoadingLink
                        href="/"
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${!activeCategory && !activeSubcategory ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                            }`}
                        onClick={() => isMobile && setIsOpen(false)}
                        loadingText="Loading all packages..."
                    >
                        All Packages
                    </LoadingLink>

                    {filtered.length ? (
                        filtered.map((cat) => (
                            <div key={cat._id} className="pt-2">
                                <div className="flex items-center justify-between">
                                    <LoadingLink
                                        href={cat.slug === 'wordpress-plugins' ? '/plugins' : `/category/${cat.slug}`}
                                        className={`flex-1 text-sm font-medium px-2 py-2 rounded-md transition ${activeCategory === cat.slug ? 'text-purple-600' : 'text-gray-800 hover:text-purple-600'
                                            }`}
                                        onClick={() => isMobile && setIsOpen(false)}
                                        loadingText={`Loading ${cat.name}...`}
                                    >
                                        {cat.name}
                                    </LoadingLink>

                                    {(cat.hasSubcategories && (cat.subcategories || []).length > 0) && (
                                        <button
                                            onClick={() => toggleCategory(cat.slug)}
                                            aria-expanded={!!expandedCategories[cat.slug]}
                                            className="p-1 text-gray-400 hover:text-purple-600"
                                        >
                                            {expandedCategories[cat.slug] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    )}
                                </div>

                                {cat.hasSubcategories && (cat.subcategories || []).length > 0 && (
                                    <div className={`mt-1 pl-4 transition-all ${expandedCategories[cat.slug] ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                                        {(cat.subcategories || []).map(sub => (
                                            <LoadingLink
                                                key={sub._id}
                                                href={cat.slug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                className={`block text-sm py-2 px-2 rounded-md ${activeSubcategory === sub.slug ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'}`}
                                                onClick={() => isMobile && setIsOpen(false)}
                                                loadingText={`Loading ${sub.name}...`}
                                            >
                                                {sub.name}
                                            </LoadingLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-6 text-center text-gray-600">
                            <Search size={28} className="mx-auto mb-2 text-purple-500" />
                            <p className="text-sm">No categories found</p>
                            <button onClick={() => setSearchTerm('')} className="mt-2 text-sm text-purple-600">Clear</button>
                        </div>
                    )}
                </nav>

                {isMobile && (
                    <div className="mt-4 flex gap-3">
                        <button onClick={() => setIsOpen(false)} className="flex-1 bg-purple-600 text-white py-2 rounded-md">Apply</button>
                        <button onClick={() => { setSearchTerm(''); setIsOpen(false); }} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md">Reset</button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;