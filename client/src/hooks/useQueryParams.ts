import { useSearchParams } from "react-router";
import { formatDate } from "@/utils/formatDate";

const useQueryParams = () => {
  const [params, setSearchParams] = useSearchParams();

  const rows = Number(params.get("rows") || 25);
  const page = Number(params.get("page") || 1);
  const search = params.get("search") || "";
  const employeeIDs = params.get("employeeID")?.split(",").filter(Boolean) || [];
  const sources = params.get("sources")?.split(",").filter(Boolean) || [];
  const startDate = params.get("startDate") || "";
  const endDate = params.get("endDate") || "";
  const sortBy = params.get("sortBy") || "created_at";
  const sortOrder = params.get("sortOrder") || "desc";

  const setSort = (by: string | null, order?: "asc" | "desc") => {
    updateParams((params) => {
      if (!by) {
        params.set("sortBy", "created_at");
        params.set("sortOrder", "desc");
      } else {
        params.set("sortBy", by);
        params.set("sortOrder", order || "asc");
      }
    });
  };

  const updateParams = (updater: (params: URLSearchParams) => void) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updater(updated);
      return updated;
    });
  };

  const toggleItem = (key: string, id: string, currentList: string[]) => {
    const current = new Set(currentList);
    current.has(id) ? current.delete(id) : current.add(id);
    updateParams((params) => {
      const updated = Array.from(current);
      updated.length ? params.set(key, updated.join(",")) : params.delete(key);
      params.set("page", "1");
      params.set("rows", String(rows));
    });
  };

  const toggleEmployee = (id: string) => toggleItem("employeeID", id, employeeIDs);
  const toggleSource = (id: string) => toggleItem("sources", id, sources);

  const setPage = (newPage: number) => {
    updateParams((params) => {
      params.set("page", String(newPage));
      params.set("rows", String(rows));
    });
  };

  const setDate = (date: Date | undefined, type: "start" | "end" | "clear") => {
    const val = date ? formatDate(date) : "";
    updateParams((params) => {
      if (type === "start") val ? params.set("startDate", val) : params.delete("startDate");
      else if (type === "end") val ? params.set("endDate", val) : params.delete("endDate");
      else {
        params.delete("startDate");
        params.delete("endDate");
      }
      params.set("page", "1");
      params.set("rows", String(rows));
    });
  };

  const setSearch = (debouncedSearch: string, rawSearch: string) => {
    if (debouncedSearch === rawSearch) return;
    updateParams((params) => {
      debouncedSearch ? params.set("search", debouncedSearch) : params.delete("search");
      params.set("page", "1");
      params.set("rows", String(rows));
    });
  };

  const setRows = (value: string) => {
    updateParams((params) => {
      params.set("rows", value);
      params.set("page", "1");
    });
  };

  const clearFilter = () => {
    updateParams((params) => {
      ["search", "employeeID", "sources", "startDate", "endDate"].forEach((key) => params.delete(key));
      params.set("page", "1");
      params.set("rows", "25");
    });
  };

  return { page, rows, sortBy, sortOrder, search, employeeIDs, sources, startDate, endDate, toggleEmployee, toggleSource, setPage, setDate, setSearch, setRows, clearFilter, setSearchParams, setSort };
};

export default useQueryParams;
