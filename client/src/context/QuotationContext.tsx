import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { QuotationItem } from "zs-crm-common";

type QuotationContextType = {
    items: QuotationItem[];
    addItem: (item: QuotationItem[]) => void;
    updateItem: (id: number, updates: Partial<QuotationItem>) => void;
    removeItem: (id: number) => void;
    clearItem: () => void;
    totalBodies: number;
    totalMarketRate: number,
    totalProvidedRate: number
};

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<QuotationItem[]>([]);

    const addItem = (item: QuotationItem[]) => {
        setItems(item);
    };

    const updateItem = (id: number, updates: Partial<QuotationItem>) => {
        setItems(prev =>
            prev.map(it =>
                it.id === id ? { ...it, ...updates } : it
            )
        );
    };

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(it => it.id !== id));
    };

    const totalBodies = useMemo(
        () =>
            items.reduce((sum, it) => {
                const qty = Number(it.qty) || 0;
                const perBayQty = Number(it.per_bay_qty) || 0;
                return sum + perBayQty * qty;
            }, 0),
        [items]
    );

    const totalMarketRate = useMemo(
        () =>
            items.reduce((sum, it) => {
                const qty = Number(it.qty) || 0;
                const rate = Number(it.market_rate) || 0;
                return sum + rate * qty;
            }, 0),
        [items]
    );

    const totalProvidedRate = useMemo(
        () =>
            items.reduce((sum, it) => {
                const qty = Number(it.qty) || 0;
                const rate = Number(it.provided_rate) || 0;
                return sum + rate * qty;
            }, 0),
        [items]
    );

    const clearItem = () => {
        setItems([]);
    }

    return (
        <QuotationContext.Provider
            value={{ items, addItem, updateItem, removeItem, totalBodies, clearItem, totalMarketRate, totalProvidedRate}}
        >
            {children}
        </QuotationContext.Provider>
    );
};

export const useQuotation = () => {
    const ctx = useContext(QuotationContext);
    if (!ctx) throw new Error("Must be used inside QuotationProvider");
    return ctx;
};
