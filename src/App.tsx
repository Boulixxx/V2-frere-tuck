/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HouseholdProvider, useHousehold } from './context/HouseholdContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProofModal } from './components/ProofModal';
import { OverlapModal } from './components/OverlapModal';
import { RobinTransferModal } from './components/RobinTransferModal';
import { HouseholdManagerModal } from './components/HouseholdManagerModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { SituationChecker } from './views/SituationChecker';
import { ProtectionsAudit } from './views/ProtectionsAudit';
import { HouseholdView } from './views/HouseholdView';

const MainContent: React.FC = () => {
  const { activeTab } = useHousehold();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-12">
        {activeTab === 'situations' && <SituationChecker />}
        {activeTab === 'protections' && <ProtectionsAudit />}
        {activeTab === 'foyer' && <HouseholdView />}
      </main>

      {/* Subtle, quiet desktop footer */}
      <footer className="border-t border-slate-200 bg-white py-6 hidden md:block">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Frère Tuck</span>
            <span aria-hidden="true">·</span>
            <span>L’analyseur lucide de vos garanties</span>
          </div>
          <div className="text-slate-400">
            Démonstration interactive avec My Guaranties & Robin
          </div>
        </div>
      </footer>

      {/* Mobile fixed bottom navigation bar */}
      <BottomNav />

      {/* Interactive drawers & modals */}
      <ProofModal />
      <OverlapModal />
      <RobinTransferModal />
      <HouseholdManagerModal />
      <GoogleWorkspaceModal />
    </div>
  );
};

export default function App() {
  return (
    <HouseholdProvider>
      <MainContent />
    </HouseholdProvider>
  );
}
