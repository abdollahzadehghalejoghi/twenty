import { isNonEmptyString } from '@sniptt/guards';

import { Activity } from '@/activities/types/Activity';
import { ActivityTarget } from '@/activities/types/ActivityTarget';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { getActivityTargetsFilter } from '@/activities/utils/getActivityTargetsFilter';
import { useObjectMetadataItemOnly } from '@/object-metadata/hooks/useObjectMetadataItemOnly';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { OrderByField } from '@/object-metadata/types/OrderByField';
import { useReadFindManyRecordsQueryInCache } from '@/object-record/cache/hooks/useReadFindManyRecordsQueryInCache';
import { useUpsertFindManyRecordsQueryInCache } from '@/object-record/cache/hooks/useUpsertFindManyRecordsQueryInCache';
import { ObjectRecordQueryFilter } from '@/object-record/record-filter/types/ObjectRecordQueryFilter';
import { sortByAscString } from '~/utils/array/sortByAscString';

// TODO: create a generic hook from this
export const useInjectIntoActivitiesQuery = () => {
  const { objectMetadataItem: objectMetadataItemActivity } =
    useObjectMetadataItemOnly({
      objectNameSingular: CoreObjectNameSingular.Activity,
    });

  const {
    upsertFindManyRecordsQueryInCache: overwriteFindManyActivitiesInCache,
  } = useUpsertFindManyRecordsQueryInCache({
    objectMetadataItem: objectMetadataItemActivity,
  });

  const { objectMetadataItem: objectMetadataItemActivityTarget } =
    useObjectMetadataItemOnly({
      objectNameSingular: CoreObjectNameSingular.ActivityTarget,
    });

  const {
    readFindManyRecordsQueryInCache: readFindManyActivityTargetsQueryInCache,
  } = useReadFindManyRecordsQueryInCache({
    objectMetadataItem: objectMetadataItemActivityTarget,
  });

  const {
    readFindManyRecordsQueryInCache: readFindManyActivitiesQueryInCache,
  } = useReadFindManyRecordsQueryInCache({
    objectMetadataItem: objectMetadataItemActivity,
  });

  const {
    upsertFindManyRecordsQueryInCache:
      overwriteFindManyActivityTargetsQueryInCache,
  } = useUpsertFindManyRecordsQueryInCache({
    objectMetadataItem: objectMetadataItemActivityTarget,
  });

  const injectActivitiesQueries = ({
    activityToInject,
    activityTargetsToInject,
    targetableObjects,
    activitiesFilters,
    activitiesOrderByVariables,
  }: {
    activityToInject: Activity;
    activityTargetsToInject: ActivityTarget[];
    targetableObjects: ActivityTargetableObject[];
    activitiesFilters: ObjectRecordQueryFilter;
    activitiesOrderByVariables: OrderByField;
  }) => {
    const newActivity = {
      ...activityToInject,
      __typename: 'Activity',
    };

    const findManyActivitiyTargetsQueryFilter = getActivityTargetsFilter({
      targetableObjects,
    });

    const findManyActivitiyTargetsQueryVariables = {
      filter: findManyActivitiyTargetsQueryFilter,
    };

    const existingActivityTargets = readFindManyActivityTargetsQueryInCache({
      queryVariables: findManyActivitiyTargetsQueryVariables,
    });

    const newActivityTargets = [
      ...existingActivityTargets,
      ...activityTargetsToInject,
    ];

    const existingActivityIds = existingActivityTargets
      ?.map((activityTarget) => activityTarget.activityId)
      .filter(isNonEmptyString);

    const currentFindManyActivitiesQueryVariables = {
      filter: {
        id: {
          in: existingActivityIds.toSorted(sortByAscString),
        },
        ...activitiesFilters,
      },
      orderBy: activitiesOrderByVariables,
    };

    const existingActivities = readFindManyActivitiesQueryInCache({
      queryVariables: currentFindManyActivitiesQueryVariables,
    });

    const nextActivityIds = [...existingActivityIds, newActivity.id];

    const nextFindManyActivitiesQueryVariables = {
      filter: {
        id: {
          in: nextActivityIds.toSorted(sortByAscString),
        },
        ...activitiesFilters,
      },
      orderBy: activitiesOrderByVariables,
    };

    overwriteFindManyActivityTargetsQueryInCache({
      objectRecordsToOverwrite: newActivityTargets,
      queryVariables: findManyActivitiyTargetsQueryVariables,
    });

    const newActivities = [newActivity, ...existingActivities];

    overwriteFindManyActivitiesInCache({
      objectRecordsToOverwrite: newActivities,
      queryVariables: nextFindManyActivitiesQueryVariables,
    });
  };

  return {
    injectActivitiesQueries,
  };
};
