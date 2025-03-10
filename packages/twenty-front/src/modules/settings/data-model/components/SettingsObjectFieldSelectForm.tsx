import styled from '@emotion/styled';
import { DropResult } from '@hello-pangea/dnd';
import { v4 } from 'uuid';

import { IconPlus } from '@/ui/display/icon';
import useI18n from '@/ui/i18n/useI18n';
import { LightButton } from '@/ui/input/button/components/LightButton';
import { CardContent } from '@/ui/layout/card/components/CardContent';
import { CardFooter } from '@/ui/layout/card/components/CardFooter';
import { DraggableItem } from '@/ui/layout/draggable-list/components/DraggableItem';
import { DraggableList } from '@/ui/layout/draggable-list/components/DraggableList';
import { mainColorNames, ThemeColor } from '@/ui/theme/constants/colors';
import { moveArrayItem } from '~/utils/array/moveArrayItem';

import { SettingsObjectFieldSelectFormOption } from '../types/SettingsObjectFieldSelectFormOption';

import { SettingsObjectFieldSelectFormOptionRow } from './SettingsObjectFieldSelectFormOptionRow';

export type SettingsObjectFieldSelectFormValues =
  SettingsObjectFieldSelectFormOption[];

type SettingsObjectFieldSelectFormProps = {
  onChange: (values: SettingsObjectFieldSelectFormValues) => void;
  values: SettingsObjectFieldSelectFormValues;
};

const StyledContainer = styled(CardContent)`
  padding-bottom: ${({ theme }) => theme.spacing(3.5)};
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  display: block;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: 6px;
  margin-top: ${({ theme }) => theme.spacing(1)};
  text-transform: uppercase;
`;

const StyledFooter = styled(CardFooter)`
  background-color: ${({ theme }) => theme.background.secondary};
  padding: ${({ theme }) => theme.spacing(1)};
`;

const StyledButton = styled(LightButton)`
  justify-content: center;
  width: 100%;
`;

const getNextColor = (currentColor: ThemeColor) => {
  const currentColorIndex = mainColorNames.findIndex(
    (color) => color === currentColor,
  );
  const nextColorIndex = (currentColorIndex + 1) % mainColorNames.length;
  return mainColorNames[nextColorIndex];
};

export const SettingsObjectFieldSelectForm = ({
  onChange,
  values,
}: SettingsObjectFieldSelectFormProps) => {
  const { translate } = useI18n('translations');
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const nextOptions = moveArrayItem(values, {
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    });

    onChange(nextOptions);
  };

  return (
    <>
      <StyledContainer>
        <StyledLabel>{translate('options')}</StyledLabel>
        <DraggableList
          onDragEnd={handleDragEnd}
          draggableItems={
            <>
              {values.map((option, index) => (
                <DraggableItem
                  key={option.id}
                  draggableId={option.id}
                  index={index}
                  isDragDisabled={values.length === 1}
                  itemComponent={
                    <SettingsObjectFieldSelectFormOptionRow
                      key={option.id}
                      isDefault={option.isDefault}
                      onChange={(nextOption) => {
                        const hasDefaultOptionChanged =
                          !option.isDefault && nextOption.isDefault;
                        const nextOptions = hasDefaultOptionChanged
                          ? values.map((value) => ({
                              ...value,
                              isDefault: false,
                            }))
                          : [...values];

                        nextOptions.splice(index, 1, nextOption);

                        onChange(nextOptions);
                      }}
                      onRemove={
                        values.length > 1
                          ? () => {
                              const nextOptions = [...values];
                              nextOptions.splice(index, 1);
                              onChange(nextOptions);
                            }
                          : undefined
                      }
                      option={option}
                    />
                  }
                />
              ))}
            </>
          }
        />
      </StyledContainer>
      <StyledFooter>
        <StyledButton
          title={translate('addOption')}
          Icon={IconPlus}
          onClick={() =>
            onChange([
              ...values,
              {
                color: getNextColor(values[values.length - 1].color),
                label: `Option ${values.length + 1}`,
                value: `Value ${values.length + 1}`,
                id: v4(),
              },
            ])
          }
        />
      </StyledFooter>
    </>
  );
};
