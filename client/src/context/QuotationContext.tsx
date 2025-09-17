import type {  } from "@/features/quotation/pages/AddQuotationPage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { QuotationItem, QuotationProduct } from "zs-crm-common";

type QuotationContextType = {
  products: QuotationProduct[];
  addProduct: (items: QuotationItem[], name: string) => void;
  removeProduct: (productId: string) => void;
  updateItem: (
    productId: string,
    itemId: number,
    updates: Partial<QuotationItem>
  ) => void;
  updateCost: (productId: string, updates: Partial<QuotationProduct>) => void;
  removeItem: (productId: string, itemId: number) => void;
  clearAll: () => void;
  overallTotal: number;
  getProductItems: (productId: string) => QuotationItem[];
  getProductTotals: (productId: string) => {
    totalMarketRate: number;
    totalProvidedRate: number;
    totalBodies: number;
  };
};

const QuotationContext = createContext<QuotationContextType | undefined>(
  undefined
);

export const QuotationProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<QuotationProduct[]>([]);

  const calculateTotals = (items: QuotationItem[]) => {
    const totalMarketRate = items.reduce(
      (sum, item) => sum + item.qty * item.market_rate,
      0
    );
    const totalProvidedRate = items.reduce(
      (sum, item) => sum + item.qty * item.provided_rate,
      0
    );
    const totalBodies = items.reduce((sum, it) => {
      const qty = Number(it.qty) || 0;
      const perBayQty = Number(it.per_bay_qty) || 0;
      return sum + perBayQty * qty;
    }, 0);

    return { totalMarketRate, totalProvidedRate, totalBodies };
  };

  const addProduct = useCallback((items: QuotationItem[], name: string) => {
    const totals = calculateTotals(items);
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        items,
        powder_coating: 0,
        trolley_material: 0,
        ss_material: 0,
        labour_cost: 0,
        accomodation: 0,
        installation: 0,
        metal_rate: 0,
        total_market_rate: totals.totalMarketRate,
        total_provided_rate: totals.totalProvidedRate,
        total_weight: 0,
        total_body: totals.totalBodies,
        transport: 0,
        set: 1,
        profit_percent: 15
      },
    ]);
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateItem = useCallback(
    (
      productId: string,
      itemId: number,
      updates: Partial<QuotationItem>
    ) => {
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
    },
    []
  );

  const updateCost = useCallback(
    (productId: string, updates: Partial<QuotationProduct>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    []
  );

  const removeItem = useCallback((productId: string, itemId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;

        const updatedItems = p.items.filter((it) => it.id !== itemId);
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

  const getProductItems = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      return product?.items || [];
    },
    [products]
  );

  const getProductTotals = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return { totalMarketRate: 0, totalProvidedRate: 0, totalBodies: 0 };
      return {
        totalMarketRate: product.total_market_rate,
        totalProvidedRate: product.total_provided_rate,
        totalBodies: product.total_body,
      };
    },
    [products]
  );

  const clearAll = useCallback(() => setProducts([]), []);

  const overallTotal = useMemo(() => {
    return products.reduce((sum, product) => {
      const transport = product.transport;
      const accomodation = product.accomodation;
      const installation = product.installation * product.total_body;
      const totalAmount = product.total_provided_rate;
      const profit_percent = product.profit_percent / 100;
      return (
        sum + (transport + accomodation + installation + totalAmount) * (1 + profit_percent) * (product.set)
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
        removeProduct,
        updateItem,
        updateCost,
        removeItem,
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
