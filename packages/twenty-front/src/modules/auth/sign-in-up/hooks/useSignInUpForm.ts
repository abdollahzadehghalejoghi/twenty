import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRecoilValue } from 'recoil';
import { z } from 'zod';

import { PASSWORD_REGEX } from '@/auth/utils/passwordRegex.ts';
import { isSignInPrefilledState } from '@/client-config/states/isSignInPrefilledState.ts';

const validationSchema = z
  .object({
    exist: z.boolean(),
    email: z.string().trim().email('ایمیل باید معتبر باشد'),
    password: z
      .string()
      .regex(PASSWORD_REGEX, 'رمز عبور باید حداقل 8 کاراکتر داشته باشد'),
    workspaceInviteHash: z.string(),
  })
  .required();

export type Form = z.infer<typeof validationSchema>;
export const useSignInUpForm = () => {
  const isSignInPrefilled = useRecoilValue(isSignInPrefilledState);
  const form = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      exist: false,
    },
    resolver: zodResolver(validationSchema),
  });

  return { form: form };
};
