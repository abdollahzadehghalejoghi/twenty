import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { IconCopy, IconLink } from '@/ui/display/icon';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import useI18n from '@/ui/i18n/useI18n';
import { Button } from '@/ui/input/button/components/Button';
import { TextInput } from '@/ui/input/components/TextInput';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const StyledLinkContainer = styled.div`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing(2)};
`;

type WorkspaceInviteLinkProps = {
  inviteLink: string;
};

export const WorkspaceInviteLink = ({
  inviteLink,
}: WorkspaceInviteLinkProps) => {
  const theme = useTheme();
  const { translate } = useI18n('translations');
  const { enqueueSnackBar } = useSnackBar();

  return (
    <StyledContainer>
      <StyledLinkContainer>
        <TextInput value={inviteLink} disabled fullWidth />
      </StyledLinkContainer>
      <Button
        Icon={IconLink}
        variant="primary"
        accent="blue"
        title={translate('copyLink')}
        onClick={() => {
          enqueueSnackBar(translate('linkCopiedToClipboard'), {
            variant: 'success',
            icon: <IconCopy size={theme.icon.size.md} />,
            duration: 2000,
          });
          navigator.clipboard.writeText(inviteLink);
        }}
      />
    </StyledContainer>
  );
};
