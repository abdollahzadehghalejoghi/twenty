import styled from '@emotion/styled';

import { RecordTableActionBar } from '@/object-record/record-table/action-bar/components/RecordTableActionBar';
import { RecordTableContextMenu } from '@/object-record/record-table/context-menu/components/RecordTableContextMenu';
import { SignInBackgroundMockContainer } from '@/sign-in-background-mock/components/SignInBackgroundMockContainer';
import { IconBuildingSkyscraper } from '@/ui/display/icon';
import useI18n from '@/ui/i18n/useI18n';
import { PageAddButton } from '@/ui/layout/page/PageAddButton';
import { PageBody } from '@/ui/layout/page/PageBody';
import { PageContainer } from '@/ui/layout/page/PageContainer';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { PageHotkeysEffect } from '@/ui/layout/page/PageHotkeysEffect';

const StyledTableContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const SignInBackgroundMockPage = () => {
  const { translate } = useI18n('translations');
  return (
    <PageContainer>
      <PageHeader title={translate('objects')} Icon={IconBuildingSkyscraper}>
        <PageHotkeysEffect onAddButtonClick={() => {}} />
        <PageAddButton onClick={() => {}} />
      </PageHeader>
      <PageBody>
        <StyledTableContainer>
          <SignInBackgroundMockContainer />
        </StyledTableContainer>
        <RecordTableActionBar recordTableId="mock" />
        <RecordTableContextMenu recordTableId="mock" />
      </PageBody>
    </PageContainer>
  );
};
