import React from 'react';
import styled from '@emotion/styled';

import useI18n from '@/ui/i18n/useI18n';
import { ColorScheme } from '@/workspace-member/types/WorkspaceMember';

import { ColorSchemeCard } from './ColorSchemeCard';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export type ColorSchemePickerProps = {
  value: ColorScheme;
  className?: string;
  onChange: (value: ColorScheme) => void;
};

export const ColorSchemePicker = ({
  value,
  onChange,
  className,
}: ColorSchemePickerProps) => {
  const { translate } = useI18n('translations');
  return (
    <StyledContainer className={className}>
      <StyledCardContainer>
        <ColorSchemeCard
          onClick={() => onChange('Light')}
          variant="Light"
          selected={value === 'Light'}
        />
        <StyledLabel>{translate('light')}</StyledLabel>
      </StyledCardContainer>
      <StyledCardContainer>
        <ColorSchemeCard
          onClick={() => onChange('Dark')}
          variant="Dark"
          selected={value === 'Dark'}
        />
        <StyledLabel>{translate('dark')}</StyledLabel>
      </StyledCardContainer>
      <StyledCardContainer>
        <ColorSchemeCard
          onClick={() => onChange('System')}
          variant="System"
          selected={value === 'System'}
        />
        <StyledLabel>{translate('systemSettings')}</StyledLabel>
      </StyledCardContainer>
    </StyledContainer>
  );
};
