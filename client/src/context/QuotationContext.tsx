import { createContext, useCallback, useContext, useMemo, useState, type ReactNode, } from "react";
import type { Quotation_Working, QuotationItem, QuotationProduct } from "zs-crm-common";

type QuotationContextType = {
  products: QuotationProduct[];
  addProduct: (items: QuotationItem[], name: string, working?: Quotation_Working, productId?: number) => void;
  addItem : (productId: number) => void;
  removeProduct: (productId: number) => void;
  updateItem: (productId: number, itemId: number, updates: Partial<QuotationItem>) => void;
  updateCost: (productId: number, updates: Partial<QuotationProduct>) => void;
  softDeleteItem: (productId: number, itemId: number) => void;
  restoreItem: (productId: number, itemId: number) => void;
  clearAll: () => void;
  overallTotal: number;
  getProductItems: (productId: number) => QuotationItem[];
  getProductTotals: (productId: number) => { totalMarketRate: number; totalProvidedRate: number; totalBodies: number; };
};

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider = ({ children }: { children: ReactNode }) => {

  const [products, setProducts] = useState<QuotationProduct[]>([]);

  const calculateTotals = (items: QuotationItem[]) => {
    const activeItems = items.filter((it) => !it.removed);
    const totalMarketRate = activeItems.reduce(
      (sum, item) => sum + item.quantity * item.market_rate,
      0
    );
    const totalProvidedRate = activeItems.reduce(
      (sum, item) => sum + item.quantity * item.provided_rate,
      0
    );
    const totalBodies = activeItems.reduce((sum, it) => {
      const qty = Number(it.quantity) || 0;
      const perBayQty = Number(it.per_bay_qty) || 0;
      return sum + perBayQty * qty;
    }, 0);
    return { totalMarketRate, totalProvidedRate, totalBodies };
  };

  const addProduct = useCallback((items: QuotationItem[], name: string, working?: Quotation_Working, index?: number) => {
    const totals = calculateTotals(items);
    setProducts((prev) => [
      ...prev,
      {
        id: index ?? Date.now(),
        name,
        items,
        powder_coating: working?.powder_coating ?? 0,
        trolley_material: working?.trolley_material ?? 0,
        ss_material: working?.ss_material ?? 0,
        labour_cost: working?.labour_cost ?? 0,
        accomodation: working?.accomodation ?? 0,
        installation: working?.installation ?? 250,
        metal_rate: working?.metal_rate ?? "",
        total_market_rate: working?.market_total_cost ?? totals.totalMarketRate,
        total_provided_rate: working?.provided_total_cost ?? totals.totalProvidedRate,
        total_weight: working?.total_weight ?? 0,
        total_body: working?.total_body ?? totals.totalBodies,
        transport: working?.transport ?? 0,
        set: working?.set ?? 1,
        profit_percent: working?.profit_percent ?? 15,
        discount: working?.discount ?? 0
      },
    ]);
  }, []);

  const addItem = (productId: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;

        const newItem = {
          id: Date.now(), 
          name: "",
          height: 0,
          width: 0,
          depth: 0,
          quantity: 1,
          per_bay_qty: 0,
          provided_rate: 0,
          market_rate: 0,
          removed: false,
          code: null,
          description: null,
        };

        return {
          ...product,
          items: [...product.items, newItem],
        };
      })
    );
  };


  const removeProduct = useCallback((productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateItem = useCallback((productId: number, itemId: number, updates: Partial<QuotationItem>) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;
        const updatedItems = product.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        const totals = calculateTotals(updatedItems);
        return {
          ...product,
          items: updatedItems,
          total_market_rate: totals.totalMarketRate,
          total_provided_rate: totals.totalProvidedRate,
          total_body: totals.totalBodies,
        };
      })
    );
  }, []);

  const updateCost = useCallback((productId: number, updates: Partial<QuotationProduct>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  }, []);

  const softDeleteItem = useCallback((productId: number, itemId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedItems = p.items.map((it) =>
          it.id === itemId ? { ...it, removed: true } : it
        );
        const totals = calculateTotals(updatedItems);
        return {
          ...p,
          items: updatedItems,
          total_market_rate: totals.totalMarketRate,
          total_provided_rate: totals.totalProvidedRate,
          total_body: totals.totalBodies,
        };
      })
    );
  }, []);

  const restoreItem = useCallback((productId: number, itemId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedItems = p.items.map((it) =>
          it.id === itemId ? { ...it, removed: false } : it
        );
        const totals = calculateTotals(updatedItems);
        return {
          ...p,
          items: updatedItems,
          total_market_rate: totals.totalMarketRate,
          total_provided_rate: totals.totalProvidedRate,
          total_body: totals.totalBodies,
        };
      })
    );
  }, []);

  const getProductItems = useCallback((productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.items.filter((it) => !it.removed) : [];
  }, [products]);

  const getProductTotals = useCallback((productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { totalMarketRate: 0, totalProvidedRate: 0, totalBodies: 0 };
    return {
      totalMarketRate: product.total_market_rate,
      totalProvidedRate: product.total_provided_rate,
      totalBodies: product.total_body,
    };
  }, [products]);

  const clearAll = useCallback(() => setProducts([]), []);

  const overallTotal = useMemo(() => {
    return products.reduce((sum, product) => {
      const transport = product.transport;
      const accomodation = product.accomodation;
      const installation = product.installation * product.total_body;
      const totalAmount = product.total_provided_rate;
      const profit_percent = product.profit_percent / 100;
      const discount = product.discount / 100
      return (
        sum + (transport + accomodation + installation + totalAmount) * (1 + profit_percent) * (1 - discount) * (product.set)
      );
    }, 0);
  }, [products]);

  return (
    <QuotationContext.Provider
      value={{
        getProductItems,
        getProductTotals,
        products,
        addProduct,
        addItem,
        removeProduct,
        updateItem,
        updateCost,
        softDeleteItem,
        restoreItem,
        clearAll,
        overallTotal,
      }}
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
