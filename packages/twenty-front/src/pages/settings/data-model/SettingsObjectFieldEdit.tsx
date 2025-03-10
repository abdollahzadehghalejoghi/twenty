import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFieldMetadataItem } from '@/object-metadata/hooks/useFieldMetadataItem';
import { useGetRelationMetadata } from '@/object-metadata/hooks/useGetRelationMetadata';
import { useObjectMetadataItemForSettings } from '@/object-metadata/hooks/useObjectMetadataItemForSettings';
import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { getFieldSlug } from '@/object-metadata/utils/getFieldSlug';
import { isLabelIdentifierField } from '@/object-metadata/utils/isLabelIdentifierField';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsHeaderContainer } from '@/settings/components/SettingsHeaderContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsObjectFieldCurrencyFormValues } from '@/settings/data-model/components/SettingsObjectFieldCurrencyForm';
import { SettingsObjectFieldFormSection } from '@/settings/data-model/components/SettingsObjectFieldFormSection';
import { SettingsObjectFieldTypeSelectSection } from '@/settings/data-model/components/SettingsObjectFieldTypeSelectSection';
import { useFieldMetadataForm } from '@/settings/data-model/hooks/useFieldMetadataForm';
import { AppPath } from '@/types/AppPath';
import { IconArchive, IconSettings } from '@/ui/display/icon';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import useI18n from '@/ui/i18n/useI18n';
import { Button } from '@/ui/input/button/components/Button';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Section } from '@/ui/layout/section/components/Section';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import {
  FieldMetadataType,
  RelationMetadataType,
} from '~/generated-metadata/graphql';

const canPersistFieldMetadataItemUpdate = (
  fieldMetadataItem: FieldMetadataItem,
) => {
  return (
    fieldMetadataItem.isCustom ||
    fieldMetadataItem.type === FieldMetadataType.Select
  );
};

