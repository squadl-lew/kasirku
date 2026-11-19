import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";
import PlaceholderPage from "./components/PlaceholderPage.tsx";
import Product from "./components/views/Product/Product.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route
              index
              element={<PlaceholderPage title="Dashboard" phase="Fase 5" />}
            />
            <Route
              path="kasir"
              element={<PlaceholderPage title="Kasir" phase="Fase 2" />}
            />
            <Route path="produk" element={<Product />} />
            <Route
              path="restok"
              element={<PlaceholderPage title="Restok" phase="Fase 3" />}
            />
            <Route
              path="pengeluaran"
              element={<PlaceholderPage title="Pengeluaran" phase="Fase 4" />}
            />
            <Route
              path="laporan"
              element={<PlaceholderPage title="Laporan" phase="Fase 5" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
