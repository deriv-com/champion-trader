import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

const TradePage = lazy(() => import('@/screens/TradePage').then(module => ({ default: module.TradePage })));
const PositionsPage = lazy(() => import('@/screens/PositionsPage').then(module => ({ default: module.PositionsPage })));
const MenuPage = lazy(() => import('@/screens/MenuPage').then(module => ({ default: module.MenuPage })));

export const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<TradePage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
};
