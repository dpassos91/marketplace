import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { userAPI } from '../api/userAPI';
import SpinnerLeaf from '../components/commons/SpinnerLeaf';

function ConfirmAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'redirecting'
  const { confirmUser } = userAPI;

  useEffect(() => {
    const confirm = async () => {
      try {
        await confirmUser(token);
        setStatus('success');

        // ⏳ Aguarda e redireciona
        setTimeout(() => setStatus('redirecting'), 2000);
        setTimeout(() => navigate('/login'), 4000);

      } catch (error) {
        console.error("Erro na confirmação:", error);
        setStatus('error');

        // ⏳ Também redireciona após erro
        setTimeout(() => setStatus('redirecting'), 2000);
        setTimeout(() => navigate('/login'), 4000);
      }
    };

    if (token) {
      confirm();
    } else {
      setStatus('error');
      setTimeout(() => setStatus('redirecting'), 2000);
      setTimeout(() => navigate('/login'), 4000);
    }
  }, [token, navigate]);

  return (
    <div className="centered-message">
      {status === 'loading' && (
        <p>
          <FormattedMessage
            id="confirmAccount.loading"
            defaultMessage="A confirmar a sua conta..."
          />
        </p>
      )}

      {status === 'success' && (
        <>
          <img src="/img/confirm-success.png" alt="Conta confirmada" style={{ width: '200px' }} />
          <p>
            <FormattedMessage
              id="confirmAccount.success"
              defaultMessage="Conta confirmada com sucesso! Já pode iniciar sessão."
            />
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <img src="/img/confirm-error.png" alt="Erro na confirmação" style={{ width: '200px' }} />
          <p>
            <FormattedMessage
              id="confirmAccount.error"
              defaultMessage="Erro ao confirmar a conta. Token inválido ou conta já confirmada."
            />
          </p>
        </>
      )}

      {status === 'redirecting' && (
        <>
          <SpinnerLeaf />
          <p>
            <FormattedMessage
              id="confirmAccount.redirecting"
              defaultMessage="A redirecionar para a página de login..."
            />
          </p>
        </>
      )}
    </div>
  );
}

export default ConfirmAccount;

