import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";
import Product from "./components/views/Product/Product.tsx";
import Kasir from "./components/views/Sale/Kasir.tsx";
import Restock from "./components/views/Restock/Restock.tsx";
import Expense from "./components/views/Expense/Expense.tsx";
import Dashboard from "./components/views/Dashboard/Dashboard.tsx";
import Report from "./components/views/Report/Report.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="kasir" element={<Kasir />} />
            <Route path="produk" element={<Product />} />
            <Route path="restok" element={<Restock />} />
            <Route path="pengeluaran" element={<Expense />} />
            <Route path="laporan" element={<Report />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
