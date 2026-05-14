import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { createRowParser } from "../utils/data";

function stripBom(text) {
  return String(text ?? "").replace(/^\uFEFF/, "");
}

export function useCsvData(config) {
  const [state, setState] = useState({
    data: [],
    columns: [],
    loading: true,
    error: null,
  });

  const rowParser = useMemo(() => createRowParser(config), [config]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const response = await fetch(config.dataPath);
        if (!response.ok) {
          throw new Error(`CSV request failed: ${response.status}`);
        }

        const rows = d3.csvParse(stripBom(await response.text()), rowParser);
        if (cancelled) {
          return;
        }

        setState({
          data: rows,
          columns: rows[0] ? Object.keys(rows[0]) : [],
          loading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          data: [],
          columns: [],
          loading: false,
          error,
        });
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [config.dataPath, rowParser]);

  return state;
}
