import React from "react";
import { FormattedMessage } from "react-intl";

export default function UserProductStats({ products }) {
  const total = products.length;

  const stats = products.reduce((acc, product) => {
    const status = product.status || "Outro";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="user-product-stats">
      <h3>
        <FormattedMessage id="userProfile.stats.title" defaultMessage="Estatísticas dos Produtos" />
      </h3>
      <p>
        <FormattedMessage
          id="userProfile.stats.total"
          defaultMessage="Total de produtos: {total}"
          values={{ total }}
        />
      </p>
      <ul>
        {Object.entries(stats).map(([status, count]) => (
          <li key={status}>
            <FormattedMessage
              id={`userProfile.stats.${status.toLowerCase()}`}
              defaultMessage={`${status}: ${count}`}
              values={{ count }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
