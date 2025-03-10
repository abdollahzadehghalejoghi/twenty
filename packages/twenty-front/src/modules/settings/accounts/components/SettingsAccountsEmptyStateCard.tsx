import { useCallback } from 'react';
import styled from '@emotion/styled';

import { IconGoogle } from '@/ui/display/icon/components/IconGoogle';
import useI18n from '@/ui/i18n/useI18n';
import { Button } from '@/ui/input/button/components/Button';
import { Card } from '@/ui/layout/card/components/Card';
import { CardContent } from '@/ui/layout/card/components/CardContent';
import { CardHeader } from '@/ui/layout/card/components/CardHeader';
import { REACT_APP_SERVER_AUTH_URL } from '~/config';
import { useGenerateTransientTokenMutation } from '~/generated/graphql';

const StyledHeader = styled(CardHeader)`
  align-items: center;
  display: flex;
  height: ${({ theme }) => theme.spacing(6)};
`;

const StyledBody = styled(CardContent)`
  display: flex;
  justify-content: center;
`;

type SettingsAccountsEmptyStateCardProps = {
  label?: string;
};

export const SettingsAccountsEmptyStateCard = ({
  label,
}: SettingsAccountsEmptyStateCardProps) => {
  const [generateTransientToken] = useGenerateTransientTokenMutation();
  const { translate } = useI18n('translations');
  const handleGmailLogin = useCallback(async () => {
    const authServerUrl = REACT_APP_SERVER_AUTH_URL;

    const transientToken = await generateTransientToken();

    const token =
      transientToken.data?.generateTransientToken.transientToken.token;

    window.location.href = `${authServerUrl}/google-gmail?transientToken=${token}`;
  }, [generateTransientToken]);

  return (
    <Card>
      <StyledHeader>{label || translate('noConnectedAccount')}</StyledHeader>
      <StyledBody>
        <Button
          Icon={IconGoogle}
          title={translate('connectWithGoogle')}
          variant="secondary"
          onClick={handleGmailLogin}
        />
      </StyledBody>
    </Card>
  );
};
