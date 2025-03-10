import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import { useRecoilState } from 'recoil';

import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { SettingsHeaderContainer } from '@/settings/components/SettingsHeaderContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { ApiKeyInput } from '@/settings/developers/components/ApiKeyInput';
import { useGeneratedApiKeys } from '@/settings/developers/hooks/useGeneratedApiKeys';
import { generatedApiKeyFamilyState } from '@/settings/developers/states/generatedApiKeyFamilyState';
import { ApiKey } from '@/settings/developers/types/api-key/ApiKey';
import { computeNewExpirationDate } from '@/settings/developers/utils/compute-new-expiration-date';
import { formatExpiration } from '@/settings/developers/utils/format-expiration';
import { IconRepeat, IconSettings, IconTrash } from '@/ui/display/icon';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import useI18n from '@/ui/i18n/useI18n';
import { Button } from '@/ui/input/button/components/Button';
import { TextInput } from '@/ui/input/components/TextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Section } from '@/ui/layout/section/components/Section';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { useGenerateApiKeyTokenMutation } from '~/generated/graphql';

const StyledInfo = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.regular};
`;

const StyledInputContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

export const SettingsDevelopersApiKeyDetail = () => {
  const { translate } = useI18n('translations');
  const navigate = useNavigate();
  const { apiKeyId = '' } = useParams();

  const setGeneratedApi = useGeneratedApiKeys();
  const [generatedApiKey] = useRecoilState(
    generatedApiKeyFamilyState(apiKeyId),
  );
  const [generateOneApiKeyToken] = useGenerateApiKeyTokenMutation();
  const { createOneRecord: createOneApiKey } = useCreateOneRecord<ApiKey>({
    objectNameSingular: CoreObjectNameSingular.ApiKey,
  });
  const { updateOneRecord: updateApiKey } = useUpdateOneRecord<ApiKey>({
    objectNameSingular: CoreObjectNameSingular.ApiKey,
  });

  const { record: apiKeyData } = useFindOneRecord({
    objectNameSingular: CoreObjectNameSingular.ApiKey,
    objectRecordId: apiKeyId,
  });

  const deleteIntegration = async (redirect = true) => {
    await updateApiKey?.({
      idToUpdate: apiKeyId,
      updateOneRecordInput: { revokedAt: DateTime.now().toString() },
    });
    if (redirect) {
      navigate('/settings/developers');
    }
  };

  const createIntegration = async (
    name: string,
    newExpiresAt: string | null,
  ) => {
    const newApiKey = await createOneApiKey?.({
      name: name,
      expiresAt: newExpiresAt ?? '',
    });

    if (!newApiKey) {
      return;
    }

    const tokenData = await generateOneApiKeyToken({
      variables: {
        apiKeyId: newApiKey.id,
        expiresAt: newApiKey?.expiresAt,
      },
    });
    return {
      id: newApiKey.id,
      token: tokenData.data?.generateApiKeyToken.token,
    };
  };

  const regenerateApiKey = async () => {
    if (apiKeyData?.name) {
      const newExpiresAt = computeNewExpirationDate(
        apiKeyData.expiresAt,
        apiKeyData.createdAt,
      );
      const apiKey = await createIntegration(apiKeyData.name, newExpiresAt);
      await deleteIntegration(false);

      if (apiKey && apiKey.token) {
        setGeneratedApi(apiKey.id, apiKey.token);
        navigate(`/settings/developers/api-keys/${apiKey.id}`);
      }
    }
  };

  useEffect(() => {
    if (apiKeyData) {
      return () => {
        setGeneratedApi(apiKeyId, null);
      };
    }
  });

  return (
    <>
      {apiKeyData?.name && (
        <SubMenuTopBarContainer
          Icon={IconSettings}
          title={translate('settings')}
        >
          <SettingsPageContainer>
            <SettingsHeaderContainer>
              <Breadcrumb
                links={[
                  { children: 'Developers', href: '/settings/developers' },
                  { children: `${apiKeyData.name} API Key` },
                ]}
              />
            </SettingsHeaderContainer>
            <Section>
              {generatedApiKey ? (
                <>
                  <H2Title
                    title={translate('apiKey')}
                    description={translate('apiKeyDes')}
                  />
                  <ApiKeyInput apiKey={generatedApiKey} />
                  <StyledInfo>
                    {formatExpiration(apiKeyData?.expiresAt || '', true, false)}
                  </StyledInfo>
                </>
              ) : (
                <>
                  <H2Title
                    title={translate('apiKey')}
                    description={translate('regenerateAnApiKey')}
                  />
                  <StyledInputContainer>
                    <Button
                      title={translate('regenerateKey')}
                      Icon={IconRepeat}
                      onClick={regenerateApiKey}
                    />
                    <StyledInfo>
                      {formatExpiration(
                        apiKeyData?.expiresAt || '',
                        true,
                        false,
                      )}
                    </StyledInfo>
                  </StyledInputContainer>
                </>
              )}
            </Section>
            <Section>
              <H2Title
                title={translate('name')}
                description={translate('nameOfYourApiKey')}
              />
              <TextInput
                placeholder={translate('backofficeIntegration')}
                value={apiKeyData.name}
                disabled
                fullWidth
              />
            </Section>
            <Section>
              <H2Title
                title={translate('dangerZone')}
                description={translate('deleteThisIntegration')}
              />
              <Button
                accent="danger"
                variant="secondary"
                title={translate('disable')}
                Icon={IconTrash}
                onClick={() => deleteIntegration()}
              />
            </Section>
          </SettingsPageContainer>
        </SubMenuTopBarContainer>
      )}
    </>
  );
};
