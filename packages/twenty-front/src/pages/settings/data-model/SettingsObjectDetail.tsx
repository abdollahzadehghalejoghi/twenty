import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';

import { useFieldMetadataItem } from '@/object-metadata/hooks/useFieldMetadataItem';
import { useObjectMetadataItemForSettings } from '@/object-metadata/hooks/useObjectMetadataItemForSettings';
import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { getFieldSlug } from '@/object-metadata/utils/getFieldSlug';
import { isLabelIdentifierField } from '@/object-metadata/utils/isLabelIdentifierField';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsAboutSection } from '@/settings/data-model/object-details/components/SettingsObjectAboutSection';
import { SettingsObjectFieldActiveActionDropdown } from '@/settings/data-model/object-details/components/SettingsObjectFieldActiveActionDropdown';
import { SettingsObjectFieldDisabledActionDropdown } from '@/settings/data-model/object-details/components/SettingsObjectFieldDisabledActionDropdown';
import {
  SettingsObjectFieldItemTableRow,
  StyledObjectFieldTableRow,
} from '@/settings/data-model/object-details/components/SettingsObjectFieldItemTableRow';
import { getFieldIdentifierType } from '@/settings/data-model/utils/getFieldIdentifierType';
import { AppPath } from '@/types/AppPath';
import { IconPlus, IconSettings } from '@/ui/display/icon';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import useI18n from '@/ui/i18n/useI18n';
import { Button } from '@/ui/input/button/components/Button';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Section } from '@/ui/layout/section/components/Section';
import { Table } from '@/ui/layout/table/components/Table';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableSection } from '@/ui/layout/table/components/TableSection';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { FieldMetadataType } from '~/generated-metadata/graphql';

const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

export const SettingsObjectDetail = () => {
  const { translate } = useI18n('translations');
  const navigate = useNavigate();

  const { objectSlug = '' } = useParams();
  const {
    disableObjectMetadataItem,
    editObjectMetadataItem,
    findActiveObjectMetadataItemBySlug,
  } = useObjectMetadataItemForSettings();

  const activeObjectMetadataItem =
    findActiveObjectMetadataItemBySlug(objectSlug);

  useEffect(() => {
    if (!activeObjectMetadataItem) navigate(AppPath.NotFound);
  }, [activeObjectMetadataItem, navigate]);

  const { activateMetadataField, disableMetadataField, eraseMetadataField } =
    useFieldMetadataItem();

  if (!activeObjectMetadataItem) return null;

  const activeMetadataFields = activeObjectMetadataItem.fields.filter(
    (metadataField) => metadataField.isActive && !metadataField.isSystem,
  );
  const disabledMetadataFields = activeObjectMetadataItem.fields.filter(
    (metadataField) => !metadataField.isActive && !metadataField.isSystem,
  );

  const handleDisableObject = async () => {
    await disableObjectMetadataItem(activeObjectMetadataItem);
    navigate('/settings/objects');
  };

  const handleDisableField = (activeFieldMetadatItem: FieldMetadataItem) => {
    disableMetadataField(activeFieldMetadatItem);
  };

  const handleSetLabelIdentifierField = (
    activeFieldMetadatItem: FieldMetadataItem,
  ) => {
    editObjectMetadataItem({
      ...activeObjectMetadataItem,
      labelIdentifierFieldMetadataId: activeFieldMetadatItem.id,
    });
  };

  return (
    <SubMenuTopBarContainer Icon={IconSettings} title={translate('settings')}>
      <SettingsPageContainer>
        <Breadcrumb
          links={[
            { children: translate('objects'), href: '/settings/objects' },
            { children: activeObjectMetadataItem.labelPlural },
          ]}
        />
        <SettingsAboutSection
          iconKey={activeObjectMetadataItem.icon ?? undefined}
          name={activeObjectMetadataItem.labelPlural || ''}
          isCustom={activeObjectMetadataItem.isCustom}
          onDisable={handleDisableObject}
          onEdit={() => navigate('./edit')}
        />
        <Section>
          <H2Title
            title={translate('fields')}
            description={translate('fieldsDes', {
              labelSingular: activeObjectMetadataItem.labelSingular,
            })}
          />
          <Table>
            <StyledObjectFieldTableRow>
              <TableHeader>{translate('name')}</TableHeader>
              <TableHeader>
                {activeObjectMetadataItem.isCustom
                  ? 'Identifier'
                  : translate('fieldType')}
              </TableHeader>
              <TableHeader>{translate('dataType')}</TableHeader>
              <TableHeader></TableHeader>
            </StyledObjectFieldTableRow>
            {!!activeMetadataFields.length && (
              <TableSection title="Active">
                {activeMetadataFields.map((activeMetadataField) => {
                  const isLabelIdentifier = isLabelIdentifierField({
                    fieldMetadataItem: activeMetadataField,
                    objectMetadataItem: activeObjectMetadataItem,
                  });
                  const canBeSetAsLabelIdentifier =
                    activeObjectMetadataItem.isCustom &&
                    !isLabelIdentifier &&
                    [FieldMetadataType.Text, FieldMetadataType.Number].includes(
                      activeMetadataField.type,
                    );

                  return (
                    <SettingsObjectFieldItemTableRow
                      key={activeMetadataField.id}
                      identifierType={getFieldIdentifierType(
                        activeMetadataField,
                        activeObjectMetadataItem,
                      )}
                      variant={
                        activeObjectMetadataItem.isCustom
                          ? 'identifier'
                          : 'field-type'
                      }
                      fieldMetadataItem={activeMetadataField}
                      ActionIcon={
                        <SettingsObjectFieldActiveActionDropdown
                          isCustomField={!!activeMetadataField.isCustom}
                          scopeKey={activeMetadataField.id}
                          onEdit={() =>
                            navigate(`./${getFieldSlug(activeMetadataField)}`)
                          }
                          onSetAsLabelIdentifier={
                            canBeSetAsLabelIdentifier
                              ? () =>
                                  handleSetLabelIdentifierField(
                                    activeMetadataField,
                                  )
                              : undefined
                          }
                          onDisable={
                            isLabelIdentifier
                              ? undefined
                              : () => handleDisableField(activeMetadataField)
                          }
                        />
                      }
                    />
                  );
                })}
              </TableSection>
            )}
            {!!disabledMetadataFields.length && (
              <TableSection
                isInitiallyExpanded={false}
                title={translate('disabled')}
              >
                {disabledMetadataFields.map((disabledMetadataField) => (
                  <SettingsObjectFieldItemTableRow
                    key={disabledMetadataField.id}
                    variant={
                      activeObjectMetadataItem.isCustom
                        ? 'identifier'
                        : 'field-type'
                    }
                    fieldMetadataItem={disabledMetadataField}
                    ActionIcon={
                      <SettingsObjectFieldDisabledActionDropdown
                        isCustomField={!!disabledMetadataField.isCustom}
                        scopeKey={disabledMetadataField.id}
                        onActivate={() =>
                          activateMetadataField(disabledMetadataField)
                        }
                        onErase={() =>
                          eraseMetadataField(disabledMetadataField)
                        }
                      />
                    }
                  />
                ))}
              </TableSection>
            )}
          </Table>
          <StyledDiv>
            <Button
              Icon={IconPlus}
              title={translate('addField')}
              size="small"
              variant="secondary"
              onClick={() =>
                navigate(
                  disabledMetadataFields.length
                    ? './new-field/step-1'
                    : './new-field/step-2',
                )
              }
            />
          </StyledDiv>
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
