import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import useI18n from '@/ui/i18n/useI18n';
import { useObjectRecordTable } from '@/object-record/hooks/useObjectRecordTable';
import { StyledRow } from '@/object-record/record-table/components/RecordTableRow';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { isFetchingMoreRecordsFamilyState } from '@/object-record/states/isFetchingMoreRecordsFamilyState';
import { grayScale } from '@/ui/theme/constants/colors';

type RecordTableBodyFetchMoreLoaderProps = {
  objectNamePlural: string;
};

export const RecordTableBodyFetchMoreLoader = ({
  objectNamePlural,
}: RecordTableBodyFetchMoreLoaderProps) => {
  const { translate } = useI18n('translations');
  const { queryStateIdentifier } = useObjectRecordTable(objectNamePlural);
  const { setRecordTableLastRowVisible } = useRecordTable();

  const isFetchingMoreObjects = useRecoilValue(
    isFetchingMoreRecordsFamilyState(queryStateIdentifier),
  );

  const onLastRowVisible = useRecoilCallback(
    () => async (inView: boolean) => {
      setRecordTableLastRowVisible(inView);
    },
    [setRecordTableLastRowVisible],
  );

  const { ref: tbodyRef } = useInView({
    onChange: onLastRowVisible,
  });

  const StyledText = styled.div`
    align-items: center;
    box-shadow: none;
    color: ${grayScale.gray40};
    display: flex;
    height: 32px;
    margin-left: ${({ theme }) => theme.spacing(8)};
    padding-left: ${({ theme }) => theme.spacing(2)};
  `;

  return (
    <tbody ref={tbodyRef}>
      {isFetchingMoreObjects && (
        <StyledRow selected={false}>
          <td colSpan={7}>
            <StyledText>{translate('loadingMore')}</StyledText>
          </td>
          <td colSpan={7} />
        </StyledRow>
      )}
    </tbody>
  );
};
