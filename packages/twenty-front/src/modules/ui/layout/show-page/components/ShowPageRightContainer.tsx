import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

import { EmailThreads } from '@/activities/emails/components/EmailThreads';
import { Attachments } from '@/activities/files/components/Attachments';
import { Notes } from '@/activities/notes/components/Notes';
import { ObjectTasks } from '@/activities/tasks/components/ObjectTasks';
import { Timeline } from '@/activities/timeline/components/Timeline';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import {
  IconCheckbox,
  IconMail,
  IconNotes,
  IconPaperclip,
  IconTimelineEvent,
} from '@/ui/display/icon';
import useI18n from '@/ui/i18n/useI18n';
import { TabList } from '@/ui/layout/tab/components/TabList';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';

const StyledShowPageRightContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  justify-content: start;
  overflow: ${() => (useIsMobile() ? 'none' : 'hidden')};
  width: calc(100% + 4px);
`;

const StyledTabListContainer = styled.div`
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.border.color.light}`};
  box-sizing: border-box;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  height: 40px;
`;

export const TAB_LIST_COMPONENT_ID = 'show-page-right-tab-list';

type ShowPageRightContainerProps = {
  targetableObject: ActivityTargetableObject;
  timeline?: boolean;
  tasks?: boolean;
  notes?: boolean;
  emails?: boolean;
};

export const ShowPageRightContainer = ({
  targetableObject,
  timeline,
  tasks,
  notes,
  emails,
}: ShowPageRightContainerProps) => {
  const { translate } = useI18n('translations');
  const isMessagingEnabled = useIsFeatureEnabled('IS_MESSAGING_ENABLED');

  const { getActiveTabIdState } = useTabList(TAB_LIST_COMPONENT_ID);
  const activeTabId = useRecoilValue(getActiveTabIdState());

  const { objectMetadataItem: targetableObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: targetableObject.targetObjectNameSingular,
    });

  const shouldDisplayEmailsTab =
    (emails &&
      targetableObject.targetObjectNameSingular ===
        CoreObjectNameSingular.Company) ||
    targetableObject.targetObjectNameSingular === CoreObjectNameSingular.Person;

  const TASK_TABS = [
    {
      id: 'timeline',
      title: translate('timeline'),
      Icon: IconTimelineEvent,
      hide: !timeline,
    },
    {
      id: 'tasks',
      title: translate('tasks'),
      Icon: IconCheckbox,
      hide: !tasks,
    },
    {
      id: 'notes',
      title: translate('notes'),
      Icon: IconNotes,
      hide: !notes,
    },
    {
      id: 'files',
      title: translate('files'),
      Icon: IconPaperclip,
      hide: !notes,
      disabled: targetableObjectMetadataItem.isCustom,
    },
    {
      id: 'emails',
      title: translate('emails'),
      Icon: IconMail,
      hide: !shouldDisplayEmailsTab,
      disabled: !isMessagingEnabled,
    },
  ];

  return (
    <StyledShowPageRightContainer>
      <StyledTabListContainer>
        <TabList tabListId={TAB_LIST_COMPONENT_ID} tabs={TASK_TABS} />
      </StyledTabListContainer>
      {activeTabId === 'timeline' && (
        <Timeline targetableObject={targetableObject} />
      )}
      {activeTabId === 'tasks' && (
        <ObjectTasks targetableObject={targetableObject} />
      )}
      {activeTabId === 'notes' && <Notes targetableObject={targetableObject} />}
      {activeTabId === 'files' && (
        <Attachments targetableObject={targetableObject} />
      )}
      {activeTabId === 'emails' && <EmailThreads entity={targetableObject} />}
    </StyledShowPageRightContainer>
  );
};
