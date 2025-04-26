import React from "react";
import DashboardCard from "./DashboardCard";
import useDashboardData from "../../hooks/useDashboardData"; // ajusta o caminho conforme organização
import SpinnerLeaf from "../commons/SpinnerLeaf"; // ajusta o caminho conforme organização

function AdminDashboard() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <SpinnerLeaf />
      </div>
    );
  }

  if (error) {
    return <div>Erro ao carregar o dashboard.</div>;
  }

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Secção dos Cards (Resumo Rápido) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total de Utilizadores" value={data?.totalUsers ?? "..."} />
        <DashboardCard title="Utilizadores Confirmados" value={data?.confirmedUsers ?? "..."} />
        <DashboardCard title="Total de Produtos" value={data?.totalProducts ?? "..."} />
        <DashboardCard title="Produtos Publicados" value={data?.publishedProducts ?? "..."} />
      </section>

      {/* Secção de Categorias Ordenadas */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Categorias Populares</h2>
        {/* Tabela ou lista de categorias */}
      </section>

      {/* Secção de Produtos por Utilizador */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Produtos por Utilizador</h2>
        {/* Tabela de utilizadores */}
      </section>

      {/* Secção do Tempo Médio para Compra */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Tempo Médio até Compra</h2>
        {/* Número destacado */}
      </section>

      {/* Secção dos Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Utilizadores ao Longo do Tempo</h2>
          {/* Gráfico de linhas */}
        </div>
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Produtos Comprados ao Longo do Tempo</h2>
          {/* Gráfico cumulativo */}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
