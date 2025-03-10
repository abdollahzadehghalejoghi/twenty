import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

import { FieldMetadata } from '@/object-record/record-field/types/FieldMetadata';
import { useRecordTableStates } from '@/object-record/record-table/hooks/internal/useRecordTableStates';
import { useTableColumns } from '@/object-record/record-table/hooks/useTableColumns';
import { ColumnDefinition } from '@/object-record/record-table/types/ColumnDefinition';
import { IconSettings } from '@/ui/display/icon';
import { useIcons } from '@/ui/display/icon/hooks/useIcons';
import useI18n from '@/ui/i18n/useI18n';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { MenuItem } from '@/ui/navigation/menu-item/components/MenuItem';

export const RecordTableHeaderPlusButtonContent = () => {
  const { translate } = useI18n('translations');
  const { closeDropdown } = useDropdown();

  const { getHiddenTableColumnsSelector } = useRecordTableStates();

  const hiddenTableColumns = useRecoilValue(getHiddenTableColumnsSelector());

  const { getIcon } = useIcons();
  const { handleColumnVisibilityChange } = useTableColumns();

  const handleAddColumn = useCallback(
    (column: ColumnDefinition<FieldMetadata>) => {
      closeDropdown();
      handleColumnVisibilityChange(column);
    },
    [handleColumnVisibilityChange, closeDropdown],
  );

  const StyledMenuItemLink = styled(Link)`
    text-decoration: none;
    width: 100%;
  `;

  return (
    <>
      <DropdownMenuItemsContainer>
        {hiddenTableColumns.map((column) => (
          <MenuItem
            key={column.fieldMetadataId}
            onClick={() => handleAddColumn(column)}
            LeftIcon={getIcon(column.iconName)}
            text={column.label}
          />
        ))}
      </DropdownMenuItemsContainer>
      <DropdownMenuSeparator />
      <DropdownMenuItemsContainer>
        <StyledMenuItemLink to="/settings/objects">
          <MenuItem
            LeftIcon={IconSettings}
            text={translate('customizeFields')}
          />
        </StyledMenuItemLink>
      </DropdownMenuItemsContainer>
    </>
  );
};
