import formatDate from "@/utils/formatDate";

export const toggleEmployee = (id: string, setSearchParams: any, employeeIDs: string[], rows: number) => {
    const current = new Set(employeeIDs);
    if (current.has(id)) {
        current.delete(id);
    } else {
        current.add(id);
    }
    setSearchParams((params: any) => {
        const updated = Array.from(current);
        if (updated.length > 0) {
            params.set("employeeID", updated.join(","));
        } else {
            params.delete("employeeID");
        }
        params.set("page", "1");
        params.set("rows", String(rows));
        return params;
    });
};

export const toggleSource = (id: string, setSearchParams: any, selectedSources: string[], rows: number) => {
    const current = new Set(selectedSources);
    if (current.has(id)) {
        current.delete(id);
    } else {
        current.add(id);
    }

    setSearchParams((params: any) => {
        const updated = Array.from(current);
        if (updated.length > 0) {
            params.set("sources", updated.join(","));
        } else {
            params.delete("sources");
        }
        params.set("page", "1");
        params.set("rows", String(rows))
        return params;
    });
};

export const setPage = (newPage: number, setSearchParams: any, rows: number) => {
    setSearchParams((params: any) => {
        params.set("page", String(newPage));
        params.set("rows", String(rows));
        return params;
    })
}

export const setDate = (date: Date | undefined, type: "start" | "end" | "clear", setSearchParams: any, rows: number) => {
    const val = date ? formatDate(date) : "";
    setSearchParams((params: any) => {
        if (type === "start") {
            if (val) params.set("startDate", val);
            else params.delete("startDate");
        } else if (type === "end") {
            if (val) params.set("endDate", val);
            else params.delete("endDate");
        } else {
            params.delete("startDate");
            params.delete("endDate");
        }
        params.set("page", "1");
        params.set("rows", String(rows));
        return params;
    });
}

export const setSearch = (debouncedSearch: string, search: string, setSearchParams: any, rows: number) => {
    if (debouncedSearch !== search) {
        setSearchParams((params: any) => {
            if (debouncedSearch) {
                params.set("search", debouncedSearch);
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            params.set("rows", String(rows));
            return params;
        });
    }
}

export const clearFilter = (setSearchParams: any) => {
    setSearchParams((params: any) => {
        params.delete("search");
        params.delete("employeeID");
        params.delete("sources");
        params.delete("endDate");
        params.delete("startDate");
        params.set("page", "1");
        params.set("rows", "25");
        return params;
    });
}