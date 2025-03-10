import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MessageChannel } from '@/accounts/types/MessageChannel';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { SettingsAccountsInboxSettingsContactAutoCreateSection } from '@/settings/accounts/components/SettingsAccountsInboxSettingsContactAutoCreationSection';
import {
  InboxSettingsVisibilityValue,
  SettingsAccountsInboxSettingsVisibilitySection,
} from '@/settings/accounts/components/SettingsAccountsInboxSettingsVisibilitySection';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { AppPath } from '@/types/AppPath';
import { IconSettings } from '@/ui/display/icon';
import useI18n from '@/ui/i18n/useI18n';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';

export const SettingsAccountsEmailsInboxSettings = () => {
  const { translate } = useI18n('translations');

  const navigate = useNavigate();
  const { accountUuid: messageChannelId = '' } = useParams();

  const { record: messageChannel, loading } = useFindOneRecord<MessageChannel>({
    objectNameSingular: 'messageChannel',
    objectRecordId: messageChannelId,
  });

  const { updateOneRecord } = useUpdateOneRecord({
    objectNameSingular: 'messageChannel',
  });

  const handleVisibilityChange = (_value: InboxSettingsVisibilityValue) => {
    updateOneRecord({
      idToUpdate: messageChannelId,
      updateOneRecordInput: {
        visibility: _value,
      },
    });
  };

  const handleContactAutoCreationToggle = (value: boolean) => {
    updateOneRecord({
      idToUpdate: messageChannelId,
      updateOneRecordInput: {
        isContactAutoCreationEnabled: value,
      },
    });
  };

  useEffect(() => {
    if (!loading && !messageChannel) navigate(AppPath.NotFound);
  }, [loading, messageChannel, navigate]);

  if (!messageChannel) return null;

  return (
    <SubMenuTopBarContainer Icon={IconSettings} title={translate('settings')}>
      <SettingsPageContainer>
        <Breadcrumb
          links={[
            { children: translate('accounts'), href: '/settings/accounts' },
            { children: translate('emails'), href: '/settings/accounts/emails' },
            { children: messageChannel?.handle || '' },
          ]}
        />
        {/* TODO : discuss the desired sync behaviour */}
        {/* <SettingsAccountsInboxSettingsSynchronizationSection
          messageChannel={messageChannel}
          onToggle={handleSynchronizationToggle}
        /> */}
        <SettingsAccountsInboxSettingsVisibilitySection
          value={messageChannel?.visibility}
          onChange={handleVisibilityChange}
        />
        <SettingsAccountsInboxSettingsContactAutoCreateSection
          messageChannel={messageChannel}
          onToggle={handleContactAutoCreationToggle}
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
