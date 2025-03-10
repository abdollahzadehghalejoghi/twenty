import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import useI18n from '@/ui/i18n/useI18n';
import { Section } from '@/ui/layout/section/components/Section';
import { Table } from '@/ui/layout/table/components/Table';
import { TableBody } from '@/ui/layout/table/components/TableBody';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';

import {
  SettingsAvailableStandardObjectItemTableRow,
  StyledAvailableStandardObjectTableRow,
} from './SettingsAvailableStandardObjectItemTableRow';

type SettingsAvailableStandardObjectsSectionProps = {
  objectItems: ObjectMetadataItem[];
  onChange: (selectedIds: Record<string, boolean>) => void;
  selectedIds: Record<string, boolean>;
};

export const SettingsAvailableStandardObjectsSection = ({
  objectItems,
  onChange,
  selectedIds,
}: SettingsAvailableStandardObjectsSectionProps) => {
  const { translate } = useI18n('translations');
  return (
    <Section>
      <H2Title
        title={translate('available')}
        description={translate('availableDsc')}
      />
      <Table>
        <StyledAvailableStandardObjectTableRow>
          <TableHeader></TableHeader>
          <TableHeader>{translate('name')}</TableHeader>
          <TableHeader>{translate('description')}</TableHeader>
          <TableHeader align="right">{translate('fields')}</TableHeader>
        </StyledAvailableStandardObjectTableRow>
        <TableBody>
          {objectItems.map((objectItem) => (
            <SettingsAvailableStandardObjectItemTableRow
              key={objectItem.id}
              isSelected={selectedIds[objectItem.id]}
              objectItem={objectItem}
              onClick={() =>
                onChange({
                  ...selectedIds,
                  [objectItem.id]: !selectedIds[objectItem.id],
                })
              }
            />
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};
