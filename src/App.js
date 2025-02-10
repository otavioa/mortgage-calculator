import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SimuladorFinanciamento from './components/SimuladorFinanciamento';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-8">
          <section className="text-center">
            <h1 className="text-3xl font-bold text-primary-800 mb-4">
              Simulador de Financiamento Imobiliário
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare diferentes tipos de financiamento e encontre a melhor opção para seu imóvel. 
              Simule financiamentos SAC e PRICE com todas as taxas e custos inclusos.
            </p>
          </section>
          
          <SimuladorFinanciamento />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
