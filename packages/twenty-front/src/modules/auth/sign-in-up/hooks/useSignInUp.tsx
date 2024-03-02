import {useCallback, useState} from 'react';
import {SubmitHandler, UseFormReturn} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';

import {useNavigateAfterSignInUp} from '@/auth/sign-in-up/hooks/useNavigateAfterSignInUp.ts';
import {Form} from '@/auth/sign-in-up/hooks/useSignInUpForm.ts';
import {AppPath} from '@/types/AppPath';
import {PageHotkeyScope} from '@/types/PageHotkeyScope';
import {useSnackBar} from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import {useScopedHotkeys} from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import {useIsMatchingLocation} from '~/hooks/useIsMatchingLocation';

import {useAuth} from '../../hooks/useAuth';

export enum SignInUpMode {
    SignIn = 'sign-in',
    SignUp = 'sign-up',
    Invite = 'invite',
    AddMember = 'add-member',
}

export enum SignInUpStep {
    Init = 'init',
    Email = 'email',
    Password = 'password',
}

export const useSignInUp = (form: UseFormReturn<Form>) => {
    const navigate = useNavigate();
    const {enqueueSnackBar} = useSnackBar();

    const isMatchingLocation = useIsMatchingLocation();

    const workspaceInviteHash = useParams().workspaceInviteHash;

    const {navigateAfterSignInUp} = useNavigateAfterSignInUp();

    const [signInUpStep, setSignInUpStep] = useState<SignInUpStep>(
        SignInUpStep.Init,
    );

    const [signInUpMode, setSignInUpMode] = useState<SignInUpMode>(() => {
        if (isMatchingLocation(AppPath.Invite)) {
            return SignInUpMode.Invite;
        }
        if (isMatchingLocation(AppPath.SettingsWorkspaceMembers)) {
            return SignInUpMode.AddMember;
        }

        return isMatchingLocation(AppPath.SignIn)
            ? SignInUpMode.SignIn
            : SignInUpMode.SignUp;
    });

    const {
        signInWithCredentials,
        signUpWithCredentials,
        addMemberWithCredentials,
        checkUserExists: {checkUserExistsQuery},
    } = useAuth();

    const continueWithEmail = useCallback(() => {
        setSignInUpStep(SignInUpStep.Email);
        setSignInUpMode(
            isMatchingLocation(AppPath.SignIn)
                ? SignInUpMode.SignIn
                : SignInUpMode.SignUp,
        );
    }, [setSignInUpStep, setSignInUpMode, isMatchingLocation]);

    const continueWithCredentials = useCallback(() => {
        if (!form.getValues('email')) {
            return;
        }
        checkUserExistsQuery({
            variables: {
                email: form.getValues('email').toLowerCase().trim(),
            },
            onCompleted: (data) => {
                if (data?.checkUserExists.exists) {
                    setSignInUpMode(SignInUpMode.SignIn);
                } else {
                    setSignInUpMode(SignInUpMode.SignUp);
                }
                setSignInUpStep(SignInUpStep.Password);
            },
        });
    }, [setSignInUpStep, checkUserExistsQuery, form, setSignInUpMode]);

    const submitCredentials: SubmitHandler<Form> = useCallback(
        async (data) => {
            try {
                if (!data.email || !data.password) {
                    throw new Error('ایمیل و رمز عبور الزامی است');
                }


                if (signInUpMode === SignInUpMode.AddMember) {
                    const {email} = await addMemberWithCredentials(
                        data.email.toLowerCase().trim(),
                        data.password,
                        data.workspaceInviteHash,
                    );
                    if (email){
                        enqueueSnackBar('ثبت عضو با موفقیت انجام شد', {
                            variant: 'success',
                        });

                        navigate(0);
                    }
                } else {
                    const {
                        workspace: currentWorkspace,
                        workspaceMember: currentWorkspaceMember,
                    } =
                        signInUpMode === SignInUpMode.SignIn
                            ? await signInWithCredentials(
                                data.email.toLowerCase().trim(),
                                data.password,
                            )
                            : await signUpWithCredentials(
                                data.email.toLowerCase().trim(),
                                data.password,
                                workspaceInviteHash,
                            );

                    navigateAfterSignInUp(currentWorkspace, currentWorkspaceMember);
                }

            } catch (err: any) {
                enqueueSnackBar(err?.message, {
                    variant: 'error',
                });
            }
        },
        [
            signInUpMode,
            signInWithCredentials,
            signUpWithCredentials,
            workspaceInviteHash,
            navigateAfterSignInUp,
            enqueueSnackBar,
        ],
    );

    useScopedHotkeys(
        'enter',
        () => {
            if (signInUpStep === SignInUpStep.Init) {
                continueWithEmail();
            }

            if (signInUpStep === SignInUpStep.Email) {
                continueWithCredentials();
            }

            if (signInUpStep === SignInUpStep.Password) {
                form.handleSubmit(submitCredentials)();
            }
        },
        PageHotkeyScope.SignInUp,
        [continueWithEmail],
    );

    return {
        signInUpStep,
        signInUpMode,
        continueWithCredentials,
        continueWithEmail,
        submitCredentials,
    };
};
