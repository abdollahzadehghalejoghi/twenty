import { useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { IconSettings, IconTrash } from '@/ui/display/icon';
import { H1Title } from '@/ui/display/typography/components/H1Title';
import { H2Title } from '@/ui/display/typography/components/H2Title';
import useI18n from '@/ui/i18n/useI18n';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Section } from '@/ui/layout/section/components/Section';
import { WorkspaceInviteLink } from '@/workspace/components/WorkspaceInviteLink';
import { WorkspaceMemberCard } from '@/workspace/components/WorkspaceMemberCard';
import { WorkspaceMember } from '@/workspace-member/types/WorkspaceMember';
import { SignInUpStep, useSignInUp } from '@/auth/sign-in-up/hooks/useSignInUp.tsx';
import { Controller } from 'react-hook-form';
import { TextInput } from '@/ui/input/components/TextInput.tsx';
import { MainButton } from '@/ui/input/button/components/MainButton.tsx';
import { Loader } from '@/ui/feedback/loader/components/Loader.tsx';
import { motion } from 'framer-motion';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm.ts';

const StyledH1Title = styled(H1Title)`
  margin-bottom: 0;
`;

const StyledButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-left: ${({ theme }) => theme.spacing(3)};
`;

const StyledForm = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledFullWidthMotionDiv = styled(motion.div)`
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const SettingsWorkspaceMembers = () => {
  const { translate } = useI18n('translations');
  const { form } = useSignInUpForm();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [workspaceMemberToDelete, setWorkspaceMemberToDelete] = useState<string | undefined>();

  const [showErrors, setShowErrors] = useState(false);

  const {
    signInUpStep,
    continueWithCredentials,
    continueWithEmail,
    submitCredentials,
  } = useSignInUp(form);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (signInUpStep === SignInUpStep.Init) {
        continueWithEmail();
      } else if (signInUpStep === SignInUpStep.Email) {
        continueWithCredentials();
      } else if (signInUpStep === SignInUpStep.Password) {
        setShowErrors(true);
        form.handleSubmit(submitCredentials)();
      }
    }
  };

  const { records: workspaceMembers } = useFindManyRecords<WorkspaceMember>({
    objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
  });
  const { deleteOneRecord: deleteOneWorkspaceMember } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
  });
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  const handleRemoveWorkspaceMember = async (workspaceMemberId: string) => {
    await deleteOneWorkspaceMember?.(workspaceMemberId);
    setIsConfirmationModalOpen(false);
  };

  return (
    <SubMenuTopBarContainer Icon={IconSettings} title={translate('settings')}>
      <SettingsPageContainer>
        <StyledH1Title title={translate('members')} />
        {currentWorkspace?.inviteHash && (
          <Section>
            <H2Title
              title={translate('invite')}
              description={translate('sendInvitationUseTwenty')}
            />
            <WorkspaceInviteLink
              inviteLink={`${window.location.origin}/invite/${currentWorkspace?.inviteHash}`}
            />
          </Section>
        )}
        <Section>
          <H2Title
            title={translate('members')}
            description={translate('manageMembersYourSpaceHere')}
          />

          <StyledForm
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >

            <StyledFullWidthMotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                type: 'spring',
                stiffness: 800,
                damping: 35,
              }}
            >
              <Controller
                name="email"
                control={form.control}
                render={({
                           field: { onChange, onBlur, value },
                           fieldState: { error },
                         }) => (
                  <StyledInputContainer>
                    <TextInput
                      autoFocus
                      value={value}
                      placeholder={translate('email')}
                      onBlur={onBlur}
                      onChange={(value: string) => {
                        onChange(value);
                        if (signInUpStep === SignInUpStep.Password) {
                          continueWithEmail();
                        }
                      }}
                      error={showErrors ? error?.message : undefined}
                      onKeyDown={handleKeyDown}
                      fullWidth
                      disableHotkeys
                    />
                  </StyledInputContainer>
                )}
              />
            </StyledFullWidthMotionDiv>

            <StyledFullWidthMotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                type: 'spring',
                stiffness: 800,
                damping: 35,
              }}
            >
              <Controller
                name="password"
                control={form.control}
                render={({
                           field: { onChange, onBlur, value },
                           fieldState: { error },
                         }) => (
                  <StyledInputContainer>
                    <TextInput
                      autoFocus
                      value={value}
                      type="password"
                      placeholder={translate('password')}
                      onBlur={onBlur}
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      error={showErrors ? error?.message : undefined}
                      fullWidth
                      disableHotkeys
                    />
                  </StyledInputContainer>
                )}
              />
            </StyledFullWidthMotionDiv>

            <MainButton
              variant="secondary"
              title={translate('signUp')}
              type="submit"
              onClick={() => {
                form.setValue('workspaceInviteHash', currentWorkspace?.inviteHash || '')
                form.handleSubmit(submitCredentials)();
              }}
              Icon={() => form.formState.isSubmitting && <Loader />}
              disabled={
                SignInUpStep.Init
                  ? false
                  : signInUpStep === SignInUpStep.Email
                    ? !form.watch('email')
                    : !form.watch('email') ||
                    !form.watch('password') ||
                    form.formState.isSubmitting
              }
              fullWidth
            />
          </StyledForm>

          {workspaceMembers?.map((member) => (
            <WorkspaceMemberCard
              key={member.id}
              workspaceMember={member as WorkspaceMember}
              accessory={
                currentWorkspaceMember?.id !== member.id && (
                  <StyledButtonContainer>
                    <IconButton
                      onClick={() => {
                        setIsConfirmationModalOpen(true);
                        setWorkspaceMemberToDelete(member.id);
                      }}
                      variant="tertiary"
                      size="medium"
                      Icon={IconTrash}
                    />
                  </StyledButtonContainer>
                )
              }
            />
          ))}
        </Section>
      </SettingsPageContainer>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        title="Account Deletion"
        subtitle={<>{translate('accountDeletionDes')}</>}
        onConfirmClick={() =>
          workspaceMemberToDelete &&
          handleRemoveWorkspaceMember(workspaceMemberToDelete)
        }
        deleteButtonText={translate('deleteAccount')}
      />
    </SubMenuTopBarContainer>
  );
};
