import React, { useEffect} from "react";
import { useIntl } from "react-intl"; // Importação para internacionalizar
import DashboardCard from "./DashboardCard";
import useDashboardData from "../../hooks/useDashboardData";
import SpinnerLeaf from "../commons/SpinnerLeaf";
import LineChartComponent from "./LineChartComponent";
import { connectGlobalWebSocket, disconnectGlobalWebSocket } from "../../websocket/globalWebSocket";
import { notificationStore } from "../../stores/notificationStore"; // Importa o store de notificações


function AdminDashboard() {
  const { data, loading, error } = useDashboardData();
  const intl = useIntl(); // Hook para traduzir

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const username = storedData?.username;
  
    if (username) {
      connectGlobalWebSocket(username, (message) => {
        console.log("🚀 WebSocket Global Message:", message);
  
        // Adicionar a notificação
        notificationStore.getState().addNotification(message);
  
        // Se quiseres abrir chat automático com alguém:
        if (message.type === "chat") {
          notificationStore.getState().openChatWith(message.senderUsername);
        }
      });
    }
  
    return () => {
      disconnectGlobalWebSocket();
    };
  }, []);

  const NA_Badge = (
    <span className="inline-block bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
      N/A
    </span>
  );

  const NoDataMessage = ({ messageId }) => (
    <div className="flex flex-col items-center justify-center text-gray-500 p-6">
      <div className="text-4xl mb-2">📭</div>
      <p className="text-sm">{intl.formatMessage({ id: messageId })}</p>
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
    return <div>{intl.formatMessage({ id: "admin.dashboard.loadingError" })}</div>;
  }

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">
        {intl.formatMessage({ id: "admin.dashboard.title" })}
      </h1>

      {/* Secção dos Cards (Resumo Rápido) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title={intl.formatMessage({ id: "admin.dashboard.cards.totalUsers" })} value={data?.totalUsers > 0 ? data.totalUsers : NA_Badge} />
        <DashboardCard title={intl.formatMessage({ id: "admin.dashboard.cards.confirmedUsers" })} value={data?.confirmedUsers > 0 ? data.confirmedUsers : NA_Badge} />
        <DashboardCard title={intl.formatMessage({ id: "admin.dashboard.cards.totalProducts" })} value={data?.totalProducts > 0 ? data.totalProducts : NA_Badge} />
        <DashboardCard title={intl.formatMessage({ id: "admin.dashboard.cards.publishedProducts" })} value={data?.publishedProducts > 0 ? data.publishedProducts : NA_Badge} />
      </section>

      <hr className="my-6 border-gray-200" />

      {/* Secção de Categorias Ordenadas */}
      <section className="bg-white shadow rounded-2xl p-6">
  <h2 className="text-2xl font-semibold mb-4">
    {intl.formatMessage({ id: "admin.dashboard.categories.title" })}
  </h2>
  {data?.popularCategories?.length > 0 ? (
  <ul className="list-none pl-0 flex flex-wrap justify-center gap-2 text-sm">
    {data.popularCategories
      .filter((category) => category.categoryName && category.categoryName.trim() !== "")
      .map((category, index) => (
        <li
          key={index}
          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-sm"
        >
          {category.categoryName} ({category.productCount})
        </li>
      ))}
  </ul>
) : (
  <NoDataMessage messageId="admin.dashboard.categories.noData" />
)}
</section>


      <hr className="my-6 border-gray-200" />

      {/* Secção de Produtos por Utilizador */}
      <section className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.title" })}</h2>
        {data?.productsPerUser?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.user" })}</th>
                  <th className="px-4 py-2 text-left">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.total" })}</th>
                  <th className="px-4 py-2 text-left">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.drafts" })}</th>
                  <th className="px-4 py-2 text-left">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.published" })}</th>
                  <th className="px-4 py-2 text-left">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.reserved" })}</th>
                  <th className="px-4 py-2 text-left">{intl.formatMessage({ id: "admin.dashboard.productsPerUser.purchased" })}</th>
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
          <NoDataMessage messageId="admin.dashboard.productsPerUser.noData" />
        )}
      </section>

      <hr className="my-6 border-gray-200" />

      {/* Secção do Tempo Médio para Compra */}
      <section className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">{intl.formatMessage({ id: "admin.dashboard.avgPurchaseTime.title" })}</h2>
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
          <h2 className="text-2xl font-semibold mb-4">{intl.formatMessage({ id: "admin.dashboard.usersOverTime.title" })}</h2>
          {data?.usersOverTime?.length > 0 ? (
            <LineChartComponent
              data={data.usersOverTime}
              dataKey="registeredUsers"
              dataKeyLabel={intl.formatMessage({ id: "admin.dashboard.productsPerUser.user" })}
            />
          ) : (
            <NoDataMessage messageId="admin.dashboard.usersOverTime.noData" />
          )}
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">{intl.formatMessage({ id: "admin.dashboard.productsPurchasedOverTime.title" })}</h2>
          {data?.productsPurchasedOverTime?.length > 0 ? (
            <LineChartComponent
              data={data.productsPurchasedOverTime}
              dataKey="purchasedProducts"
              dataKeyLabel={intl.formatMessage({ id: "admin.dashboard.productsPerUser.purchased" })}
            />
          ) : (
            <NoDataMessage messageId="admin.dashboard.productsPurchasedOverTime.noData" />
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;


