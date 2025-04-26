import React from "react";
import DashboardCard from "./DashboardCard";
import useDashboardData from "../../hooks/useDashboardData";
import SpinnerLeaf from "../commons/SpinnerLeaf";
import LineChartComponent from "./LineChartComponent";

function AdminDashboard() {
  const { data, loading, error } = useDashboardData();

  const NA_Badge = (
    <span className="inline-block bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
      N/A
    </span>
  );

  const NoDataMessage = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-gray-500 p-6">
      <div className="text-4xl mb-2">📭</div>
      <p className="text-sm">{message}</p>
    </div>
  );

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
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Secção dos Cards (Resumo Rápido) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total de Utilizadores" value={data?.totalUsers > 0 ? data.totalUsers : NA_Badge} />
        <DashboardCard title="Utilizadores Confirmados" value={data?.confirmedUsers > 0 ? data.confirmedUsers : NA_Badge} />
        <DashboardCard title="Total de Produtos" value={data?.totalProducts > 0 ? data.totalProducts : NA_Badge} />
        <DashboardCard title="Produtos Publicados" value={data?.publishedProducts > 0 ? data.publishedProducts : NA_Badge} />
      </section>

      <hr className="my-6 border-gray-200" />

      {/* Secção de Categorias Ordenadas */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">🏷️ Categorias Populares</h2>
        {data?.popularCategories?.length > 0 ? (
          <ul className="list-disc pl-5 text-sm">
            {data.popularCategories.map((category, index) => (
              <li key={index}>
                {category.categoryName} ({category.productCount})
              </li>
            ))}
          </ul>
        ) : (
          <NoDataMessage message="Nenhuma categoria popular ainda." />
        )}
      </section>

      <hr className="my-6 border-gray-200" />

      {/* Secção de Produtos por Utilizador */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">👤 Produtos por Utilizador</h2>
        {data?.productsPerUser?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">🧑 Utilizador</th>
                  <th className="px-4 py-2 text-left">📦 Total</th>
                  <th className="px-4 py-2 text-left">✏️ Rascunhos</th>
                  <th className="px-4 py-2 text-left">📢 Publicados</th>
                  <th className="px-4 py-2 text-left">📌 Reservados</th>
                  <th className="px-4 py-2 text-left">🛒 Comprados</th>
                </tr>
              </thead>
              <tbody>
                {data.productsPerUser.map((user, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-200`}
                  >
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.totalProducts > 0 ? user.totalProducts : NA_Badge}</td>
                    <td className="px-4 py-2">{user.drafts > 0 ? user.drafts : NA_Badge}</td>
                    <td className="px-4 py-2">{user.published > 0 ? user.published : NA_Badge}</td>
                    <td className="px-4 py-2">{user.reserved > 0 ? user.reserved : NA_Badge}</td>
                    <td className="px-4 py-2">{user.purchased > 0 ? user.purchased : NA_Badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoDataMessage message="Nenhum produto associado a utilizadores." />
        )}
      </section>

      <hr className="my-6 border-gray-200" />

      {/* Secção do Tempo Médio para Compra */}
      <section className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">⏳ Tempo Médio até Compra</h2>
        {data?.averageTimeToPurchase && data.averageTimeToPurchase > 0 ? (
          <p className="text-4xl font-bold">{data.averageTimeToPurchase.toFixed(2)} dias</p>
        ) : (
          <div className="text-gray-500 text-sm">N/A</div>
        )}
      </section>

      <hr className="my-6 border-gray-200" />

      {/* Secção dos Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">👥 Utilizadores ao Longo do Tempo</h2>
          {data?.usersOverTime?.length > 0 ? (
            <LineChartComponent
              data={data.usersOverTime}
              dataKey="registeredUsers"
              dataKeyLabel="Utilizadores"
            />
          ) : (
            <NoDataMessage message="Sem registos de utilizadores ainda." />
          )}
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">🛒 Produtos Comprados ao Longo do Tempo</h2>
          {data?.productsPurchasedOverTime?.length > 0 ? (
            <LineChartComponent
              data={data.productsPurchasedOverTime}
              dataKey="purchasedProducts"
              dataKeyLabel="Comprados"
            />
          ) : (
            <NoDataMessage message="Sem compras registadas ainda." />
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;