export const SettingsObjectFieldEdit = () => {
  const { translate } = useI18n('translations');

  const navigate = useNavigate();
  const { enqueueSnackBar } = useSnackBar();

  const { objectSlug = '', fieldSlug = '' } = useParams();
  const { findActiveObjectMetadataItemBySlug } =
    useObjectMetadataItemForSettings();

  const activeObjectMetadataItem =
    findActiveObjectMetadataItemBySlug(objectSlug);

  const { disableMetadataField, editMetadataField } = useFieldMetadataItem();
  const activeMetadataField = activeObjectMetadataItem?.fields.find(
    (metadataField) =>
      metadataField.isActive && getFieldSlug(metadataField) === fieldSlug,
  );

  const getRelationMetadata = useGetRelationMetadata();
  const {
    relationFieldMetadataItem,
    relationObjectMetadataItem,
    relationType,
  } =
    useMemo(
      () =>
        activeMetadataField
          ? getRelationMetadata({
              fieldMetadataItem: activeMetadataField,
            })
          : null,
      [activeMetadataField, getRelationMetadata],
    ) ?? {};

  const {
    formValues,
    handleFormChange,
    hasFieldFormChanged,
    hasFormChanged,
    hasRelationFormChanged,
    hasSelectFormChanged,
    initForm,
    isInitialized,
    isValid,
    validatedFormValues,
  } = useFieldMetadataForm();

  useEffect(() => {
    if (!activeObjectMetadataItem || !activeMetadataField) {
      navigate(AppPath.NotFound);
      return;
    }

    const { defaultValue } = activeMetadataField;

    const currencyDefaultValue =
      activeMetadataField.type === FieldMetadataType.Currency
        ? (defaultValue as SettingsObjectFieldCurrencyFormValues | undefined)
        : undefined;

    const selectOptions = activeMetadataField.options?.map((option) => ({
      ...option,
      isDefault: defaultValue === option.value,
    }));
    selectOptions?.sort(
      (optionA, optionB) => optionA.position - optionB.position,
    );

    initForm({
      icon: activeMetadataField.icon ?? undefined,
      label: activeMetadataField.label,
      name: activeMetadataField.name,
      description: activeMetadataField.description ?? undefined,
      type: activeMetadataField.type,
      ...(currencyDefaultValue ? { currency: currencyDefaultValue } : {}),
      relation: {
        field: {
          icon: relationFieldMetadataItem?.icon,
          label: relationFieldMetadataItem?.label || '',
          name: relationFieldMetadataItem?.name || '',
        },
        objectMetadataId: relationObjectMetadataItem?.id || '',
        type: relationType || RelationMetadataType.OneToMany,
      },
      ...(selectOptions?.length ? { select: selectOptions } : {}),
    });
  }, [
    activeMetadataField,
    activeObjectMetadataItem,
    initForm,
    navigate,
    relationFieldMetadataItem?.icon,
    relationFieldMetadataItem?.label,
    relationFieldMetadataItem?.name,
    relationObjectMetadataItem?.id,
    relationType,
  ]);

  if (!isInitialized || !activeObjectMetadataItem || !activeMetadataField)
    return null;

  const canSave = isValid && hasFormChanged;

  const isLabelIdentifier = isLabelIdentifierField({
    fieldMetadataItem: activeMetadataField,
    objectMetadataItem: activeObjectMetadataItem,
  });

  const handleSave = async () => {
    if (!validatedFormValues) return;

    try {
      if (
        validatedFormValues.type === FieldMetadataType.Relation &&
        relationFieldMetadataItem?.id &&
        hasRelationFormChanged
      ) {
        await editMetadataField({
          icon: validatedFormValues.relation.field.icon,
          id: relationFieldMetadataItem.id,
          label: validatedFormValues.relation.field.label,
          name: validatedFormValues.relation.field.name,
        });
      }

      if (hasFieldFormChanged || hasSelectFormChanged) {
        await editMetadataField({
          description: validatedFormValues.description,
          icon: validatedFormValues.icon,
          id: activeMetadataField.id,
          label: validatedFormValues.label,
          name: validatedFormValues.name,
          options:
            validatedFormValues.type === FieldMetadataType.Select
              ? validatedFormValues.select
              : undefined,
        });
      }

      navigate(`/settings/objects/${objectSlug}`);
    } catch (error) {
      enqueueSnackBar((error as Error).message, {
        variant: 'error',
      });
    }
  };

  const handleDisable = async () => {
    await disableMetadataField(activeMetadataField);
    navigate(`/settings/objects/${objectSlug}`);
  };

  const shouldDisplaySaveAndCancel =
    canPersistFieldMetadataItemUpdate(activeMetadataField);

  return (
    <SubMenuTopBarContainer Icon={IconSettings} title={translate('settings')}>
      <SettingsPageContainer>
        <SettingsHeaderContainer>
          <Breadcrumb
            links={[
              { children: translate('objects'), href: '/settings/objects' },
              {
                children: activeObjectMetadataItem.labelPlural,
                href: `/settings/objects/${objectSlug}`,
              },
              { children: activeMetadataField.label },
            ]}
          />
          {shouldDisplaySaveAndCancel && (
            <SaveAndCancelButtons
              isSaveDisabled={!canSave}
              onCancel={() => navigate(`/settings/objects/${objectSlug}`)}
              onSave={handleSave}
            />
          )}
        </SettingsHeaderContainer>
        <SettingsObjectFieldFormSection
          disabled={!activeMetadataField.isCustom}
          disableNameEdition
          name={formValues.name}
          label={formValues.label}
          description={formValues.description}
          iconKey={formValues.icon}
          onChange={handleFormChange}
        />
        <SettingsObjectFieldTypeSelectSection
          disableCurrencyForm
          fieldMetadata={{
            icon: formValues.icon,
            label: formValues.label || translate('employees'),
            name: formValues.name || 'employees',
            id: activeMetadataField.id,
          }}
          objectMetadataId={activeObjectMetadataItem.id}
          onChange={handleFormChange}
          relationFieldMetadata={relationFieldMetadataItem}
          values={{
            type: formValues.type,
            currency: formValues.currency,
            relation: formValues.relation,
            select: formValues.select,
          }}
        />
        {!isLabelIdentifier && (
          <Section>
            <H2Title
              title={translate('dangerZone')}
              description={translate('disableThisField')}
            />
            <Button
              Icon={IconArchive}
              title={translate('disable')}
              size="small"
              onClick={handleDisable}
            />
          </Section>
        )}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
