import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useSetRecoilState } from 'recoil';

import { useActivities } from '@/activities/hooks/useActivities';
import { TimelineCreateButtonGroup } from '@/activities/timeline/components/TimelineCreateButtonGroup';
import { FIND_MANY_TIMELINE_ACTIVITIES_ORDER_BY } from '@/activities/timeline/constants/FIND_MANY_TIMELINE_ACTIVITIES_ORDER_BY';
import { timelineTargetableObjectState } from '@/activities/timeline/states/timelineTargetableObjectState';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import {
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { isDefined } from '~/utils/isDefined';
import useI18n from '@/ui/i18n/useI18n';
import { TimelineItemsContainer } from './TimelineItemsContainer';

const StyledMainContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  border-top: ${({ theme }) =>
    useIsMobile() ? `1px solid ${theme.border.color.medium}` : 'none'};
  display: flex;
  flex-direction: column;
  height: 100%;

  justify-content: center;
`;

export const Timeline = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const { activities, initialized, noActivities } = useActivities({
    targetableObjects: [targetableObject],
    activitiesFilters: {},
    activitiesOrderByVariables: FIND_MANY_TIMELINE_ACTIVITIES_ORDER_BY,
    skip: !isDefined(targetableObject),
  });
  const { translate } = useI18n('translations');

  const setTimelineTargetableObject = useSetRecoilState(
    timelineTargetableObjectState,
  );

  useEffect(() => {
    setTimelineTargetableObject(targetableObject);
  }, [targetableObject, setTimelineTargetableObject]);

  const showEmptyState = noActivities;

  const showLoadingState = !initialized;

  if (showLoadingState) {
    // TODO: Display a beautiful loading page
    return <></>;
  }

  if (showEmptyState) {
    return (
      <AnimatedPlaceholderEmptyContainer>
        <AnimatedPlaceholder type="emptyTimeline" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            {translate('addYourFirstActivity')}
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>
            {translate('thereAreNoActivitiesAssociated')}
          </AnimatedPlaceholderEmptySubTitle>
        </AnimatedPlaceholderEmptyTextContainer>
        <TimelineCreateButtonGroup targetableObject={targetableObject} />
      </AnimatedPlaceholderEmptyContainer>
    );
  }

  return (
    <StyledMainContainer>
      <TimelineItemsContainer activities={activities} />
    </StyledMainContainer>
  );
};
